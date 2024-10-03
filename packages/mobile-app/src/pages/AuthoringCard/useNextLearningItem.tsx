import { useNavigation, useRoute } from '@react-navigation/native';
import { useAppSelector } from '../../hooks/reduxHooks';
import { useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { LearningItem } from '@learn-to-win/common/features/LearningItems/learningItemTypes';
import { getLearningItem } from '@learn-to-win/common/features/LearningItems/learningItemService';

// This hook is responsible for getting the next learning item
export function useNextLearningItem({
  isEnabled,
  learningItemId,
}: {
  isEnabled: boolean;
  learningItemId: string;
}) {
  const navigation = useNavigation();

  const learningItemsEnrollments = useAppSelector(
    (state) => state.enrollment.learningItemEnrollments,
  );

  const nextLearningItemEnrollment = useMemo(() => {
    const currentIndex = learningItemsEnrollments?.findIndex(
      (learningItemEnrollment) =>
        learningItemEnrollment.learningItemId === learningItemId,
    );

    // If the current index defined and is not the last item in the array
    if (
      currentIndex > -1 &&
      learningItemsEnrollments?.length > currentIndex + 1
    ) {
      return learningItemsEnrollments[currentIndex + 1];
    }
  }, [learningItemsEnrollments, learningItemId]);

  const nextLearningItemId = nextLearningItemEnrollment?.learningItemId;

  const {
    data: nextLearningItem,
    isLoading,
    isError,
  } = useQuery<void, void, LearningItem | null>(
    ['nextLesson', nextLearningItemId],
    async () => {
      let nextLearningItem = null;
      if (nextLearningItemId) {
        nextLearningItem = (await getLearningItem({learningItemId: nextLearningItemId})).data;
      }

      return nextLearningItem;
    },
    {
      enabled: isEnabled,
    },
  );
  const { params } = useRoute();

  const navigateToNextLesson = useCallback(() => {
    if (nextLearningItem && isEnabled) {
      navigation.replace('Lesson', {
        screen: 'LearnerLesson',
        params: {
          learningItemEnrollmentId: nextLearningItemEnrollment?.id,
          invitationId: params.invitationId,
        },
      });
    }
  }, [
    isEnabled,
    navigation,
    nextLearningItem,
    nextLearningItemEnrollment?.id,
    params.invitationId,
  ]);

  return {
    navigateToNextLesson,
    nextLesson: isEnabled ? nextLearningItem : null,
    isLoading,
    isError,
  };
}
