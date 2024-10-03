import { Descendant } from 'slate';
import {
  addContentBlockToCard,
  deleteContentBlockFromCard,
  getContentBlocksFromCard,
  updateContentBlockInCard,
} from './CardHelper';
import { Card } from '@learn-to-win/common/features/Cards/cardTypes';
import { CardType } from '@learn-to-win/common/constants';

const card: Card = {
  id: '123',
  title: 'Test Title',
  type: CardType.LESSON_CARD,
  learningItem: '123',
  sequenceOrder: 1,
  learningItemId: '123',
  confidenceCheck: true,
  json: {
    version: '1',
    description: 'Test Description',
    templateType: null,
    contentBlocks: [
      {
        id: '1',
        type: 'title',
        text: 'Test Title',
      },
      {
        id: '2',
        type: 'subtitle',
        text: 'Test Subtitle',
      },
      {
        id: '3',
        type: 'body',
        text: 'Test Body',
      },
    ],
  },
};

describe('getContentBlocksFromCard', () => {
  it('should return the correct content blocks', () => {
    const jsx = getContentBlocksFromCard(card, false);
    expect(jsx).toMatchSnapshot();
  });
});

describe('addContentBlockToCard', () => {
  const newCard = addContentBlockToCard(card, {
    id: '4',
    type: 'body',
    text: 'Test Body',
  });

  expect(newCard.json.contentBlocks.length).toBe(4);
});

describe('deleteContentBlockFromCard', () => {
  it('should have the correct number of content blocks', () => {
    const newCard = deleteContentBlockFromCard(card, '3');

    expect(newCard.json.contentBlocks.length).toBe(2);
  });
});

describe('updateContentBlock', () => {
  const newCard = updateContentBlockInCard(card, {
    id: '1',
    type: 'title',
    text: 'Updated Test Title',
    json: [{ children: [{ text: 'Updated Test Title' }] } as Descendant],
  });

  if ('text' in newCard.json.contentBlocks[0]) {
    expect(newCard.json.contentBlocks[0].text).toBe('Updated Test Title');
  }
});
