import { Text, TouchableHighlight, View, ScrollView } from 'react-native';
import { useEffect, useCallback } from 'react';
import { fetchAndCreateCourseEnrollments } from '@learn-to-win/common/features/Enrollments/enrollmentSlice';
import { GetCourseEnrollmentParams } from '@learn-to-win/common/features/Enrollments/enrollmentTypes';

import {
  useAppDispatch as useDispatch,
  useAppSelector as useSelector,
} from '../hooks/reduxHooks';

export function CourseDetails({ route, navigation }) {
  const { invitationId } = route.params;
  const dispatch = useDispatch();

  const { learningItemEnrollments } = useSelector((state) => state.enrollment);

  const { learningItemList } = useSelector((state) => state.learningItem);

  useEffect(() => {
    dispatch(
      fetchAndCreateCourseEnrollments({
        invitationId: invitationId,
      } as GetCourseEnrollmentParams),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invitationId]);

  const navigateToLearningItem = useCallback(
    (learningItemId: string) => {
      if (learningItemEnrollments[0] === undefined) return;
      const learningItemEnrollmentId = learningItemEnrollments.find(
        (item) => item.learningItemId === learningItemId,
      );
      if (!learningItemEnrollmentId) return;
      return () => {
        navigation.navigate('Lesson', {
          screen: 'LearnerLesson',
          params: {
            learningItemEnrollmentId: learningItemEnrollmentId?.id,
            invitationId: invitationId,
          },
        });
      };
    },
    [navigation, invitationId, learningItemEnrollments],
  );

  if (!invitationId) {
    return <Text>Invitation ID required</Text>;
  }

  return (
    <>
      <ScrollView>
        <Text>Learning Items:</Text>
        <Text>invitation.id: {invitationId}</Text>
        {learningItemList.map((learningItem) => (
          <TouchableHighlight
            onPress={navigateToLearningItem(learningItem.id)}
            key={learningItem.id}
            style={{
              paddingVertical: 10,
              paddingLeft: 20,
              margin: 5,
              backgroundColor: '#ccc',
            }}>
            <View>
              <Text style={{ fontWeight: '600' }}>{learningItem.name}</Text>
              <Text>{learningItem.description}</Text>
              <Text>{learningItem?.cards?.length} Cards</Text>
            </View>
          </TouchableHighlight>
        ))}
      </ScrollView>
    </>
  );
}
