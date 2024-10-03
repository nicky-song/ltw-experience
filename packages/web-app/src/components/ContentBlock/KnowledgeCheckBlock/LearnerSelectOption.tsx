import CardFeedback from '@components/CardFeedback';
import InputOption from '@components/InputOption';
import {
  AnswerOption,
  Card,
  MultipleChoiceBlockType,
  TrueFalseBlockType,
} from '@learn-to-win/common/features/Cards/cardTypes';
import { SelectOptionNavigation } from './SelectOptionNavigation';
import { useCallback, useEffect, useState } from 'react';
import { useAppSelector } from '@hooks/reduxHooks';
import { FeedBackType } from '@learn-to-win/common/constants/cardFeedbackType';
import { useAuthoringCardProps } from '@learn-to-win/common/hooks/AuthoringCardProps';
import { updateCardEnrollmentAnswer, updateCardEnrollmentConfidence } from '@learn-to-win/common/features/Enrollments/enrollmentService';
import { useMutation } from 'react-query';
import { Node } from 'slate';
import { CardType } from '@learn-to-win/common/constants';
import { useMachine } from '@xstate/react';
import { selectOptionMachine } from '@learn-to-win/common/hooks/useSelectOptionMachine';

interface LearnerSelectOptionProps {
  card: Card;
  block: MultipleChoiceBlockType | TrueFalseBlockType;
  isMultipleChoiceTypeSelectOne: boolean;
}

