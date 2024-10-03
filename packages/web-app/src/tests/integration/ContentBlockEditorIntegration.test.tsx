import { fireEvent, render, screen, waitFor } from '@tests/testing';
import FocusModeEditor from '@pages/FocusModeEditor';
import { MemoryRouter } from 'react-router-dom';
import {
  Card,
  ExpandableListBlockType,
  ListSection,
  MultipleChoiceBlockType,
} from '@learn-to-win/common/features/Cards/cardTypes';
import { getCardsAPI } from '@learn-to-win/common/features/Cards/cardService';
import { defineScrollIntoView } from '@/utils/testUtils';
import { getSlateNode } from '@learn-to-win/common/utils/cardJsonUtils';
import { CardType } from '@learn-to-win/common/constants';

const firstSection: ListSection = {
  id: '0',
  title: getSlateNode('list-item', 'Section Header 1'),
  content: getSlateNode('paragraph', 'Hello There!'),
};
const commonCardValues = {
  id: '1',
  title: 'Expandable List Card',
  type: CardType.LESSON_CARD,
  learningItemId: '1',
  learningItem: '',
  sequenceOrder: 1,
  confidenceCheck: true,
  json: {
    description: '',
    templateType: null,
    version: '',
    contentBlocks: [],
  },
};
const expandableListContentBlock: ExpandableListBlockType = {
  id: '1',
  type: 'expandableList',
  sections: [firstSection],
};
const exListRenderCardMock: Card = {
  ...commonCardValues,
  title: 'Expandable List Card',
  json: {
    ...commonCardValues.json,
    contentBlocks: [expandableListContentBlock],
  },
};

const mcListContentBlock: MultipleChoiceBlockType = {
  id: '1',
  type: 'multipleChoice',
  multipleChoiceType: 'selectone',
  randomize: false,
  correctFeedback: {
    header: getSlateNode('paragraph', ''),
    body: getSlateNode('paragraph', ''),
  },
  incorrectFeedback: {
    header: getSlateNode('paragraph', ''),
    body: getSlateNode('paragraph', ''),
  },
  question: getSlateNode('paragraph', 'Question 1'),
  options: [
    {
      id: '1',
      isCorrect: true,
      optionText: getSlateNode('paragraph', 'Answer 1'),
    },
    {
      id: '2',
      isCorrect: false,
      optionText: getSlateNode('paragraph', 'Answer 2'),
    },
  ],
};

const mcListSelectOneRenderMock: Card = {
  ...commonCardValues,
  title: 'Multiple Choice Card',
  json: {
    ...commonCardValues.json,
    contentBlocks: [mcListContentBlock],
  },
};

const selectAllBlock = JSON.parse(JSON.stringify(mcListContentBlock));
selectAllBlock.multipleChoiceType = 'selectAll';
const mcListSelectAllRenderMock: Card = {
  ...commonCardValues,
  title: 'Multiple Choice Card',
  json: {
    ...commonCardValues.json,
    contentBlocks: [selectAllBlock],
  },
};

const editingSectionCardMock = {
  ...exListRenderCardMock,
  json: {
    ...exListRenderCardMock.json,
    contentBlocks: [
      {
        id: '1',
        type: 'expandableList',
        sections: [
          firstSection,
          {
            ...firstSection,
            id: '1',
            title: [
              {
                type: 'list-item',
                children: [
                  {
                    text: 'Section Header 2',
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
};

jest.mock('@learn-to-win/common/features/Cards/cardService');

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ blockId: '1', cardId: '1' }),
}));
describe('Content block editor page', () => {
  const setup = () => {
    (getCardsAPI as jest.Mock)
      .mockReturnValueOnce([exListRenderCardMock])
      .mockReturnValueOnce([editingSectionCardMock])
      .mockReturnValueOnce([mcListSelectOneRenderMock])
      .mockReturnValueOnce([mcListSelectAllRenderMock])
      .mockReturnValueOnce([
        JSON.parse(JSON.stringify(mcListSelectOneRenderMock)),
      ]);

    defineScrollIntoView();
    render(
      <MemoryRouter>
        <FocusModeEditor />
      </MemoryRouter>,
    );
  };
  it('Should render the page with the block component', async () => {
    setup();
    expect(screen.getByText(/Section Header 1/)).toBeInTheDocument();
    expect(screen.getByText(/Edit Expandable List/)).toBeInTheDocument();
  });

  describe('expandable list section editing', () => {
    test('should be able to edit sections', async () => {
      setup();
      const delBtn = await screen.findByTestId('expandable-del-1');
      fireEvent.click(delBtn);
      await waitFor(() => {
        expect(screen.queryByTestId('expandable-del-1')).toBeNull();
      });

      const addBtn = await screen.findByText(/Add Section/);
      fireEvent.click(addBtn);
      expect(screen.queryByTestId('expandable-del-1')).toBeInTheDocument();

      const copyBtn = await screen.findByTestId('expandable-clone-1');
      fireEvent.click(copyBtn);
      expect(screen.queryByTestId('expandable-clone-2')).toBeInTheDocument();
    });
  });

  describe('multiple choice editing', () => {
    test('should be able to select mc options in select one mode', () => {
      setup();
      const options = screen.queryAllByTestId('input-option');
      const firstOption = options[0];
      const secondOption = options[1];
      expect(options.length).toBe(2);
      expect(firstOption).toHaveAttribute('type', 'radio');
      expect(firstOption).toBeChecked();
      expect(secondOption).not.toBeChecked();
      fireEvent.click(secondOption);
      const changedOptions = screen.queryAllByTestId('input-option');
      const changedFirstOption = changedOptions[0];
      const changedSecondOption = changedOptions[1];
      expect(changedSecondOption).toBeChecked();
      expect(changedFirstOption).not.toBeChecked();
    });

    test('should be able to select mc options in select all mode and switch to select one', () => {
      setup();
      const options = screen.queryAllByTestId('input-option');
      const firstOption = options[0];
      const secondOption = options[1];
      expect(options.length).toBe(2);
      expect(firstOption).toHaveAttribute('type', 'checkbox');
      expect(firstOption).toBeChecked();
      expect(secondOption).not.toBeChecked();
      fireEvent.click(secondOption);
      const changedOptions = screen.queryAllByTestId('input-option');
      const changedFirstOption = changedOptions[0];
      const changedSecondOption = changedOptions[1];
      expect(changedSecondOption).toBeChecked();
      expect(changedFirstOption).toBeChecked();

      const dropDown = screen.getByRole('combobox');
      fireEvent.mouseDown(dropDown);
      const selectOne = screen.getByText('Select one:');

      fireEvent.click(selectOne);
      const radioOption = screen.queryAllByTestId('input-option')[0];
      expect(radioOption).toHaveAttribute('type', 'radio');
    });

    test('should be able to delete and add sections', async () => {
      setup();

      const addBtn = screen.getByTestId('mc-add-answer-btn');

      fireEvent.click(addBtn);
      fireEvent.click(addBtn);
      expect(screen.getByText(/Answer 3/)).toBeInTheDocument();
      expect(screen.getByText(/Answer 4/)).toBeInTheDocument();

      const deleteBtn = screen.getByTestId('mc-delete-answer-btn-1');
      fireEvent.click(deleteBtn);

      const options = screen.queryAllByTestId('input-option');
      expect(options[0]).toBeChecked();
      expect(options[1]).not.toBeChecked();
      expect(options[2]).not.toBeChecked();
      expect(screen.queryByText(/Answer 1/)).not.toBeInTheDocument();
    });
  });
});
