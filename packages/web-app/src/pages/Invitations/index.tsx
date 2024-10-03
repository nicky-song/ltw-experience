import DashboardLayout from '@/layouts/DashboardLayout';
import TableViewLayout from '@/layouts/TableViewLayout';
import { enrollmentColumns } from './constants';
import { useCallback, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useAppDispatch as useDispatch,
  useAppSelector as useSelector,
} from '@hooks/reduxHooks';
import { getInviteOrEnrolledCourses } from '@learn-to-win/common/features/Courses/courseSlice';
import Text from '@components/Typography/Text';

const Invitations: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userId } = useSelector((state) => state.auth);
  const { loading, error, enrolledCourseList } = useSelector(
    (state) => state.course,
  );
  useEffect(() => {
    dispatch(
      getInviteOrEnrolledCourses({
        organizationId: '1edd401b-4f47-6b0c-af14-f7a89e373a72',
        userId,
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const navigateToLearnerCourseDetails = useCallback(
    (record: { key: string }, rowIndex: number | undefined) => {
      return () => {
        navigate(`/learner/invitation/${record?.key}/details`);
        return null;
      };
    },
    [navigate],
  );

  const tableRows = useMemo(
    () =>
      enrolledCourseList.map((course) => ({
        key: course.id,
        name: <Text>{course.name}</Text>,
        status: <Text>{course.status}</Text>,
      })),
    [enrolledCourseList],
  );

  return (
    <DashboardLayout>
      <TableViewLayout
        dataSource={tableRows}
        columns={enrollmentColumns}
        loading={loading}
        title={'Courses'}
        error={error}
        navigate={navigateToLearnerCourseDetails}
      />
    </DashboardLayout>
  );
};

export default Invitations;
