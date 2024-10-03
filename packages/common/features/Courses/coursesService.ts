import {
  Course,
  CourseParams,
  CourseUpdateParams,
  InvitedCoursesParams,
  InvitedOrEnrolledCourseParams,
  OneCourseParams,
} from '@learn-to-win/common/features/Courses/types';
import { getInvitationsAPI } from '@learn-to-win/common/features/Invitations/invitationService';
import { getCourseEnrollments } from '@learn-to-win/common/features/Enrollments/enrollmentService';
import { Invitation } from '@learn-to-win/common/features/Invitations/types';
import { Enrollment } from '@learn-to-win/common/features/Enrollments/enrollmentTypes';
import { hasCompleted } from '@learn-to-win/common/features/Courses/utils';
import { getApiGatewayUrl, getRestClient } from '../../utils/restClient';

export const getCoursesAPI = async ({ organizationId }: CourseParams) => {
  const res = await getRestClient().get(
    `${getApiGatewayUrl()}courses?organizationId=${organizationId}&itemsPerPage=90&order[updatedAt]=desc`,
  );
  return res?.data['hydra:member'];
};

export const getInvitedCoursesAPI = async ({
  organizationId,
  invitationIds,
}: InvitedCoursesParams) => {
  const res = await getRestClient().get(
    `${getApiGatewayUrl()}courses?organizationId=${organizationId}&order[updatedAt]=desc&id[]=${invitationIds?.join(
      '&id[]=',
    )}`,
  );
  return res?.data['hydra:member'];
};

export const getCourseDetails = async ({
  courseId,
  organizationId,
}: OneCourseParams & CourseParams) => {
  const res = await getRestClient().get(
    `${getApiGatewayUrl()}courses/${courseId}?organization_id=${organizationId}`,
  );

  return res?.data;
};

export const createCourse = async ({
  organizationId,
  title,
  description,
}: {
  title: string;
  description?: string;
  organizationId?: string;
}) => {
  const res = await getRestClient().post(`${getApiGatewayUrl()}courses`, {
    title,
    description,
    organizationId,
  });
  return res?.data['hydra:member'];
};

export const updateCourseDetails = async({
  courseAttributes,
  courseId
}: CourseUpdateParams) => {
  const res = await getRestClient().put(`${getApiGatewayUrl()}courses/${courseId}`, courseAttributes);
  return res.data;
}

export const getLearnerInvitedOrEnrolledCourses = async ({
  organizationId,
  userId,
}: InvitedOrEnrolledCourseParams) => {
  const getInvitations = await getInvitationsAPI(userId);
  const getEnrollments = await getCourseEnrollments(
    getInvitations.map((i: Invitation) => i.id),
  );
  const getCourses = await getInvitedCoursesAPI({
    organizationId,
    invitationIds: getInvitations.map(
      (invitation: Invitation) => invitation.courseId,
    ),
  });

  return getCourses.map((course: Course) => {
    const { id: inviteId } = getInvitations.find(
      (invitation: Invitation) => invitation.courseId === course.id,
    );
    const enrollment = getEnrollments.find(
      (enrollment: Enrollment) =>
        enrollment.invitation === '/api/invitations/' + inviteId,
    );
    return {
      id: inviteId,
      name: course.title,
      status: hasCompleted(enrollment),
    };
  });
};
