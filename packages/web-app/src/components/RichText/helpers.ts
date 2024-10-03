import {
  Card,
  TextContentBlockTypes,
  SlateJSON,
  TextContentBlockType,
} from '@learn-to-win/common/features/Cards/cardTypes';
import {
  CustomTypes,
  Editor,
  Element as SlateElement,
  Node,
  Transforms,
  Range,
} from 'slate';
import {
  CustomElement,
  CustomSize,
} from '@learn-to-win/common/types/RichTextTypes';

const map: Record<TextContentBlockTypes, CustomTypes['Element']['type']> = {
  title: 'title',
  expandableList: 'title',
  subtitle: 'subtitle',
  body: 'paragraph',
  multipleChoice: 'paragraph',
  trueFalse: 'paragraph',
};

// Migrates the content block to use json property instead of text
// TODO: Implement actual content block versioning
export function migrateContentBlock(
  card: Card,
  blockId: string,
  blockType: TextContentBlockTypes,
) {
  const contentBlock = card.json.contentBlocks.find(
    (block) => block.id === blockId,
  ) as TextContentBlockType;

  return contentBlock && 'json' in contentBlock
    ? contentBlock?.json
    : [
        {
          type: map[blockType],
          children: [
            { text: 'text' in contentBlock ? contentBlock?.text ?? '' : '' },
          ],
        },
      ];
}

/*
  The below methods are adapted from https://github.com/ianstormtaylor/slate/blob/v0.61.3/site/examples/richtext.tsx#L63
 */

const LIST_TYPES = ['numbered-list', 'bulleted-list'] as const;
const TEXT_ALIGN_TYPES = ['left', 'center', 'right', 'justify'] as const;
type ListType = (typeof LIST_TYPES)[number];
type TextAlignType = (typeof TEXT_ALIGN_TYPES)[number];
export type BlockFormatType = ListType | TextAlignType;

// Toggles the format (center alignment, bulleted list, etc) of the currently selected block.
export const toggleBlock = (editor: Editor, format: BlockFormatType) => {
  const isActive = isBlockActive(
    editor,
    format,
    TEXT_ALIGN_TYPES.some((x) => x === format) ? 'align' : 'type',
  );
  const isList = LIST_TYPES.some((x) => x === format);

  Transforms.unwrapNodes(editor, {
    match: (node) =>
      !Editor.isEditor(node) &&
      SlateElement.isElement(node) &&
      LIST_TYPES.some((x) => x === node.type) &&
      !TEXT_ALIGN_TYPES.some((x) => x === format),
    split: true,
  });
  let newProperties: Partial<SlateElement>;
  if (TEXT_ALIGN_TYPES.some((x) => x === format)) {
    newProperties = {
      align: isActive ? undefined : (format as TextAlignType),
    };
  } else {
    let elementType: CustomTypes['Element']['type'];
    if (isActive) {
      elementType = 'paragraph';
    } else if (isList) {
      elementType = 'list-item';
    } else {
      elementType = format as ListType;
    }
    newProperties = {
      type: elementType,
    };
  }
  Transforms.setNodes<SlateElement>(editor, newProperties);

  if (!isActive && isList) {
    const block = { type: format, children: [] } as SlateElement;
    Transforms.wrapNodes(editor, block);
  }
};

// Checks if any of the currently selected blocks have the format (center alignment, bulleted list, etc) applied.
export const isBlockActive = (
  editor: Editor,
  format: BlockFormatType,
  blockType = 'type' as 'type' | 'align',
) => {
  const { selection } = editor;
  if (!selection) return false;

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (node) =>
        !Editor.isEditor(node) &&
        SlateElement.isElement(node) &&
        node[blockType] === format,
    }),
  );

  return !!match;
};

export type FormatType =
  | 'bold'
  | 'italic'
  | 'underline'
  | 'strikethrough'
  | 'color'
  | 'backgroundColor';

