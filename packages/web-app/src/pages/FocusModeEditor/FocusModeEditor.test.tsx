import { fireEvent, render, screen } from '@tests/testing';
import ContentBlockEditor from '.';
import { MemoryRouter } from 'react-router-dom';
import {
  Card,
  ExpandableListBlockType,
  ListSection,
  MultipleChoiceBlockType,
} from '@learn-to-win/common/features/Cards/cardTypes';
import { getCardsAPI } from '@learn-to-win/common/features/Cards/cardService';
import { defineScrollIntoView } from '@/utils/testUtils';
import { CardType } from '@learn-to-win/common/constants';
import { getSlateNode } from '@learn-to-win/common/utils/cardJsonUtils';

const firstSection: ListSection = {
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
};
const contentBlock: ExpandableListBlockType = {
  id: '1',
  type: 'expandableList',
  sections: [firstSection],
};

const multipleChoiceBlock: MultipleChoiceBlockType = {
  id: '1',
  type: 'multipleChoice',
  multipleChoiceType: 'selectone',
  question: getSlateNode('paragraph', 'This is a MCQ'),
  correctFeedback: {
    header: getSlateNode('paragraph', 'Great Job'),
    body: getSlateNode('paragraph', 'You are awesome!'),
  },
  incorrectFeedback: {
    header: getSlateNode('paragraph', 'Keep Trying'),
    body: getSlateNode('paragraph', 'You can do it!'),
  },
  options: [
    {
      id: '1',
      optionText: getSlateNode('paragraph', 'Option 1'),
      isCorrect: true,
    },
    {
      id: '2',
      optionText: getSlateNode('paragraph', 'Option 2'),
      isCorrect: false,
    },
  ],
  randomize: false,
};

const testCard: Card = {
  id: '1',
  title: 'Expandable List Card',
  type: CardType.LESSON_CARD,
  learningItemId: '1',
  learningItem: '',
  sequenceOrder: 1,
  confidenceCheck: true,
  json: {
    description: '',
    version: '',
    templateType: null,
    contentBlocks: [contentBlock],
  },
};

jest.mock('@learn-to-win/common/features/Cards/cardService');

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ blockId: '1', cardId: '1', learningItemId: '1' }),
}));
describe('Content block editor page', () => {
  const setup = () => {
    (getCardsAPI as jest.Mock).mockReturnValueOnce([testCard]);
    defineScrollIntoView();
    render(
      <MemoryRouter>
        <ContentBlockEditor />
      </MemoryRouter>,
    );
  };
  it('Should render the page with the expandable list block', async () => {
    setup();
    expect(screen.getByText(/Section Header 1/)).toBeInTheDocument();
    expect(screen.getByText(/Edit Expandable List/)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Done' })).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Question' }),
    ).not.toBeInTheDocument();
  });

  it('should navigate back to the admin page', async () => {
    defineScrollIntoView();
    render(
      <MemoryRouter>
        <ContentBlockEditor></ContentBlockEditor>
      </MemoryRouter>,
    );
    const link = await screen.findByTestId('content-block-editor-done');
    expect(link).toHaveAttribute('href', '/learning_item/1/card/1');
  });
  it('should render multiple choice block type', async () => {
    const knowledgeCheckCard = {
      ...testCard,
      title: 'Knowledge Check Card',
      type: CardType.KNOWLEDGE_CARD,
      json: {
        description: '',
        version: '',
        templateType: 'multipleChoice',
        contentBlocks: [multipleChoiceBlock],
      },
    };
    (getCardsAPI as jest.Mock).mockReturnValueOnce([knowledgeCheckCard]);
    defineScrollIntoView();
    render(
      <MemoryRouter>
        <ContentBlockEditor />
      </MemoryRouter>,
    );
    expect(screen.getByText('Editing Multiple Choice')).toBeInTheDocument();
    expect(screen.getByText('This is a MCQ')).toBeInTheDocument();
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Done' })).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Question' }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Correct' }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Incorrect' }),
    ).toBeInTheDocument();
  });
  it('should render button for enabling/disabling confidence check for quiz card', () => {
    const quizCard = {
      ...testCard,
      title: 'Quiz Card',
      type: CardType.QUIZ_CARD,
      json: {
        description: '',
        version: '',
        templateType: 'multipleChoice',
        contentBlocks: [multipleChoiceBlock],
      },
    };
    (getCardsAPI as jest.Mock).mockReturnValueOnce([quizCard]);
    defineScrollIntoView();
    render(
      <MemoryRouter>
        <ContentBlockEditor />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('button', { name: /Confidence/ }),
    ).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'eye' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('img', { name: 'eye' }));
    expect(
      screen.getByRole('img', { name: 'eye-invisible' }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Confidence Check Hidden/)).toBeInTheDocument();
  });
});
