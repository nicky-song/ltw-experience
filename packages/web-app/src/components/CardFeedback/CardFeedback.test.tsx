import { render, screen } from '@tests/testing';
import CardFeedback from '.';
import {
  Card,
  MultipleChoiceBlockType,
} from '@learn-to-win/common/features/Cards/cardTypes';
import { getSlateNode } from '@learn-to-win/common/utils/cardJsonUtils';
import { FeedBackType } from '@learn-to-win/common/constants/cardFeedbackType';
import { CardType } from '@learn-to-win/common/constants';

const contentBlock = {
  id: '1',
  type: 'multipleChoice',
  multipleChoiceType: 'selectone',
  correctFeedback: {
    header: getSlateNode('paragraph', 'headercorrect'),
    body: getSlateNode('paragraph', 'bodycorrect'),
  },
  incorrectFeedback: {
    header: getSlateNode('paragraph', 'headerincorrect'),
    body: getSlateNode('paragraph', 'bodyincorrect'),
  },
  question: getSlateNode('paragraph', 'Question 1'),
  options: [
    {
      id: '1',
      isCorrect: false,
      optionText: getSlateNode('paragraph', 'Answer 1'),
    },
    {
      id: '2',
      isCorrect: false,
      optionText: getSlateNode('paragraph', 'Answer 2'),
    },
  ],
} as MultipleChoiceBlockType;
const card: Card = {
  id: '1',
  title: 'Multiple choice List Card',
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
jest.mock('@hooks/reduxHooks', () => ({
  useAppSelector: () => ({ selectedCardId: '1', cards: [card] }),
  useAppDispatch: () => null,
}));
describe('Card feedback tests', () => {
  it('should render the text and header editor components', () => {
    const props = {
      blockId: '1',
      feedBack: null,
      editable: true,
    };
    render(<CardFeedback {...props} />);
    expect(screen.getByText(/headercorrect/)).toBeInTheDocument();
    expect(screen.getByText(/headerincorrect/)).toBeInTheDocument();
    expect(screen.getByText(/bodycorrect/)).toBeInTheDocument();
    expect(screen.getByText(/bodyincorrect/)).toBeInTheDocument();
    expect(
      screen.getByText(/Select how confident you are with this answer/),
    ).toBeInTheDocument();
  });

  it('should render confetti when feedback is correct', () => {
    const props = {
      blockId: '1',
      feedBack: 'correct' as FeedBackType,
      editable: true,
    };
    render(<CardFeedback {...props} />);
    expect(screen.getByTestId('feedback-celebration')).toBeInTheDocument();
  });

  it('should show Confidence check card when confidence check is enabled', () => {
    render(<CardFeedback blockId='1' feedBack='confidence' editable={true} />);
    expect(
      screen.getByText(/Select how confident you are with this answer/),
    ).toBeVisible();
    expect(screen.getByTestId('confidence-card-container')).toHaveClass(
      'feedback--confidence',
    );
  });
  it('should not show Confidence check card when confidence check is disabled', () => {
    render(
      <CardFeedback
        blockId='1'
        feedBack='confidence'
        editable={true}
        confidenceCheck={false}
      />,
    );
    expect(screen.getByTestId('confidence-card-container')).toHaveClass(
      'feedback--disable-confidence',
    );
  });
});
