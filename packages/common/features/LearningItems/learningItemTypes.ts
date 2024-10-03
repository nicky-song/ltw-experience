import { LearningItemType } from '../../constants';

export interface GetLearningItemParams {
  organizationId: string | undefined;
  courseId: string | undefined;
}

export interface GetOneLearningItemParams {
  learningItemId: string;
}

export interface LearningItemState {
  learningItemList: LearningItem[];
  learningItemDetails: LearningItem | null;
  loading: boolean;
  error: null | string;
}

export interface GetFilteredLearningItemsParams {
  organizationId: string;
  searchQuery?: string;
}

export type LearningItem = {
  id: string;
  name: string;
  description: string;
  cards: [];
  updatedAt?: string;
  type: string;
};

export type CreateLearningItem = LearningItem & {
  '@context': string;
  '@id': string;
  '@type': string;
  course: string;
  createdAt: string;
  createdBy: string;
  state: string;
  updatedBy: string;
};
