import { FeedBackType } from '@learn-to-win/common/constants/cardFeedbackType';

export const feedbackTooltipText = (feedBackType: FeedBackType) => {
  switch (feedBackType) {
    case 'correct':
      return 'Define feedback for the learner. This screen displays after answering the correct answer.';
    case 'incorrect':
      return 'Define feedback for the learner. This screen displays after answering the incorrect answer.';
    case 'confidence':
      return 'Gauge learner confidence level. This screen displays after selecting an answer';
    default:
      return '';
  }
};
