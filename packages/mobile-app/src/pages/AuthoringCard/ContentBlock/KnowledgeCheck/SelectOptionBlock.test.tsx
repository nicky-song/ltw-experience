import { SelectOptionBlock } from './SelectOptionBlock';
import { render, screen } from '../../../../test/testing';
import { getSlateNode } from '@learn-to-win/common/utils/cardJsonUtils';
import {
  Card,
  CardJson,
  MultipleChoiceBlockType,
  TrueFalseBlockType,
} from '@learn-to-win/common/features/Cards/cardTypes';
import { updateCardEnrollmentAnswer, updateCardEnrollmentConfidence } from '@learn-to-win/common/features/Enrollments/enrollmentService';
import { fireEvent, waitFor } from '@testing-library/react-native';
import { useAppSelector } from '../../../../hooks/reduxHooks';
import { AuthoringCardPropsProvider } from '@learn-to-win/common/hooks/AuthoringCardProps';
import { CardType } from '@learn-to-win/common/constants';

const card = {
  id: '1',
  title: 'Multiple Choice',
  type: 'lesson',
  sequenceOrder: 1,
  learningItemId: '1',
  json: {} as CardJson,
  learningItem: '1',
} as Card;

const quizCard = { ...card, type: CardType.QUIZ_CARD };

const confidenceCard = { ...card, confidenceCheck: true };

jest.mock(
  '@learn-to-win/common/features/Enrollments/enrollmentService',
  () => ({
    updateCardEnrollmentAnswer: jest.fn(),
    updateCardEnrollmentConfidence: jest.fn()
  }),
);

jest.mock('../../../../hooks/reduxHooks', () => ({
  useAppSelector: jest.fn(() => ({
    learningItemList: [
      {
        id: '1',
        name: 'testTitle',
        type: 'lesson',
        description: 'testDesc',
        cards: [1],
      },
    ],
    cards: card,
    cardEnrollments: [
      {
        cardId: '1',
        answer: [],
      },
    ],
  })),
  useAppDispatch: () => () => null,
}));

const multipleChoiceBlock = {
  id: '1',
  type: 'multipleChoice',
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
    {
      id: '3',
      isCorrect: false,
      optionText: getSlateNode('paragraph', 'Answer 3'),
    },
  ],
  correctFeedback: {
    header: getSlateNode('paragraph', 'headercorrect'),
    body: getSlateNode('paragraph', 'bodycorrect'),
  },
  incorrectFeedback: {
    header: getSlateNode('paragraph', 'headerincorrect'),
    body: getSlateNode('paragraph', 'bodyincorrect'),
  },
};