// Toggles bold or another kind of mark for the current selection.
export const toggleMark = (
  editor: CustomTypes['Editor'],
  format: FormatType,
) => {
  const isActive = isMarkActive(editor, format);
  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

// Toggles mark for text size: small, medium, large.
export const toggleSizeMark = (
  editor: CustomTypes['Editor'],
  format: CustomSize,
) => {
  const isActive = isSizeMarkActive(editor, format);
  if (isActive && ['large', 'small'].includes(format)) {
    Editor.removeMark(editor, 'size');
    Editor.addMark(editor, 'size', 'medium');
  } else {
    // Remove existing size mark
    Editor.removeMark(editor, 'size');
    Editor.addMark(editor, 'size', format);
  }
};

export const isMarkActive = (
  editor: CustomTypes['Editor'],
  format: FormatType,
) => {
  const marks = Editor.marks(editor);
  return marks ? !!marks[format] : false;
};

export const isSizeMarkActive = (
  editor: CustomTypes['Editor'],
  format: CustomSize,
) => {
  const marks = Editor.marks(editor);
  let isSizeMarkActive = false;
  isSizeMarkActive = marks ? marks.size === format : false;

  if (
    !['small', 'large'].includes(marks?.size as string) &&
    !isSizeMarkActive &&
    format === 'medium'
  ) {
    isSizeMarkActive = true;
  }

  return isSizeMarkActive;
};

export function serializeRichText(richText: SlateJSON): string {
  if (!(richText instanceof Array)) {
    return '';
  }
  return richText?.map((node) => Node.string(node)).join('\n');
}

export function serializeCard(card: Card): string {
  return card.json.contentBlocks
    .map((block) => {
      if ('json' in block) {
        return serializeRichText(block.json);
      }
      if (
        block.type === 'video' ||
        block.type === 'audio' ||
        block.type === 'image'
      ) {
        return block.url;
      }
      if ('text' in block) {
        return block.text;
      }
    })
    .join('\n');
}

export const isLinkActive = (editor: CustomTypes['Editor']) => {
  const [link] = Editor.nodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      n.type === ElementType.LINK,
  });
  return !!link;
};

export const getLink = (editor: CustomTypes['Editor']): string => {
  const [link] = Editor.nodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      n.type === ElementType.LINK,
  });
  if (!link) return '';
  const url = (link[0] as CustomElement).url;
  return url ?? '';
};

export const wrapLink = (editor: CustomTypes['Editor'], url: string) => {
  if (isLinkActive(editor)) {
    unwrapLink(editor);
  }

  const { selection } = editor;
  const isCollapsed = selection && Range.isCollapsed(selection);
  const link: CustomElement = {
    type: ElementType.LINK,
    url,
    children: isCollapsed ? [{ text: url }] : [],
  };

  if (isCollapsed) {
    Transforms.insertNodes(editor, link);
  } else {
    Transforms.wrapNodes(editor, link, { split: true });
    Transforms.collapse(editor, { edge: 'end' });
  }
};

export const unwrapLink = (editor: CustomTypes['Editor']) => {
  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      n.type === ElementType.LINK,
  });
};

export const setMark = (
  editor: CustomTypes['Editor'],
  mark: string,
  value: string | boolean,
) => {
  Editor.addMark(editor, mark, value);
};

export const getMark = (editor: CustomTypes['Editor'], mark: FormatType) => {
  const marks = Editor.marks(editor);
  return marks?.[mark];
};

export const removeMark = (editor: CustomTypes['Editor'], mark: string) => {
  Editor.removeMark(editor, mark);
};

export enum ElementType {
  TITLE = 'title',
  SUBTITLE = 'subtitle',
  LINK = 'link',
  PARAGRAPH = 'paragraph',
  ORDERED_LIST = 'numbered-list',
  UNORDERED_LIST = 'bulleted-list',
  LIST_ITEM = 'list-item',
  LIST_ITEM_TEXT = 'list-item-text',
}
