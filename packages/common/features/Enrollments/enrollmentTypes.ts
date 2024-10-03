export interface CardEnrollmentParams {
  learningItemEnrollmentId: string;
  cardId: string;
  startedAt: string | null;
}

export interface CreateCardEnrollmentParams {
  courseEnrollment: string;
  learningItemId: string;
  learningItemEnrollmentId: string;
  progress: number;
}

export type CardEnrollment = {
  id: string;
  learningItemEnrollment: string;
  cardId: string;
  completedAt: string | null;
  answer: string[];
  answerCorrect: boolean;
};

export interface Enrollment {
  id: string;
  courseId: string;
  progress: string;
  invitation: string;
  completedAt: string;
  startedAt: string;
}

export interface EnrollmentState {
  cardEnrollments: CardEnrollment[];
  learningItemEnrollments: LearningItemEnrollment[];
  courseEnrollment: CourseEnrollment[];
  loading: boolean;
  error: null | string;
}

export interface CourseEnrollment {
  invitation: string;
  courseId: string;
  userId: string;
  organizationId: string;
  elapsedSec: number;
  progress: number;
  score: number;
}
export interface LearningItemEnrollment {
  id: string | undefined;
  courseEnrollment: string;
  learningItemId: string;
  progress: number;
  completedAt: string | null;
}

export interface CreateLearningItemEnrollmentParams {
  courseEnrollment: string;
  learningItemId: string;
  learningItemEnrollmentId: string;
  progress: number;
}

export interface UpdateLearningItemEnrollmentParams {
  learningItemEnrollmentId: string;
  completedAt: string | null;
  startedAt: string | null;
  elapsedSec: number;
}

export interface UpdateCardEnrollmentParams {
  cardEnrollmentId: string | undefined;
  completedAt: string | null;
  elapsedSec: number;
}

export interface UpdateCardEnrollmentStartedAtParams {
  cardEnrollmentId: string | undefined;
  startedAt: string | null;
}

export interface UpdateCourseEnrollmentStartedAtParams {
  courseItemEnrollmentId: string;
  startedAt: string | null;
}

export interface UpdateCourseEnrollmentCompletedAtParams {
  courseItemEnrollmentId: string;
}

export interface GetLearningItemEnrollmentParams {
  learningItemEnrollmentId: string;
}

export interface GetCourseEnrollmentParams {
  invitationId: string;
}

export interface GetLearningItemEnrollmentIdParams {
  learningItemEnrollmentId: string;
}