describe('MultipleChoiceBlock', () => {
  it('Select one: should render multiple choice select one question and answers', async () => {
    render(
      <SelectOptionBlock
        card={card}
        contentBlock={
          {
            multipleChoiceType: 'selectone',
            ...multipleChoiceBlock,
          } as MultipleChoiceBlockType
        }
      />,
    );
    expect(screen.getByText('Question 1')).toBeTruthy();

    // Press wrong input
    fireEvent.press(screen.getByText('Answer 1'));
    expect(screen.getByText('headerincorrect')).toBeTruthy();

    // Press correct input
    fireEvent.press(screen.getByText('Answer 2'));
    expect(screen.getByText('headercorrect')).toBeTruthy();

    fireEvent.press(screen.getByText('Continue'));

    await waitFor(() => {
      expect(updateCardEnrollmentAnswer).toHaveBeenCalled();
    });
  });

  it('Select One Quiz: should not allow answers to be changed for quiz', async () => {
    render(
      <SelectOptionBlock
        card={quizCard}
        contentBlock={
          {
            multipleChoiceType: 'selectone',
            ...multipleChoiceBlock,
          } as MultipleChoiceBlockType
        }
      />,
    );

    expect(screen.getByText('Question 1')).toBeTruthy();

    // Press wrong input
    fireEvent.press(screen.getByText('Answer 1'));
    fireEvent.press(screen.getByText('Check'));
    expect(screen.getByText('headerincorrect')).toBeTruthy();

    // Answer cannot be changed
    fireEvent.press(screen.getByText('Answer 2'));
    expect(screen.getByText('headerincorrect')).toBeTruthy();

    // User should still be able to continue
    fireEvent.press(screen.getByText('Continue'));
    await waitFor(() => {
      expect(updateCardEnrollmentAnswer).toHaveBeenCalled();
    });
  });

  it('Multiple Choice: should render multiple choice select all question and answers', async () => {
    render(
      <SelectOptionBlock
        card={card}
        contentBlock={
          {
            multipleChoiceType: 'selectall',
            ...multipleChoiceBlock,
          } as MultipleChoiceBlockType
        }
      />,
    );
    expect(screen.getByText('Question 1')).toBeTruthy();

    // Press wrong input
    fireEvent.press(screen.getByText('Answer 1'));
    fireEvent.press(screen.getByText('Answer 2'));
    fireEvent.press(screen.getByText('Check'));
    expect(screen.getByText('headerincorrect')).toBeTruthy();

    // Unselect wrong input
    fireEvent.press(screen.getByText('Answer 1'));
    fireEvent.press(screen.getByText('Check'));

    expect(screen.getByText('headercorrect')).toBeTruthy();

    fireEvent.press(screen.getByText('Continue'));

    await waitFor(() => {
      expect(updateCardEnrollmentAnswer).toHaveBeenCalled();
    });
  });

  it('Multiple Choice Quiz: should show grade/check button but not allow user to change answer after that', async () => {
    render(
      <SelectOptionBlock
        card={quizCard}
        contentBlock={
          {
            ...multipleChoiceBlock,
            multipleChoiceType: 'selectall',
          } as MultipleChoiceBlockType
        }
      />,
    );
    expect(screen.getByText('Question 1')).toBeTruthy();

    // Press wrong input
    fireEvent.press(screen.getByText('Answer 1'));
    fireEvent.press(screen.getByText('Answer 3'));
    fireEvent.press(screen.getByText('Check'));
    expect(screen.getByText('headerincorrect')).toBeTruthy();

    // try to correct answer
    fireEvent.press(screen.getByText('Answer 1'));
    fireEvent.press(screen.getByText('Answer 2'));
    fireEvent.press(screen.getByText('Answer 3'));

    expect(screen.getByText('headerincorrect')).toBeTruthy();

    // Should be able to continue with wrong answer
    fireEvent.press(screen.getByText('Continue'));

    await waitFor(() => {
      expect(updateCardEnrollmentAnswer).toHaveBeenCalled();
    });
  });

  it('Multiple Choice Quiz: should work for the correct answer quiz flow', async () => {
    render(
      <SelectOptionBlock
        card={quizCard}
        contentBlock={
          {
            ...multipleChoiceBlock,
            multipleChoiceType: 'selectall',
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
              {
                id: '3',
                isCorrect: true,
                optionText: getSlateNode('paragraph', 'Answer 3'),
              },
            ],
          } as MultipleChoiceBlockType
        }
      />,
    );
    expect(screen.getByText('Question 1')).toBeTruthy();

    // Press wrong input
    fireEvent.press(screen.getByText('Answer 2'));
    fireEvent.press(screen.getByText('Answer 3'));
    fireEvent.press(screen.getByText('Check'));
    expect(screen.getByText('headercorrect')).toBeTruthy();

    // try to change answer
    fireEvent.press(screen.getByText('Answer 2'));

    expect(screen.getByText('headercorrect')).toBeTruthy();

    // Should be able to continue with wrong answer
    fireEvent.press(screen.getByText('Continue'));

    await waitFor(() => {
      expect(updateCardEnrollmentAnswer).toHaveBeenCalled();
    });
  });

  it('Multiple Choice Quiz: should work for the correct answer quiz flow with the confidence check', async () => {
    render(
      <SelectOptionBlock
        card={confidenceCard}
        contentBlock={
          {
            ...multipleChoiceBlock,
            multipleChoiceType: 'selectall',
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
              {
                id: '3',
                isCorrect: true,
                optionText: getSlateNode('paragraph', 'Answer 3'),
              },
            ],
          } as MultipleChoiceBlockType
        }
      />,
    );
    expect(screen.getByText('Question 1')).toBeTruthy();

    // Press correct input
    fireEvent.press(screen.getByText('Answer 2'));
    fireEvent.press(screen.getByText('Answer 3'));
    // Open Confidence Card  
    expect(
      screen.getByText(/Select how confident you are with this answer/),
    ).toBeTruthy();
    fireEvent.press(screen.getByTestId('confidence-level-100'));
    const checkButton = screen.getByText('Check');
    expect(checkButton).toBeEnabled();

    fireEvent.press(checkButton);

    await waitFor(() => {
      expect(updateCardEnrollmentAnswer).toHaveBeenCalled();
    });
    await waitFor(() => {
      expect(updateCardEnrollmentConfidence).toHaveBeenCalled();
    });
  });

  it('true false: should render true false question and answers', async () => {
    render(
      <SelectOptionBlock
        card={card}
        contentBlock={
          {
            ...multipleChoiceBlock,
            options: [
              {
                id: '1',
                isCorrect: false,
                optionText: getSlateNode('paragraph', 'True'),
              },
              {
                id: '2',
                isCorrect: true,
                optionText: getSlateNode('paragraph', 'False'),
              },
            ],
            type: 'trueFalse',
            multipleChoiceType: 'selectone',
          } as TrueFalseBlockType
        }
      />,
    );
    expect(screen.getByText('Question 1')).toBeTruthy();

    // Press wrong input
    fireEvent.press(screen.getByText('True'));
    expect(screen.getByText('headerincorrect')).toBeTruthy();

    // Press correct input
    fireEvent.press(screen.getByText('False'));
    expect(screen.getByText('headercorrect')).toBeTruthy();

    fireEvent.press(screen.getByText('Continue'));

    await waitFor(() => {
      expect(updateCardEnrollmentAnswer).toHaveBeenCalled();
    });
  });

  it('True False Quiz: should prevent users from changing their answer after seeing feedback', async () => {
    render(
      <SelectOptionBlock
        card={quizCard}
        contentBlock={
          {
            ...multipleChoiceBlock,
            options: [
              {
                id: '1',
                isCorrect: false,
                optionText: getSlateNode('paragraph', 'True'),
              },
              {
                id: '2',
                isCorrect: true,
                optionText: getSlateNode('paragraph', 'False'),
              },
            ],
            type: 'trueFalse',
            multipleChoiceType: 'selectone',
          } as TrueFalseBlockType
        }
      />,
    );
    expect(screen.getByText('Question 1')).toBeTruthy();

    // Press wrong input
    fireEvent.press(screen.getByText('True'));
    fireEvent.press(screen.getByText('Check'));
    expect(screen.getByText('headerincorrect')).toBeTruthy();

    // Press correct input
    fireEvent.press(screen.getByText('False'));
    expect(screen.getByText('headerincorrect')).toBeTruthy();

    fireEvent.press(screen.getByText('Continue'));

    await waitFor(() => {
      expect(updateCardEnrollmentAnswer).toHaveBeenCalled();
    });
  });

  // NOTE: This tests changes useAppSelector for the rest of the tests
  it('Completed KC: should show previous answer', async () => {
    (useAppSelector as jest.Mock).mockImplementation(
      jest.fn(() => ({
        learningItemList: [
          {
            id: '1',
            name: 'testTitle',
            type: 'lesson',
            description: 'testDesc',
            cards: [1],
          },
        ],
        cards: card,
        cardEnrollments: [
          {
            cardId: '1',
            answer: ['2'], // KC answers must be correct
            completedAt: new Date().toISOString(),
          },
        ],
      })),
    );
    const onFinish = jest.fn();
    render(
      <AuthoringCardPropsProvider onPrev={() => null} onFinish={onFinish}>
        <SelectOptionBlock
          card={card}
          contentBlock={
            {
              multipleChoiceType: 'selectone',
              ...multipleChoiceBlock,
            } as MultipleChoiceBlockType
          }
        />
      </AuthoringCardPropsProvider>,
    );
    expect(screen.getByText('Question 1')).toBeTruthy();
    expect(screen.getByText('Continue')).toBeTruthy();

    // Press wrong input
    fireEvent.press(screen.getByText('Answer 1'));

    fireEvent.press(screen.getByText('Continue'));

    await waitFor(() => {
      expect(onFinish).toHaveBeenCalled();
    });
  });

  it('Completed KC Quiz: should show the previous answer but not allow changes', async () => {
    (useAppSelector as jest.Mock).mockImplementation(
      jest.fn(() => ({
        learningItemList: [
          {
            id: '1',
            name: 'testTitle',
            type: 'lesson',
            description: 'testDesc',
            cards: [1],
          },
        ],
        cards: { ...card, type: CardType.QUIZ_CARD },
        cardEnrollments: [
          {
            cardId: '1',
            answer: ['1'], // KC answers must be correct
            completedAt: new Date().toISOString(),
          },
        ],
      })),
    );
    const onFinish = jest.fn();

    render(
      <AuthoringCardPropsProvider onPrev={() => null} onFinish={onFinish}>
        <SelectOptionBlock
          card={quizCard}
          contentBlock={
            {
              multipleChoiceType: 'selectone',
              ...multipleChoiceBlock,
            } as MultipleChoiceBlockType
          }
        />
      </AuthoringCardPropsProvider>,
    );
    expect(screen.getByText('Question 1')).toBeTruthy();
    expect(screen.getByText('Continue')).toBeTruthy();

    // Press correct input (should not change)
    fireEvent.press(screen.getByText('Answer 2'));

    fireEvent.press(screen.getByText('Continue'));

    await waitFor(() => {
      expect(onFinish).toHaveBeenCalled();
    });
  });
});
