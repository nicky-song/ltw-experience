import { useState } from 'react';
import {
  AnswerOption,
  Card,
  MultipleChoiceBlockType,
  TrueFalseBlockType,
} from '@learn-to-win/common/features/Cards/cardTypes';
import { StyleSheet, Text, View } from 'react-native';
import { InputOption } from './InputOption';
import { RichTextViewer } from '../RichTextViewer';
import { useCallback, useEffect } from 'react';
import { useAppSelector } from '../../../../hooks/reduxHooks';
import { useMutation } from 'react-query';
import {
  SELECT_ALL_LABEL,
  SELECT_ONE_LABEL,
} from '@learn-to-win/common/constants/multipleChoiceTypeText';
import { Node } from 'slate';
import { FeedBackType } from '@learn-to-win/common/constants/cardFeedbackType';
import { Portal } from '@gorhom/portal';
import { updateCardEnrollmentAnswer, updateCardEnrollmentConfidence } from '@learn-to-win/common/features/Enrollments/enrollmentService';
import { useAuthoringCardProps } from '@learn-to-win/common/hooks/AuthoringCardProps';
import { FeedbackDrawer } from './FeedbackDrawer';
import { SelectOptionNavigation } from './SelectOptionNavigation';
import { useMachine } from '@xstate/react';
import { selectOptionMachine } from '@learn-to-win/common/hooks/useSelectOptionMachine';
import ConfidenceCard from './ConfidenceCard';
import { setCardEnrollmentAnswerCorrect } from '@learn-to-win/common/features/Enrollments/enrollmentSlice';

interface SelectOptionBlockProps {
  card: Card;
  contentBlock: MultipleChoiceBlockType | TrueFalseBlockType;
}

export function SelectOptionBlock({
  card,
  contentBlock,
}: SelectOptionBlockProps) {
  // global state
  const { cardEnrollments } = useAppSelector((state) => state.enrollment);
  const selectedCardEnrollment = cardEnrollments?.find(
    (cardEnrollment) => cardEnrollment.cardId === card?.id,
  );
  const { onPrev, onFinish } = useAuthoringCardProps();

  // Card is completed if there are answers on the enrollment. Completed at is set after user sees the feedback and
  // clicks continue. To avoid them from changing answers, selectedCardEnrollment.answer must be used to determine card
  // completion till completed at is set.
  const isCardEnrollmentCompleted =
    !!selectedCardEnrollment?.completedAt ||
    selectedCardEnrollment?.answer?.length > 0;

  // mutations
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
          confidence
        });
      }
    },
  });

  // Local state
  const [current, send] = useMachine(selectOptionMachine, {
    // set the initial context
    context: {
      learnerAnswers: selectedCardEnrollment?.answer ?? [],
      isQuiz: card.type === 'quiz',
      confidence: null
    },
    actions: {
      addAnswer: (context, event) => {
        context.learnerAnswers = [event.optionId];
      },
      selectConfidence: (context, event) => {
        context.confidence = event.confidence;
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
        let answerCorrect = true;
        if(learnerAnswers.length !== allCorrectOptionIds.length) {
          answerCorrect = false;
        } else {
          for(const answerOption of allCorrectOptionIds) {
            if(!learnerAnswers.includes(answerOption)) {
              answerCorrect = false;
              break;
            }
          }
        }
        setCardEnrollmentAnswerCorrect({id: selectedCardEnrollment.id, answerCorrect});
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

  // Render variables
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
    if (learnerAnswers.length === 0 && selectedCardEnrollment?.answer?.length) {
      send('SYNC_ANSWERS', { answers: selectedCardEnrollment?.answer ?? [] });
    }
  }, [learnerAnswers, selectedCardEnrollment, send]);

  const showFeedback = current.matches('showFeedback');
  const showAnswers =
    current.matches('showFeedback') || current.matches('completed');

  const allCorrectOptionIds = contentBlock?.options
    .filter((option: AnswerOption) => option.isCorrect)
    .map((option: AnswerOption) => option.id);
  const isCorrect =
    learnerAnswers.length === allCorrectOptionIds.length &&
    learnerAnswers.every((optionId) => allCorrectOptionIds.includes(optionId));

  const feedbackType: FeedBackType = showFeedback
    ? isCorrect
      ? 'correct'
      : 'incorrect'
    : null;

  const isMultipleChoiceTypeSelectOne =
    contentBlock.multipleChoiceType === 'selectone';

  const isAnswered = learnerAnswers?.length;
  const isAnswerCorrect = feedbackType === 'correct';
  const feedback =
    feedbackType !== null &&
    (isAnswerCorrect
      ? contentBlock.correctFeedback
      : contentBlock.incorrectFeedback);

  const isConfidenceCheck = !!card.confidenceCheck;
  const showConfidenceCard = current.matches('selectOption') && isConfidenceCheck && isAnswered && !isCardEnrollmentCompleted;
  const confidence = current.context.confidence;

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


  const onSelectConfident = (confidence: number) => {
    send('SELECT_CONFIDENCE', { confidence });
    send('CHECK_ANSWER');
  }

  const selectAndSaveLearnerAnswer = useCallback(
    (optionId: string) => {
      if (isMultipleChoiceTypeSelectOne) {
        send('SELECT_ONE', { optionId });
      } else {
        send('TOGGLE_OPTION', { optionId });
      }
    },
    [isMultipleChoiceTypeSelectOne, send],
  );

  return (
    <View style={[styles.selectOptionContainer]}>
      <View>
        <RichTextViewer json={contentBlock.question} />
      </View>
      <Text>
        {isMultipleChoiceTypeSelectOne ? SELECT_ONE_LABEL : SELECT_ALL_LABEL}
      </Text>
      {contentBlock.options.map((option: AnswerOption) => (
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
      ))}
      <Portal>
        {showConfidenceCard ? (
          <ConfidenceCard onCheck={onSelectConfident} onClose={onPrev} confidence={confidence} />
        ) : (feedbackType ? (
          <FeedbackDrawer
            answerCorrect={isAnswerCorrect}
            canContinue={isQuiz || isAnswerCorrect}
            feedback={feedback}
            onPrev={onPrev}
            onFinish={() => send('COMPLETE')}
          />
        ) : (
          <SelectOptionNavigation
            onPrev={onPrev}
            answered={isAnswered}
            isCardEnrollmentCompleted={isCardEnrollmentCompleted}
            onFinish={() => send('COMPLETE')}
            checkAnswerSelectAny={() => send('CHECK_ANSWER')}
          />
        ))}
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  selectOptionContainer: {
    display: 'flex',
    padding: 16,
    marginTop: 16,
  },
  buttonContinue: {
    marginRight: 10,
    backgroundColor: '#6FC07A',
    minWidth: 180,
  },
  buttonDisabled: { backgroundColor: undefined },
});