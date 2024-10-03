import { render, screen, fireEvent } from '@testing-library/react';
import { CardOptions } from './CardOptions';
import {
  Card,
  ExpandableListBlockType,
  TitleBlockType,
} from '@learn-to-win/common/features/Cards/cardTypes';
import { useAppSelector } from '@hooks/reduxHooks';
import { getSlateNode } from '@learn-to-win/common/utils/cardJsonUtils';
import { CardType } from '@learn-to-win/common/constants';
const cards: Array<Card> = [
  {
    id: '1',
    type: CardType.LESSON_CARD,
    sequenceOrder: 0,
    title: 'title card',
    learningItem: '1',
    learningItemId: '1',
    confidenceCheck: true,
    json: {
      templateType: 'blank',
      version: '1.0',
      description: 'test description',
      contentBlocks: [
        {
          id: '1',
          type: 'title',
          text: 'Card 1 Title',
        } as TitleBlockType,
      ],
    },
  },
];
const mcCards: Array<Card> = [
  {
    id: '1',
    type: CardType.LESSON_CARD,
    sequenceOrder: 0,
    title: 'title card',
    learningItem: '1',
    learningItemId: '1',
    confidenceCheck: true,
    json: {
      templateType: 'multipleChoice',
      version: '1.0',
      description: 'test description',
      contentBlocks: [
        {
          id: '1',
          type: 'multipleChoice',
          multipleChoiceType: 'selectone',
          correctFeedback: {
            header: getSlateNode('paragraph', ''),
            body: getSlateNode('paragraph', ''),
          },
          incorrectFeedback: {
            header: getSlateNode('paragraph', ''),
            body: getSlateNode('paragraph', ''),
          },
          randomize: true,
          question: [
            {
              type: 'paragraph',
              children: [
                {
                  text: 'Question 1',
                },
              ],
            },
          ],
          options: [
            {
              id: '1',
              isCorrect: false,
              optionText: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      text: 'Answer 1',
                    },
                  ],
                },
                {
                  type: 'paragraph',
                  children: [
                    {
                      text: 'Answer 2',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  },
];

const disabledList = JSON.parse(JSON.stringify(cards));
const list: ExpandableListBlockType = {
  id: '1',
  type: 'expandableList',
  sections: [
    {
      id: '1',
      title: [
        {
          type: 'list-item',
          children: [
            {
              text: 'Section Header 1',
            },
          ],
        },
      ],
      content: [
        {
          type: 'paragraph',
          children: [
            {
              text: 'Hello There!',
            },
          ],
        },
      ],
    },
  ],
};
disabledList[0].json.contentBlocks.push(list);

jest.mock('@hooks/reduxHooks');
describe('card options tests', () => {
  const props = {
    displayDeletionConfirmationScreen: (flag: boolean) => flag,
    createCardCopy: () => null,
  };

  (useAppSelector as jest.Mock)
    .mockReturnValueOnce({ cards, selectedCardId: '1' })
    .mockReturnValueOnce({ cards, selectedCardId: '1' })
    .mockReturnValueOnce({ cards: mcCards, selectedCardId: '1' })
    .mockReturnValueOnce({ cards: mcCards, selectedCardId: '1' })
    .mockReturnValueOnce({ cards: disabledList, selectedCardId: '1' })
    .mockReturnValueOnce({ cards: disabledList, selectedCardId: '1' });
  test('should show all card options as default', async () => {
    render(<CardOptions {...props} />);
    const addBtn = await screen.findByTestId('addContentBlockButton');
    fireEvent.click(addBtn);
    const titleMenuItem = screen.queryByRole('menuitem', {
      name: 'Title',
    });
    const subtitleMenuItem = screen.queryByRole('menuitem', {
      name: 'Subtitle',
    });
    const bodyMenuItem = screen.queryByRole('menuitem', {
      name: 'Body',
    });
    const imageMenuItem = screen.queryByRole('menuitem', {
      name: 'Image',
    });
    const videoMenuItem = screen.queryByRole('menuitem', {
      name: 'Video',
    });
    const audioMenuItem = screen.queryByRole('menuitem', {
      name: 'Audio',
    });
    const expandableListMenuItem = screen.queryByRole('menuitem', {
      name: 'Expandable List',
    });
    expect(titleMenuItem).toBeInTheDocument();
    expect(subtitleMenuItem).toBeInTheDocument();
    expect(bodyMenuItem).toBeInTheDocument();
    expect(imageMenuItem).toBeInTheDocument();
    expect(videoMenuItem).toBeInTheDocument();
    expect(audioMenuItem).toBeInTheDocument();
    expect(expandableListMenuItem).toBeInTheDocument();
  });

  test('should display only media blocks on a multiple choice template', async () => {
    render(<CardOptions {...props} />);
    const addBtn = await screen.findByTestId('addContentBlockButton');
    fireEvent.click(addBtn);
    const imageMenuItem = screen.queryByRole('menuitem', {
      name: 'Image',
    });
    const videoMenuItem = screen.queryByRole('menuitem', {
      name: 'Video',
    });
    const audioMenuItem = screen.queryByRole('menuitem', {
      name: 'Audio',
    });
    const expandableListMenuItem = screen.queryByRole('menuitem', {
      name: 'Expandable List',
    });
    const titleMenuItem = screen.queryByRole('menuitem', {
      name: 'Title',
    });
    const subtitleMenuItem = screen.queryByRole('menuitem', {
      name: 'Subtitle',
    });
    const bodyMenuItem = screen.queryByRole('menuitem', {
      name: 'Body',
    });
    expect(imageMenuItem).toBeInTheDocument();
    expect(videoMenuItem).toBeInTheDocument();
    expect(audioMenuItem).toBeInTheDocument();
    expect(expandableListMenuItem).toBeNull();
    expect(bodyMenuItem).toBeNull();
    expect(titleMenuItem).toBeNull();
    expect(subtitleMenuItem).toBeNull();
  });

  test('no expan. list option if an expan. list exists', async () => {
    render(<CardOptions {...props} />);
    const addBtn = await screen.findByTestId('addContentBlockButton');
    fireEvent.click(addBtn);
    const imageMenuItem = screen.queryByRole('menuitem', {
      name: 'Image',
    });
    const videoMenuItem = screen.queryByRole('menuitem', {
      name: 'Video',
    });
    const audioMenuItem = screen.queryByRole('menuitem', {
      name: 'Audio',
    });
    const expandableListMenuItem = screen.queryByRole('menuitem', {
      name: 'Expandable List',
    });
    const titleMenuItem = screen.queryByRole('menuitem', {
      name: 'Title',
    });
    const subtitleMenuItem = screen.queryByRole('menuitem', {
      name: 'Subtitle',
    });
    const bodyMenuItem = screen.queryByRole('menuitem', {
      name: 'Body',
    });
    expect(titleMenuItem).toBeInTheDocument();
    expect(subtitleMenuItem).toBeInTheDocument();
    expect(bodyMenuItem).toBeInTheDocument();
    expect(imageMenuItem).toBeInTheDocument();
    expect(videoMenuItem).toBeInTheDocument();
    expect(audioMenuItem).toBeInTheDocument();
    expect(expandableListMenuItem).toBeNull();
  });
});
