// Import React dependencies.
// Import the Slate editor factory.
import { BaseEditor } from 'slate';

// Import the Slate components and React plugin.
import { ReactEditor } from 'slate-react';

export type CustomTags =
  | 'title'
  | 'subtitle'
  | 'paragraph'
  | 'numbered-list'
  | 'bulleted-list'
  | 'list-item'
  | 'list-item-text'
  | 'link';
export type CustomElement = {
  type: CustomTags;
  children: CustomText[];
  align?: 'left' | 'center' | 'right' | 'justify';
  url?: string;
};

export type CustomSize = 'large' | 'medium' | 'small';

export type CustomText = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  size?: CustomSize;
  color?: string;
  backgroundColor?: string;
  fakeSelection?: boolean;
};

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

// TODOs
// * Keyboard shortcuts for bold, italic, underline, strikethrough
