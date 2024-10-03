import { Text, TouchableHighlight, ActivityIndicator } from 'react-native';
import { useEffect } from 'react';
import { getInviteOrEnrolledCourses } from '@learn-to-win/common/features/Courses/courseSlice';
import {
  useAppDispatch as useDispatch,
  useAppSelector as useSelector,
} from '../hooks/reduxHooks';

export function Invitations({ navigation }) {
  const dispatch = useDispatch();
  const {
    course: { loading, enrolledCourseList },
    userId,
  } = useSelector((state) => {
    return { course: state.course, userId: state.auth.userId };
  });
  useEffect(() => {
    dispatch(
      getInviteOrEnrolledCourses({
        organizationId: '1edd401b-4f47-6b0c-af14-f7a89e373a72',
        userId,
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  return (
    <>
      <Text>Invitations:</Text>
      {enrolledCourseList.map((course) => (
        <TouchableHighlight
          onPress={() =>
            navigation.navigate('CourseDetails', { invitationId: course.id })
          }
          key={course.id}
          style={{
            paddingVertical: 10,
            paddingLeft: 20,
            margin: 5,
            backgroundColor: '#ccc',
          }}>
          <Text>{course.name}</Text>
        </TouchableHighlight>
      ))}
      {loading && <ActivityIndicator size='large' color='#6FC07A' />}
    </>
  );
}
