import { useCallback, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  useAppDispatch as useDispatch,
  useAppSelector as useSelector,
} from '@hooks/reduxHooks';
import DashboardLayout from '@/layouts/DashboardLayout';
import TableViewLayout from '@/layouts/TableViewLayout';
import Button from '@components/Button';
import { learnerLearningItemCols } from './constants';
import Text from '@components/Typography/Text';
import { fetchAndCreateCourseEnrollments } from '@learn-to-win/common/features/Enrollments/enrollmentSlice';
import { GetCourseEnrollmentParams } from '@learn-to-win/common/features/Enrollments/enrollmentTypes';

const LearnerCourseDetails: React.FC = () => {
  const { invitationId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    loading: enrollmentLoading,
    error: enrollmentError,
    learningItemEnrollments,
  } = useSelector((state) => state.enrollment);

  const {
    loading: courseLoading,
    error: courseError,
    courseDetails,
  } = useSelector((state) => state.course);

  const {
    loading: learningItemLoading,
    error: learningItemError,
    learningItemList,
  } = useSelector((state) => state.learningItem);

  useEffect(() => {
    dispatch(
      fetchAndCreateCourseEnrollments({
        invitationId: invitationId,
      } as GetCourseEnrollmentParams),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const navigateToLearningItem = useCallback(
    (learningItemId: string) => {
      if (learningItemEnrollments[0] === undefined) return;
      const learningItemEnrollmentId = learningItemEnrollments.find(
        (item) => item.learningItemId === learningItemId,
      );
      if (!learningItemEnrollmentId) return;
      return () => {
        navigate(
          `/learner/learning_item/${learningItemEnrollmentId?.id}/invitation/${invitationId}`,
        );
      };
    },
    [navigate, invitationId, learningItemEnrollments],
  );

  const tableRows = useMemo(
    () =>
      learningItemList.map((learningItem) => ({
        key: learningItem.id,
        name: <Text>{learningItem?.name}</Text>,
        description: <Text>{learningItem?.description}</Text>,
        numberOfCards: <Text>{learningItem?.cards?.length}</Text>,
        action: (
          <Button
            htmlType='button'
            type='primary'
            disabled={!learningItemEnrollments.length}
            shape={'default'}
            size={'middle'}
            onClick={navigateToLearningItem(learningItem.id)}>
            Start
          </Button>
        ),
      })),
    [learningItemList, navigateToLearningItem, learningItemEnrollments],
  );

  return (
    <DashboardLayout>
      <TableViewLayout
        dataSource={tableRows}
        columns={learnerLearningItemCols}
        title={courseDetails?.title}
        backUrl={'/learner/courses'}
        loading={learningItemLoading || courseLoading || enrollmentLoading}
        error={learningItemError || courseError || enrollmentError}
      />
    </DashboardLayout>
  );
};

export default LearnerCourseDetails;
