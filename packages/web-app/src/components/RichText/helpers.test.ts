import {
  isMarkActive,
  serializeCard,
  serializeRichText,
  toggleMark,
  isSizeMarkActive,
  toggleSizeMark,
  setMark,
  getMark,
  removeMark,
} from './helpers';
import { createEditor, Editor } from 'slate';
import { withReact } from 'slate-react';
import {
  getBodyBlock,
  getTitleBlock,
} from '@learn-to-win/common/features/Cards/cardTemplates';
import { Card } from '@learn-to-win/common/features/Cards/cardTypes';
import { CardType } from '@learn-to-win/common/constants';

jest.mock('slate', () => ({
  ...jest.requireActual('slate'),
  Editor: {
    removeMark: jest.fn(),
    addMark: jest.fn(),
    marks: jest.fn(() => ({
      text: 'example',
      bold: true,
    })),
  },
}));

describe(`Test Marks (bold, italic, etc)`, () => {
  it(`should toggle the mark`, () => {
    const editor = withReact(createEditor());

    expect(isMarkActive(editor, 'bold')).toBe(true);
    toggleMark(editor, 'bold');
    expect(Editor.removeMark).toBeCalled();
  });

  it(`should toggle the size mark`, () => {
    const editor = withReact(createEditor());

    expect(isSizeMarkActive(editor, 'medium')).toBe(true);
    toggleSizeMark(editor, 'large');
    expect(Editor.removeMark).toBeCalled();
    expect(Editor.addMark).toBeCalledWith(editor, 'size', 'large');
  });

  it('should add a mark', () => {
    const editor = withReact(createEditor());
    setMark(editor, 'fakeSelection', true);
    expect(Editor.addMark).toBeCalledWith(editor, 'fakeSelection', true);
  });

  it('should get a mark', () => {
    const editor = withReact(createEditor());
    getMark(editor, 'color');
    expect(Editor.marks).toBeCalledWith(editor);
  });

  it('should remove a mark', () => {
    const editor = withReact(createEditor());
    removeMark(editor, 'color');
    expect(Editor.removeMark).toBeCalledWith(editor, 'color');
  });
});

describe('serialization works', () => {
  it('should serialize rich text', () => {
    const richText = [
      {
        type: 'paragraph' as const,
        children: [
          {
            text: 'hello',
          },
        ],
      },
    ];
    expect(serializeRichText(richText)).toEqual('hello');
  });

  it('should serialize a whole card', () => {
    const card: Card = {
      id: '1',
      learningItem: '1',
      learningItemId: '1',
      title: 'hello',
      sequenceOrder: 1,
      type: CardType.TITLE_CARD,
      confidenceCheck: true,
      json: {
        version: '1',
        description: 'hello',
        templateType: null,
        contentBlocks: [
          getTitleBlock('1', 'hello'),
          getBodyBlock('2', 'world'),
        ],
      },
    };
    expect(serializeCard(card)).toEqual('hello\nworld');
  });
});
