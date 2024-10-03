import { Enrollment } from '../Enrollments/enrollmentTypes';

export const hasCompleted = (enrollment: Enrollment) => {
  if (!enrollment) {
    return 'Not Started';
  } else if (enrollment.completedAt) {
    return 'Completed';
  } else if (enrollment) {
    return 'In Progress';
  }
};
