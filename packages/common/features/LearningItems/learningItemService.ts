import {
  GetFilteredLearningItemsParams,
  GetLearningItemParams,
} from '@learn-to-win/common/features/LearningItems/learningItemTypes';
import { getLearningItemEnrollment } from '@learn-to-win/common/features/Enrollments/enrollmentService';
import { createCard } from '@learn-to-win/common/features/Cards/cardService';
import {
  getBodyBlock,
  getImageBlock,
  getTitleBlock,
} from '../Cards/cardTemplates';
import { getApiGatewayUrl, getRestClient } from '../../utils/restClient';
import { v4 as uuidv4 } from 'uuid';
import { CardType } from '../../constants';

export const getLearningItemsAPI = async ({
  organizationId,
  courseId,
}: GetLearningItemParams) => {
  const res = await getRestClient().get(
    `${getApiGatewayUrl()}learning_items?course.id=${courseId}&organizationId=${organizationId}`,
  );

  return res?.data['hydra:member'];
};

export const getFilteredLearningItems = async ({
  organizationId,
  searchQuery,
}: GetFilteredLearningItemsParams) => {
  const res = await getRestClient().get(
    `${getApiGatewayUrl()}learning_items?organizationId=${organizationId}&${searchQuery}`,
  );
  return res?.data['hydra:member'];
};

export const getOneLearningItem = async (learningItemEnrollmentId: string) => {
  const { learningItemId } = await getLearningItemEnrollment(
    learningItemEnrollmentId,
  );

  const { data } = await getRestClient().get(
    `${getApiGatewayUrl()}learning_items/${learningItemId}`,
  );

  return data;
};

export const createLearningItem = async ({
  type,
  state,
  courseId,
  name,
  description,
}: {
  type: string;
  state?: string;
  courseId: string;
  name?: string;
  description?: string;
}) => {
  const payload = {
    type,
    state,
    course: `/api/courses/${courseId}`,
    name,
    description,
  };

  const res = await getRestClient().post<{
    '@context': string;
    '@id': string;
    '@type': string;
    cards: string[];
    course: string;
    createdAt: string;
    createdBy: string;
    description: string;
    id: string;
    name: string;
    state: string;
    type: string;
    updatedAt: string;
    updatedBy: string;
  }>(`${getApiGatewayUrl()}learning_items`, payload);

  if (res) {
    await createCard({
      title: name as string,
      type: CardType.TITLE_CARD,
      sequenceOrder: 0,
      learningItemId: res.data?.id,
      confidenceCheck: false,
      json: {
        version: '1',
        description: '',
        templateType: null,
        contentBlocks: [
          getTitleBlock(uuidv4(), name),
          getBodyBlock(uuidv4(), description),
          getImageBlock(uuidv4()),
        ],
      },
    });
    await createCard({
      title: 'End Card',
      type: CardType.END_CARD,
      sequenceOrder: 1,
      learningItemId: res.data?.id,
      confidenceCheck: false,
      json: {
        version: '1',
        templateType: null,
        description: '',
        contentBlocks: [
          getTitleBlock(uuidv4(), `Great job on completing this ${type}!`),
          getBodyBlock(uuidv4(), 'Next Lesson or Quiz will be displayed here'),
        ],
      },
    });
  }

  return res?.data;
};

export async function getLearningItem({
  learningItemId,
}: {
  learningItemId: string | undefined;
}) {
  return await getRestClient().get<{
    cards: string[];
    course: string;
    createdAt: string;
    createdBy: string;
    id: string;
    name: string;
    state: string;
    type: string;
    updatedAt: string;
    updatedBy: string;
  }>(`${getApiGatewayUrl()}learning_items/${learningItemId}`);
}
