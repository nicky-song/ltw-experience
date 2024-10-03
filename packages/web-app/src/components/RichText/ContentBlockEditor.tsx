import {
  Card,
  SlateJSON,
  TextContentBlockTypes,
} from '@learn-to-win/common/features/Cards/cardTypes';
import { useCallback, useState } from 'react';
import {
  Editable,
  RenderElementProps,
  RenderLeafProps,
  Slate,
  withReact,
  ReactEditor,
} from 'slate-react';
import {
  createEditor,
  Descendant,
  Range,
  Element as SlateElement,
  Node,
} from 'slate';
import classNames from 'classnames';
import EditorControl, { EditorControlProps } from '@components/EditorControl';
import { serializeRichText, setMark, removeMark, ElementType } from './helpers';
import { useDebouncedCallback } from '@hooks/useDebouncedCallback';
import { useEditContentBlockControls } from '@components/ContentBlock/contentBlockHooks';
import {
  ListType,
  ListsSchema,
  withLists,
  onKeyDown,
} from '@prezly/slate-lists';

interface ContentBlockEditorProps {
  blockId: string;
  disableInputType?: Array<string>;
  card: Card;
  editable: boolean;
  blockType: TextContentBlockTypes;
  editableText: SlateJSON;
  editorControlProps: Omit<
    EditorControlProps,
    'onMoveDown' | 'onMoveUp' | 'children' | 'show' | 'textLength'
  >;
  save: (
    richText: SlateJSON,
    card: Card,
    blockId: string,
    blockType: string,
    titleSynced?: boolean,
  ) => void;
}

type EditorWithPrevSelection = ReactEditor & {
  prevSelection: Range | undefined;
};

const schema: ListsSchema = {
  isConvertibleToListTextNode(node: Node) {
    return SlateElement.isElementType(node, ElementType.PARAGRAPH);
  },
  isDefaultTextNode(node: Node) {
    return SlateElement.isElementType(node, ElementType.PARAGRAPH);
  },
  isListNode(node: Node, type?: ListType) {
    if (type === ListType.ORDERED) {
      return SlateElement.isElementType(node, ElementType.ORDERED_LIST);
    }
    if (type === ListType.UNORDERED) {
      return SlateElement.isElementType(node, ElementType.UNORDERED_LIST);
    }
    return (
      SlateElement.isElementType(node, ElementType.ORDERED_LIST) ||
      SlateElement.isElementType(node, ElementType.UNORDERED_LIST)
    );
  },
  isListItemNode(node: Node) {
    return SlateElement.isElementType(node, ElementType.LIST_ITEM);
  },
  isListItemTextNode(node: Node) {
    return SlateElement.isElementType(node, ElementType.LIST_ITEM_TEXT);
  },
  createDefaultTextNode(props = {}) {
    return { children: [{ text: '' }], ...props, type: ElementType.PARAGRAPH };
  },
  createListNode(type: ListType = ListType.UNORDERED, props = {}) {
    const nodeType =
      type === ListType.ORDERED
        ? ElementType.ORDERED_LIST
        : ElementType.UNORDERED_LIST;
    return { children: [{ text: '' }], ...props, type: nodeType };
  },
  createListItemNode(props = {}) {
    return { children: [{ text: '' }], ...props, type: ElementType.LIST_ITEM };
  },
  createListItemTextNode(props = {}) {
    return {
      children: [{ text: '' }],
      ...props,
      type: ElementType.LIST_ITEM_TEXT,
    };
  },
};

