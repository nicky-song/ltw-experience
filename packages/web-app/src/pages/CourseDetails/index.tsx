import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@hooks/reduxHooks';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import { getCourseDetails } from '@learn-to-win/common/features/Courses/coursesService';
import { getLearningItemsAction } from '@learn-to-win/common/features/LearningItems/learningItemSlice';
import { adminLearningItemCols } from './constants';
import Text from '@components/Typography/Text';
import DashboardLayout from '@/layouts/DashboardLayout';
import TableViewLayout from '@/layouts/TableViewLayout';
import { CreateLearningItemModal } from './CreateLearningItemModal';

function CourseDetails() {
  const { courseId } = useParams();
  const dispatch = useAppDispatch();
  const {
    loading: learningItemLoading,
    error: learningItemError,
    learningItemList,
  } = useAppSelector((state) => state.learningItem);

  const [isLearningItemModalOpen, setIsLearningItemModalOpen] = useState(false);

  const {
    isLoading: courseLoading,
    error: courseError,
    data,
  } = useQuery(
    'learning-obj-list-get-course',
    async () => {
      return await getCourseDetails({
        organizationId: '1edd401b-4f47-6b0c-af14-f7a89e373a72',
        courseId,
      });
    },
    { staleTime: Infinity },
  );

  const getLearningItems = useCallback(() => {
    dispatch(
      getLearningItemsAction({
        organizationId: '1edd401b-4f47-6b0c-af14-f7a89e373a72',
        courseId: courseId as string,
      }),
    );
  }, [courseId, dispatch]);

  // TODO: Should have state for isFirstRender
  useEffect(() => {
    getLearningItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tableRows = useMemo(
    () =>
      learningItemList.map((learningItem) => ({
        key: learningItem.id,
        name: <Text>{learningItem?.name}</Text>,
        description: <Text>{learningItem?.description}</Text>,
        numberOfSlides: <Text>{learningItem?.cards?.length}</Text>,
      })),
    [learningItemList],
  );
  const navigate = useNavigate();
  const navigateToLearningItem = useCallback(
    (record: { key: string }, rowIndex: number | undefined) => {
      return () => {
        navigate(`/learning_item/${record?.key}`);
        return null;
      };
    },
    [navigate],
  );

  return (
    <DashboardLayout>
      <CreateLearningItemModal
        isOpen={isLearningItemModalOpen}
        setIsOpen={setIsLearningItemModalOpen}
      />
      <TableViewLayout
        dataSource={tableRows}
        columns={adminLearningItemCols}
        title={data?.title}
        backUrl={'/admin/courses'}
        loading={learningItemLoading || courseLoading}
        error={learningItemError || courseError}
        createResource={setIsLearningItemModalOpen as () => void}
        navigate={navigateToLearningItem}
      />
      {/* Modal goes here */}
    </DashboardLayout>
  );
}

export default CourseDetails;
