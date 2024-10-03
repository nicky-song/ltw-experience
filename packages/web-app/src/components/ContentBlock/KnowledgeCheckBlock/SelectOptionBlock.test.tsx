import { fireEvent, render, screen } from '@testing-library/react';
import {
  Card,
  CardJson,
  MultipleChoiceBlockType,
  TrueFalseBlockType,
} from '@learn-to-win/common/features/Cards/cardTypes';
import SelectOptionBlock from './SelectOptionBlock';
import { getSlateNode } from '@learn-to-win/common/utils/cardJsonUtils';
import { QueryClient, QueryClientProvider } from 'react-query';
const queryClient = new QueryClient();
import { CardType } from '@learn-to-win/common/constants';

const correctFeedback = {
  header: getSlateNode('paragraph', 'headercorrect'),
  body: getSlateNode('paragraph', 'bodycorrect'),
};
const incorrectFeedback = {
  header: getSlateNode('paragraph', 'headerincorrect'),
  body: getSlateNode('paragraph', 'bodyincorrect'),
};

const multipleChoiceBlock = {
  id: '1',
  type: 'multipleChoice',
  multipleChoiceType: 'selectone',
  correctFeedback,
  incorrectFeedback,
  question: getSlateNode('paragraph', 'Question 1'),
  options: [
    {
      id: '1',
      isCorrect: false,
      optionText: getSlateNode('paragraph', 'Answer 1'),
    },
    {
      id: '2',
      isCorrect: true,
      optionText: getSlateNode('paragraph', 'Answer 2'),
    },
  ],
} as MultipleChoiceBlockType;

const multipleChoiceBlockSelectAll = {
  id: '1',
  type: 'multipleChoice',
  multipleChoiceType: 'selectall',
  correctFeedback,
  incorrectFeedback,
  question: getSlateNode('paragraph', 'Question 1'),
  options: [
    {
      id: '1',
      isCorrect: false,
      optionText: getSlateNode('paragraph', 'Answer 1'),
    },
    {
      id: '2',
      isCorrect: true,
      optionText: getSlateNode('paragraph', 'Answer 2'),
    },
  ],
} as MultipleChoiceBlockType;

const card = {
  id: '1',
  title: 'Multiple Choice',
  type: CardType.LESSON_CARD,
  sequenceOrder: 1,
  learningItemId: '1',
  json: {
    templateType: 'multipleChoice',
    version: '1.0',
    description: 'test description',
    contentBlocks: [multipleChoiceBlock],
  } as CardJson,
  learningItem: '1',
  confidenceCheck: false,
} as Card;

jest.mock('@hooks/reduxHooks', () => ({
  useAppSelector: () => ({
    selectedCardId: '1',
    learningItemList: [
      {
        id: '1',
        name: 'testTitle',
        type: 'lesson',
        description: 'testDesc',
        cards: [1],
      },
    ],
    cards: [card],
    cardEnrollments: [
      {
        cardId: '1',
        answer: [],
        completedAt: null,
      },
    ],
  }),
  useAppDispatch: () => () => null,
}));
jest.mock('react-router', () => ({
  useNavigate: () => null,
  useParams: () => ({ learningItemId: 1 }),
}));

const trueFalseBlock = {
  ...multipleChoiceBlock,
  options: [
    {
      id: '1',
      isCorrect: false,
      optionText: getSlateNode('paragraph', 'Question 1'),
    },
    {
      id: '2',
      isCorrect: false,
      optionText: getSlateNode('paragraph', 'Answer 1'),
    },
  ],
  type: 'trueFalse',
} as TrueFalseBlockType;

const multipleChoicePropsAdmin = {
  key: 1,
  id: '1',
  card: card,
  showEditor: true,
  onAdminPage: true,
  editing: true,
  block: multipleChoiceBlock,
};

const multipleChoicePropsLearner = {
  key: 1,
  id: '1',
  card: card,
  showEditor: false,
  editing: false,
  block: multipleChoiceBlock,
};

const multipleChoicePropsLearnerSelectAll = {
  key: 1,
  id: '1',
  card: card,
  showEditor: false,
  editing: false,
  block: multipleChoiceBlockSelectAll,
};

const trueFalseProps = {
  ...multipleChoicePropsAdmin,
  block: trueFalseBlock,
};

describe('multiple choice block tests', () => {
  it('should render a a question and a list of answers for admin', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <SelectOptionBlock {...multipleChoicePropsAdmin} />
      </QueryClientProvider>,
    );
    expect(screen.getByText('Answer 1')).toBeInTheDocument();
    expect(screen.getByText('Answer 2')).toBeInTheDocument();
    expect(screen.getByText('Question 1')).toBeInTheDocument();
  });

  it('should not render mc controls with a true false block', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <SelectOptionBlock {...trueFalseProps} />
      </QueryClientProvider>,
    );
    expect(screen.queryByTestId('mc-answer-controls')).toBeNull();
    expect(screen.queryByTestId('mc-add-randomize-controls')).toBeNull();
    expect(screen.getByText(/Select one:/)).toBeInTheDocument();
  });

  it('should render a question and a radio list of answers for learner', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <SelectOptionBlock {...multipleChoicePropsLearner} />
      </QueryClientProvider>,
    );
    expect(screen.getByText('Answer 1')).toBeInTheDocument();
    expect(screen.getByText('Answer 2')).toBeInTheDocument();
    expect(screen.getByText('Question 1')).toBeInTheDocument();
  });
  it('should select incorrect option for selectone learner', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <SelectOptionBlock {...multipleChoicePropsLearner} />
      </QueryClientProvider>,
    );

    //fireEvent.click(screen.getAllByTestId('input-option')[0]);
    expect(screen.getByText('headerincorrect')).toBeInTheDocument();
    expect(screen.getByText('bodyincorrect')).toBeInTheDocument();
  });
  it('should select correct option for selectone learner', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <SelectOptionBlock {...multipleChoicePropsLearner} />
      </QueryClientProvider>,
    );

    fireEvent.click(screen.getAllByTestId('input-option')[1]);
    expect(screen.getByText('headercorrect')).toBeInTheDocument();
    expect(screen.getByText('bodycorrect')).toBeInTheDocument();
  });

  it('should render a question and a checkbox list of answers for learner', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <SelectOptionBlock {...multipleChoicePropsLearnerSelectAll} />
      </QueryClientProvider>,
    );
    expect(screen.getByText('Answer 1')).toBeInTheDocument();
    expect(screen.getByText('Answer 2')).toBeInTheDocument();
    expect(screen.getByText('Question 1')).toBeInTheDocument();
  });
  it('should select incorrect option for selectall learner', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <SelectOptionBlock {...multipleChoicePropsLearnerSelectAll} />
      </QueryClientProvider>,
    );
    fireEvent.click(screen.getAllByTestId('input-option')[0]);
    expect(screen.getByTestId('knowledge-check-button')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('knowledge-check-button'));
    expect(screen.getByText('headerincorrect')).toBeInTheDocument();
    expect(screen.getByText('bodyincorrect')).toBeInTheDocument();
  });
  it('should select correct option for selectall learner', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <SelectOptionBlock {...multipleChoicePropsLearnerSelectAll} />
      </QueryClientProvider>,
    );
    fireEvent.click(screen.getAllByTestId('input-option')[1]);
    expect(screen.getByTestId('knowledge-check-button')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('knowledge-check-button'));
    expect(screen.getByText('headercorrect')).toBeInTheDocument();
    expect(screen.getByText('bodycorrect')).toBeInTheDocument();
  });
});