export function ContentBlockEditor({
  blockId,
  card,
  editable = true,
  blockType,
  editorControlProps,
  editableText,
  save,
  disableInputType = [],
}: Readonly<ContentBlockEditorProps>) {
  const [richText, setRichText] = useState<SlateJSON>(() => editableText);

  const { moveContentUp, moveContentDown, deleteContent } =
    useEditContentBlockControls(blockId, card);

  const inputLength = serializeRichText(richText).length;

  const debouncedSave = useDebouncedCallback(save);

  const [editor] = useState(() =>
    withLists(schema)(withInlines(withReact(createEditor()))),
  );
  const renderLeaf = useCallback((props: RenderLeafProps) => {
    return <Leaf {...props} />;
  }, []);

  const renderElement = useCallback((props: RenderElementProps) => {
    switch (props.element.type) {
      case ElementType.TITLE:
        return <Element {...props} renderAs={'h1'} bold />;
      case ElementType.SUBTITLE:
        return <Element {...props} renderAs={'h3'} bold />;
      case ElementType.LINK:
        return <Link {...props} />;
      case ElementType.ORDERED_LIST:
        return <Element {...props} renderAs={'ol'} />;
      case ElementType.UNORDERED_LIST:
        return <Element {...props} renderAs={'ul'} />;
      case ElementType.LIST_ITEM:
        return <Element {...props} renderAs={'li'} />;
      case ElementType.LIST_ITEM_TEXT:
        return <Element {...props} renderAs={'div'} />;
      case ElementType.PARAGRAPH:
      default:
        return <Element {...props} renderAs={'p'} />;
    }
  }, []);

  const handleEditorChange = (value: Descendant[]) => {
    const isAstChange = editor.operations.some(
      (op) => op.type !== 'set_selection',
    );
    if (isAstChange) {
      setRichText(value);
      debouncedSave(value, card, blockId, blockType);
    }
  };

  const limitCharacterInput = useCallback(
    (e: InputEvent) => {
      const isInsertingText = [
        'insertParagraph',
        'insertFromPaste',
        'insertText',
      ].includes(e.inputType);
      if (isInsertingText && editorControlProps?.characterCount) {
        if (inputLength >= editorControlProps?.characterCount) {
          e.preventDefault();
        }
      }
      if (disableInputType?.length && disableInputType.includes(e.inputType)) {
        e.preventDefault();
      }
    },
    [editorControlProps, inputLength, disableInputType],
  );

  const limitCharsOnPaste = useCallback(
    (e: React.ClipboardEvent) => {
      const pastedText = e?.clipboardData.getData('text/plain');
      const totalLength = inputLength + pastedText.length;
      if (editorControlProps?.characterCount) {
        if (totalLength >= editorControlProps?.characterCount) {
          e.preventDefault();
        }
      }
    },
    [editorControlProps, inputLength],
  );

  const [isEditorOpen, setIsEditorOpen] = useState(false);

  return (
    <Slate
      editor={editor}
      initialValue={richText}
      onChange={handleEditorChange}>
      <EditorControl
        {...editorControlProps}
        onMoveUp={moveContentUp}
        onMoveDown={moveContentDown}
        show={isEditorOpen && editorControlProps.enabled}
        setIsEditorOpen={setIsEditorOpen}
        textLength={inputLength}
        enableDelete={
          card.type !== 'title' &&
          card.type !== 'end' &&
          editorControlProps?.enableDelete
        }
        delete={deleteContent}>
        <div
          className={classNames({
            'content-block__editable': editable,
            'content-block': true,
          })}>
          <Editable
            onDOMBeforeInput={limitCharacterInput}
            onPasteCapture={limitCharsOnPaste}
            readOnly={!editable}
            renderLeaf={renderLeaf}
            renderElement={renderElement}
            onKeyDown={(event) => onKeyDown(editor, event)}
            onFocus={() => {
              setIsEditorOpen(true);
              const { prevSelection } = editor as EditorWithPrevSelection;
              if (prevSelection) {
                (editor as EditorWithPrevSelection).prevSelection = undefined;
                removeMark(editor, 'fakeSelection');
              }
            }}
            onBlur={(e) => {
              debouncedSave(richText, card, blockId, blockType, true);
              if (e.relatedTarget?.id === 'url') {
                const { selection: currentSelection } = editor;
                if (!!currentSelection && Range.isExpanded(currentSelection)) {
                  setMark(editor, 'fakeSelection', true);
                  (editor as EditorWithPrevSelection).prevSelection =
                    currentSelection;
                }
              } else {
                setIsEditorOpen(false);
              }
            }}
          />
        </div>
      </EditorControl>
    </Slate>
  );
}

const Element = (
  props: RenderElementProps & {
    renderAs: 'h1' | 'h3' | 'p' | 'div' | 'ul' | 'ol' | 'li';
    bold?: boolean;
  },
) => {
  const El = props.renderAs;
  return (
    <El
      {...props.attributes}
      style={{
        fontWeight: props.bold ? 'bold' : 'unset',
        textAlign: props.element.align ?? 'left',
      }}>
      {props.children}
    </El>
  );
};

const Leaf = (props: RenderLeafProps) => {
  const { leaf } = props;
  // underline takes precedence
  let textDecoration: 'underline' | 'line-through' | 'unset';
  if (leaf.underline) {
    textDecoration = 'underline';
  } else if (leaf.strikethrough) {
    textDecoration = 'line-through';
  } else {
    textDecoration = 'unset';
  }

  let fontSize = 'unset';
  let fontWeight = 'unset';
  let lineHeight = 'unset';

  if (leaf.size === 'large') {
    fontSize = '24px';
    fontWeight = '600';
    lineHeight = '32px';
  } else if (leaf.size === 'medium') {
    fontSize = '16px';
    lineHeight = '24px';
  } else if (leaf.size === 'small') {
    fontSize = '12px';
    lineHeight = '20px';
  }

  return (
    <span
      {...props.attributes}
      style={{
        fontWeight: leaf.bold ? 'bold' : fontWeight,
        fontStyle: leaf.italic ? 'italic' : 'unset',
        fontSize: fontSize,
        lineHeight: lineHeight,
        textDecoration,
        color: leaf.color ?? 'inherit',
        backgroundColor: leaf.fakeSelection
          ? '#b3d7ff'
          : leaf.backgroundColor ?? 'unset',
      }}>
      {props.children}
    </span>
  );
};

const Link = (props: RenderElementProps) => (
  <a
    {...props.attributes}
    href={props.element.url}
    target='_blank'
    rel='noopener noreferrer'
    className='content-block__link'>
    {props.children}
  </a>
);

const withInlines = (editor: ReactEditor) => {
  const { isInline } = editor;
  // Override isInline to allow links to be inline
  editor.isInline = (element) => {
    return element.type === ElementType.LINK ? true : isInline(element);
  };
  return editor;
};
