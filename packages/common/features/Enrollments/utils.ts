import {
  CardEnrollment,
  Enrollment,
  LearningItemEnrollment,
} from './enrollmentTypes';

export const getLearningItemProgress = (
  cardEnrollmentList: Enrollment[],
): number => {
  let cardCompletedCount = 0;
  for (const card of cardEnrollmentList) {
    const { completedAt } = card;
    if (completedAt) {
      cardCompletedCount++;
    }
  }

  return cardCompletedCount > 0
    ? Math.floor((cardCompletedCount / cardEnrollmentList.length) * 100)
    : 0;
};

export const areAllLearningItemsCompleted = (
  learningItemEnrollmentList: LearningItemEnrollment[],
): boolean => {
  for (const learningItem of learningItemEnrollmentList) {
    const { completedAt } = learningItem;
    if (!completedAt) {
      return false;
    }
  }

  return true;
};

export const getEnrollmentIdFromEnrollmentIRI = (
  enrollmentIRI: string,
): string => {
  const enrollmentId = enrollmentIRI.substring(
    enrollmentIRI.lastIndexOf('/') + 1,
  );
  return enrollmentId;
};

export const getEnrollmentScore = (cardEnrollmentList: CardEnrollment[]) => {
  let correct = 0,
    incorrect = 0,
    graded = 0;
  for (const cardEnrollmentItem of cardEnrollmentList) {
    const { answerCorrect } = cardEnrollmentItem;
    switch (answerCorrect) {
      case true:
        correct++;
        break;
      case false:
        incorrect++;
        break;
      case null:
        graded++;
        break;
      default:
        graded++;
        break;
    }
    return {
      correct,
      incorrect,
      graded,
    };
  }
};
