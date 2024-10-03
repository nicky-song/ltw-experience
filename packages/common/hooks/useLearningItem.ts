import { useQuery } from 'react-query';
import { getOneLearningItem } from '../features/LearningItems/learningItemService';

export const useLearningItem = (
  learningItemEnrollmentId: string | undefined,
) => {
  const {
    isLoading: learningItemLoading,
    error: learningItemError,
    data: learningItemData,
  } = useQuery('get-one-learning-obj', async () => {
    if (!learningItemEnrollmentId) {
      return;
    }
    return await getOneLearningItem(learningItemEnrollmentId);
  });

  return { learningItemLoading, learningItemError, learningItemData };
};
