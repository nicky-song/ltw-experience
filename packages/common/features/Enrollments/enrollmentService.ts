import {
  CardEnrollmentParams,
  CreateCardEnrollmentParams,
  UpdateCardEnrollmentParams,
  UpdateCardEnrollmentStartedAtParams,
  UpdateCourseEnrollmentCompletedAtParams,
  UpdateCourseEnrollmentStartedAtParams,
  UpdateLearningItemEnrollmentParams,
} from './enrollmentTypes';
import { areAllLearningItemsCompleted, getLearningItemProgress } from './utils';
import { getApiGatewayUrl, getRestClient } from '../../utils/restClient';

export async function createCourseInvitations(
  invitedUserId: string | undefined,
  organizationId: string,
  courseId: string,
  lastUpdatedByUserId: string,
) {
  const res = await getRestClient().post(`${getApiGatewayUrl()}invitations`, {
    invitedUserId,
    organizationId,
    courseId,
    lastUpdatedByUserId,
  });

  return res?.data['hydra:member'];
}

export async function getCourseEnrollment(invitationId: string | undefined) {
  const res = await getRestClient().get(
    `${getApiGatewayUrl()}course_enrollments?invitation.id=${invitationId}`,
  );

  return res?.data['hydra:member'];
}

export async function getCourseEnrollments(invitationIds: string[]) {
  const res = await getRestClient().get(
    `${getApiGatewayUrl()}course_enrollments?invitation.id[]=${invitationIds.join(
      '&invitation.id[]=',
    )}`,
  );

  return res?.data['hydra:member'];
}

export async function getLearningItemsEnrollmentByCourse(
  courseEnrollmentId: string | undefined,
) {
  const res = await getRestClient().get(
    `${getApiGatewayUrl()}learning_item_enrollments?courseEnrollment.id=${courseEnrollmentId}`,
  );

  return res?.data['hydra:member'];
}

export const createCourseEnrollment = async ({
  invitation,
  courseId,
  userId,
  organizationId,
}: {
  invitation: string;
  courseId: string;
  userId: string;
  organizationId: string;
}) => {
  const res = await getRestClient().post(
    `${getApiGatewayUrl()}course_enrollments`,
    {
      courseId,
      organizationId,
      userId,
      invitation,
    },
  );
  return res?.data;
};

export const createLearningItemEnrollment = async ({
  courseEnrollment,
  learningItemId,
  progress,
}: CreateCardEnrollmentParams) => {
  const res = await getRestClient().post(
    `${getApiGatewayUrl()}learning_item_enrollments`,
    {
      courseEnrollment: courseEnrollment,
      learningItemId: learningItemId,
      progress: progress,
    },
  );
  return res?.data;
};

export const updateLearningEnrollment = async ({
  learningItemEnrollmentId,
  completedAt,
  startedAt,
  elapsedSec,
}: UpdateLearningItemEnrollmentParams) => {
  const previousEnrollmentData = await getRestClient().get(
    `${getApiGatewayUrl()}learning_item_enrollments/${learningItemEnrollmentId}`,
  );

  const {
    completedAt: previousCompletedAt,
    startedAt: previousStartedAt,
    elapsedSec: previousElapsedTime,
  } = previousEnrollmentData?.data || {};

  if (previousCompletedAt) {
    return;
  }
  if (previousStartedAt) {
    startedAt = previousStartedAt;
  }

  const cardEnrollmentList = await getCardsEnrollmentByLearningItem(
    learningItemEnrollmentId,
  );

  const progress: number = getLearningItemProgress(cardEnrollmentList);

  const res = await getRestClient().patch(
    `${getApiGatewayUrl()}learning_item_enrollments/${learningItemEnrollmentId}`,
    {
      completedAt,
      startedAt,
      elapsedSec: elapsedSec + previousElapsedTime,
      progress: progress,
    },
    { headers: { 'content-type': 'application/merge-patch+json' } },
  );

  return res?.data['hydra:member'];
};

export const updateCourseEnrollmentStartedAt = async ({
  courseItemEnrollmentId,
  startedAt,
}: UpdateCourseEnrollmentStartedAtParams) => {
  const learningItemEnrollment = await getCourseEnrollmentById(
    courseItemEnrollmentId,
  );

  const { startedAt: previousStartedAt } = learningItemEnrollment || {};
  if (previousStartedAt) {
    return;
  }

  const res = await getRestClient().patch(
    `${getApiGatewayUrl()}course_enrollments/${courseItemEnrollmentId}`,
    {
      startedAt: startedAt,
    },
    { headers: { 'content-type': 'application/merge-patch+json' } },
  );

  return res?.data['hydra:member'];
};