const LearnerSelectOption: React.FC<LearnerSelectOptionProps> = ({
  card,
  block,
  isMultipleChoiceTypeSelectOne,
}: LearnerSelectOptionProps) => {
  const [selectedConfidence, setSelectedConfidence] = useState<number>();
  const [feedbackType, setFeedbackType] = useState<FeedBackType>(null);
  const { cardEnrollments } = useAppSelector((state) => state.enrollment);
  const selectedCardEnrollment = cardEnrollments?.find(
    (cardEnrollment) => cardEnrollment.cardId === card?.id,
  );

  const { onPrev, onFinish } = useAuthoringCardProps();

  const enrollmentAnswerLength = selectedCardEnrollment?.answer?.length ?? 0;
  const isCardEnrollmentCompleted =
    !!selectedCardEnrollment?.completedAt || enrollmentAnswerLength > 0;

  const isConfidenceCheck = !!card.confidenceCheck

  const { mutate: mutateCardEnrollment } = useMutation<
    unknown,
    unknown,
    { learnerSelectedIds: string[] }
  >({
    mutationFn: async ({ learnerSelectedIds }) => {
      await updateCardEnrollmentAnswer({
        cardEnrollmentId: selectedCardEnrollment?.id,
        answer: learnerSelectedIds,
      });

      if (isConfidenceCheck) {
        await updateCardEnrollmentConfidence({
          cardEnrollmentId: selectedCardEnrollment?.id,
          confidence: selectedConfidence,
        });
      }
    },
  });

  // Local state
  const [current, send] = useMachine(selectOptionMachine, {
    // set the initial context
    context: {
      learnerAnswers: selectedCardEnrollment?.answer ?? [],
      isQuiz: card.type === CardType.QUIZ_CARD,
    },
    actions: {
      addAnswer: (context, event) => {
        context.learnerAnswers = [event.optionId];
      },
      toggleOption: (context, event) => {
        const index = context.learnerAnswers.indexOf(event.optionId);
        const copy = [...context.learnerAnswers];
        if (index > -1) {
          copy.splice(index, 1);
        } else {
          copy.push(event.optionId);
        }
        context.learnerAnswers = copy;
      },
      onComplete: () => {
        onFinish();
      },
      updateServer: (context) => {
        mutateCardEnrollment({
          learnerSelectedIds: context.learnerAnswers,
        });
      },
      syncAnswers: (context, { answers }) => {
        context.learnerAnswers = answers ?? [];
      },
    },
  });

  const learnerAnswers = current.context.learnerAnswers;
  const isQuiz = current.context.isQuiz;

  // Determine if the learner has answered the question
  useEffect(() => {
    if (isCardEnrollmentCompleted) {
      send('SUCCESS_COMPLETE');
    } else {
      send('SUCCESS_INCOMPLETE');
    }
  }, [isCardEnrollmentCompleted, send]);

  // Sync answers if they're not defined locally
  useEffect(() => {
    if (learnerAnswers.length === 0 && enrollmentAnswerLength) {
      send('SYNC_ANSWERS', { answers: selectedCardEnrollment?.answer ?? [] });
    }
  }, [enrollmentAnswerLength, learnerAnswers, selectedCardEnrollment, send]);

  const showFeedback = current.matches('showFeedback');
  const showAnswers =
    current.matches('showFeedback') || current.matches('completed');

  const allCorrectOptionIds = block?.options
    .filter((option: AnswerOption) => option.isCorrect)
    .map((option: AnswerOption) => option.id);
  const isCorrect =
    learnerAnswers.length === allCorrectOptionIds.length &&
    learnerAnswers.every((optionId) => allCorrectOptionIds.includes(optionId));

  useEffect(() => {
    if (showFeedback) {
      if (isCorrect) {
        setFeedbackType('correct');
      } else {
        setFeedbackType('incorrect');
      }
    } else {
      if (feedbackType !== 'confidence') {
        setFeedbackType(null);
      }
    }
  }, [feedbackType, isCorrect, showFeedback]);

  const getLearnerFeedbackType = (optionId: string) => {
    if (showAnswers) {
      const selectedOptionId = learnerAnswers?.includes(optionId);
      const selectedCorrectAnswer = allCorrectOptionIds?.includes(optionId);
      if (selectedOptionId && selectedCorrectAnswer) {
        return 'success';
      } else if (selectedOptionId && !selectedCorrectAnswer) {
        return 'failure';
      } else if (!selectedOptionId && selectedCorrectAnswer && isQuiz) {
        // Show correct unselected answer for quizzes
        return 'unmarked-correct';
      }
    }
    return null;
  };

  const selectAndSaveLearnerAnswer = useCallback(
    (optionId: string) => {
      if (isMultipleChoiceTypeSelectOne) {
        send('SELECT_ONE', { optionId });
      } else {
        send('TOGGLE_OPTION', { optionId });
      }
      if (!showFeedback && isConfidenceCheck && !isCardEnrollmentCompleted) {
        setFeedbackType('confidence');
      }
    },
    [
      isCardEnrollmentCompleted,
      isConfidenceCheck,
      isMultipleChoiceTypeSelectOne,
      send,
      showFeedback,
    ],
  );

  const isAnswered = learnerAnswers?.length;

  const isConfidenceSelected = useCallback((value: number) => {
    setSelectedConfidence(value);
  }, []);

  return (
    <div>
      {block?.options.map((option: AnswerOption) => {
        return (
          <InputOption
            key={option.id}
            feedBackType={getLearnerFeedbackType(option.id)}
            type={isMultipleChoiceTypeSelectOne ? 'radio' : 'checkbox'}
            value={learnerAnswers?.includes(option.id) ?? false}
            label={option.optionText.map((n) => Node.string(n))}
            onChange={() => {
              selectAndSaveLearnerAnswer(option.id);
            }}
          />
        );
      })}
      <CardFeedback
        feedBack={feedbackType}
        blockId={block.id}
        editable={false}
        confidenceCheck={isConfidenceCheck}
        selectedConfidence={selectedConfidence}
        onConfidenceSelected={isConfidenceSelected}
      />
      <SelectOptionNavigation
        onPrev={onPrev}
        answered={isAnswered}
        isQuiz={isQuiz}
        feedbackType={feedbackType}
        isConfidenceSelected={selectedConfidence !== undefined}
        isCardEnrollmentCompleted={isCardEnrollmentCompleted}
        onFinish={() => send('COMPLETE')}
        checkAnswerSelectAny={() => send('CHECK_ANSWER')}
      />
    </div>
  );
};

export default LearnerSelectOption;
