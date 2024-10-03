import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useAppDispatch as useDispatch,
  useAppSelector as useSelector,
} from '@hooks/reduxHooks';
import DashboardLayout from '@/layouts/DashboardLayout';
import TableViewLayout from '@/layouts/TableViewLayout';
import Text from '@components/Typography/Text';
import { coursesColumns } from './constants';
import { getCoursesAction } from '@learn-to-win/common/features/Courses/courseSlice';
import { Course } from '@learn-to-win/common/features/Courses/types';
import { CreateCourseModal } from './CreateCourseModal';
import InviteLearnerModal from './InviteLearnerModal';
import { Button } from 'antd';

import './index.scss';

const Courses: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isCreateCourseModalOpen, setIsCreateCourseModalOpen] = useState(false);
  const [isInviteLearnerModalOpen, setInviteLearnerModalOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  useEffect(() => {
    // Todo: Need to have a current org id?
    dispatch(
      getCoursesAction({
        organizationId: '1edd401b-4f47-6b0c-af14-f7a89e373a72',
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { loading, error, courseList } = useSelector((state) => state.course);
  const { userId: adminId } = useSelector((state) => state.auth);
  const setInviteToCourseModalOpen = useCallback(
    (course: Course) => {
      setInviteLearnerModalOpen(true);
      if (course) {
        setSelectedCourseId(course.id);
      }
    },
    [setInviteLearnerModalOpen, setSelectedCourseId],
  );

  const coursesData = useMemo(() => {
    if (courseList?.length) {
      return courseList?.map((course: Course) => {
        return {
          key: course?.id,
          name: <Text>{course?.title}</Text>,
          description: (
            <div className='course-container__description'>
              <Text>{course?.description}</Text>
              {/* Todo: This route needs to change depending on role*/}
            </div>
          ),
          details: (
            <>
              <Button
                htmlType='button'
                className='course-container__details-button'
                onClick={() => {
                  navigate(`/admin/courses/${course?.id}/details`);
                }}>
                View Course
              </Button>
              <Button
                htmlType='button'
                onClick={() => {
                  setInviteToCourseModalOpen(course);
                }}>
                Invite Learner
              </Button>
            </>
          ),
        };
      });
    }
  }, [courseList, navigate, setInviteToCourseModalOpen]);

  const setCreateModalOpen = useCallback(() => {
    setIsCreateCourseModalOpen(true);
  }, []);

  return (
    <DashboardLayout>
      <CreateCourseModal
        isOpen={isCreateCourseModalOpen}
        setIsOpen={setIsCreateCourseModalOpen}
      />
      <InviteLearnerModal
        isOpen={isInviteLearnerModalOpen}
        setIsOpen={setInviteLearnerModalOpen}
        courseId={selectedCourseId}
        adminId={adminId}
      />
      <TableViewLayout
        dataSource={coursesData}
        columns={coursesColumns}
        title={'Courses'}
        createResource={setCreateModalOpen}
        loading={loading}
        error={error}
      />
    </DashboardLayout>
  );
};

export default Courses;
