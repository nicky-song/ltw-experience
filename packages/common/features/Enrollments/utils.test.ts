import { Enrollment, LearningItemEnrollment } from './enrollmentTypes';
import {
  areAllLearningItemsCompleted,
  getEnrollmentIdFromEnrollmentIRI,
  getLearningItemProgress,
} from './utils';

describe('utils', () => {
  it('should determine learning item progress from its card enrollments', () => {
    const cards: Enrollment[] = [
      {
        id: '1',
        courseId: '1',
        progress: '20',
        completedAt: 'true',
        startedAt: '',
        invitation: '',
      },
      {
        id: '1',
        courseId: '1',
        progress: '20',
        completedAt: '',
        startedAt: '',
        invitation: '',
      },
    ];
    const progress = getLearningItemProgress(cards);
    expect(progress).toEqual(50);
  });

  it('should get all Course Item CompletedAt', () => {
    const enrollmentIRI = 'api/enrollments/12345';
    const enrollmentId = getEnrollmentIdFromEnrollmentIRI(enrollmentIRI);
    expect(enrollmentId).toEqual('12345');
  });

  it('all learning item are completed from a course enrollement', () => {
    const learningItemEnrollmentList: LearningItemEnrollment[] = [
      {
        id: '1',
        courseEnrollment: '1',
        learningItemId: '1',
        progress: 2,
        completedAt: '1-1-2021',
      },
    ];
    const courseCompleted = areAllLearningItemsCompleted(
      learningItemEnrollmentList,
    );
    expect(courseCompleted).toEqual(true);
  });

  it('not all learning item are completed from a course enrollement', () => {
    const learningItemEnrollmentList: LearningItemEnrollment[] = [
      {
        id: '1',
        courseEnrollment: '1',
        learningItemId: '1',
        progress: 2,
        completedAt: null,
      },
    ];
    const courseCompleted = areAllLearningItemsCompleted(
      learningItemEnrollmentList,
    );
    expect(courseCompleted).toEqual(false);
  });
});