export const updateCourseEnrollmentCompletedAt = async ({
  courseItemEnrollmentId,
}: UpdateCourseEnrollmentCompletedAtParams) => {
  const learningItemEnrollment = await getLearningItemsEnrollmentByCourse(
    courseItemEnrollmentId,
  );

  const completed: boolean = areAllLearningItemsCompleted(
    learningItemEnrollment,
  );
  if (!completed) {
    return;
  }

  const date = new Date().toISOString();
  const res = await getRestClient().patch(
    `${getApiGatewayUrl()}course_enrollments/${courseItemEnrollmentId}`,
    {
      completedAt: date,
    },
    { headers: { 'content-type': 'application/merge-patch+json' } },
  );

  return res?.data['hydra:member'];
};

export const updateCardEnrollmentStartedAt = async ({
  cardEnrollmentId,
  startedAt,
}: UpdateCardEnrollmentStartedAtParams) => {
  const previousCardEnrollmentData = await getCardEnrollmentById(
    cardEnrollmentId,
  );

  const { startedAt: previousStartedAt } = previousCardEnrollmentData || {};

  if (previousStartedAt) {
    return;
  }

  const res = await getRestClient().patch(
    `${getApiGatewayUrl()}card_enrollments/${cardEnrollmentId}`,
    {
      startedAt: startedAt,
    },
    { headers: { 'content-type': 'application/merge-patch+json' } },
  );

  return res?.data['hydra:member'];
};

export const updateCardEnrollment = async ({
  cardEnrollmentId,
  completedAt,
  elapsedSec,
}: UpdateCardEnrollmentParams) => {
  const previousCardEnrollmentData = await getCardEnrollmentById(
    cardEnrollmentId,
  );

  const { completedAt: previousCompletedAt, elapsedSec: previousElapsedTime } =
    previousCardEnrollmentData || {};

  if (previousCompletedAt) {
    completedAt = previousCompletedAt;
  }

  const res = await getRestClient().patch(
    `${getApiGatewayUrl()}card_enrollments/${cardEnrollmentId}`,
    {
      completedAt,
      elapsedSec: elapsedSec + previousElapsedTime,
    },
    { headers: { 'content-type': 'application/merge-patch+json' } },
  );

  return res?.data['hydra:member'];
};

export const updateCardEnrollmentAnswer = async ({
  cardEnrollmentId,
  answer,
}: {
  cardEnrollmentId: string | undefined;
  answer: string[] | [null];
}) => {
  const res = await getRestClient().patch(
    `${getApiGatewayUrl()}card_enrollments/${cardEnrollmentId}`,
    {
      answer,
    },
    { headers: { 'content-type': 'application/merge-patch+json' } },
  );

  return res?.data['hydra:member'];
};

export const updateCardEnrollmentConfidence = async ({
  cardEnrollmentId,
  confidence,
}: {
  cardEnrollmentId: string | undefined;
  confidence: number | undefined;
}) => {
  const res = await getRestClient().patch(
    `${getApiGatewayUrl()}card_enrollments/${cardEnrollmentId}`,
    {
      confidence,
    },
    { headers: { 'content-type': 'application/merge-patch+json' } },
  );

  return res?.data['hydra:member'];
};

export const createCardEnrollment = async ({
  learningItemEnrollmentId,
  cardId,
  startedAt,
}: CardEnrollmentParams) => {
  const res = await getRestClient().post(
    `${getApiGatewayUrl()}card_enrollments`,
    {
      learningItemEnrollment: `/api/learning_item_enrollments/${learningItemEnrollmentId}`,
      cardId: cardId,
      startedAt: startedAt,
    },
  );
  return res?.data;
};

export const getCourseEnrollmentById = async (
  courseItemEnrollmentId: string,
) => {
  const res = await getRestClient().get(
    `${getApiGatewayUrl()}course_enrollments/${courseItemEnrollmentId}`,
  );

  return res?.data;
};

export const getLearningItemEnrollment = async (
  learningItemEnrollmentId: string,
) => {
  const res = await getRestClient().get(
    `${getApiGatewayUrl()}learning_item_enrollments/${learningItemEnrollmentId}`,
  );

  return res?.data;
};

export const getCardEnrollmentById = async (
  cardEnrollmentId: string | undefined,
) => {
  const res = await getRestClient().get(
    `${getApiGatewayUrl()}card_enrollments/${cardEnrollmentId}`,
  );

  return res?.data;
};

export const getCardsEnrollmentByLearningItem = async (
  learningItemEnrollmentId: string,
) => {
  const res = await getRestClient().get(
    `${getApiGatewayUrl()}card_enrollments?learningItemEnrollment.id=${learningItemEnrollmentId}`,
  );
  return res?.data['hydra:member'];
};
