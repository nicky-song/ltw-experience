export type Invitation = {
  id: string;
  invitedUserId: string;
  courseId: string;
  maxEnrollments: number;
  expiresAt: string;
  courseDueAt: string;
};
