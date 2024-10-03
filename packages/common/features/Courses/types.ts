export type Course = {
  id: string;
  title: string;
  description: string;
};

export interface CourseState {
  courseList: Course[];
  courseDetails: Course;
  error: null | string;
  loading: boolean;
}

export type CourseParams = {
  organizationId: string;
  enrollmentIds?: string[];
};

export type CourseDetailsParams = {
  organizationId: string;
  courseId: string;
}
export type OneCourseParams = {
  courseId: string | undefined;
};

export type InvitedOrEnrolledCourseParams = {
  organizationId: string;
  userId: string | undefined;
};

export type InvitedCoursesParams = {
  organizationId: string;
  invitationIds: string[];
};

export type EnrolledCourse = {
  id: string;
  name: string;
  status: string;
};

export type CourseUpdatePayload = {
  organizationId: string;
  title: string | null;
  description: string | null;
  state?: CourseStatus;
}
export interface CourseUpdateParams {
  courseAttributes: CourseUpdatePayload;
  courseId:string;
}

export enum CourseStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived'
}