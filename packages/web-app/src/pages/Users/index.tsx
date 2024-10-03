import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import './index.scss';
import { CSVLink } from 'react-csv';
import { userColumns, userActivityHeader } from './constants';
import {
  useAppDispatch as useDispatch,
  useAppSelector as useSelector,
} from '@hooks/reduxHooks';
import TableViewLayout from '@/layouts/TableViewLayout';
import Text from '@components/Typography/Text';
import Link from '@components/Typography/Link';
import UsersCreateModal from './UsersCreateModal';
import DashboardLayout from '@/layouts/DashboardLayout';
import { getUsers, User } from '@features/Users/userSlice';
import { Dropdown } from 'antd';
import { getLearnerInvitedOrEnrolledCourses } from '@learn-to-win/common/features/Courses/coursesService';
import { useQuery } from 'react-query';

const Users: React.FC = () => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userData, setUserData] = useState<User>();

  const csvLink = useRef(CSVLink as any);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const { users, loading, error } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(getUsers({ itemsPerPage: 50 }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { data } = useQuery({
    queryKey: ['get-User-Activity-Report', userData],
    queryFn: () =>
      // call reporting_service endpoint with userId to get user activity report
      getLearnerInvitedOrEnrolledCourses({
        organizationId: '1edd401b-4f47-6b0c-af14-f7a89e373a72',
        userId: userData?.id,
      }),
    enabled: !!userData,
  });

  const userActivityData = useMemo(() => {
    return data?.length > 0
      ? data?.map((course: typeof data) => {
          return {
            courseName: course?.name,
            status: course?.status,
            dateInvited: '2022-1-1',
            dateStarted: '2022-1-1',
            dateCompleted: '2022-1-1',
          };
        })
      : [];
  }, [data]);

  useEffect(() => {
    if (userActivityData.length > 0) {
      csvLink.current.link.click();
    }
  }, [userActivityData]);

  const getUserActivityReport = useCallback(
    (user: User) => (e: React.MouseEvent<HTMLInputElement>) => {
      e.preventDefault();
      setUserData(user);
    },
    [setUserData],
  );

  const userOptionsMenu = useCallback(
    (user: User) => {
      return [
        {
          key: '1',
          label: (
            <Link
              href=''
              onClick={getUserActivityReport(user)}
              classes={'course-container__details'}>
              Download Learner Activity
            </Link>
          ),
        },
      ];
    },
    [getUserActivityReport],
  );

  const usersData = useMemo(() => {
    return users?.map((user) => {
      const items = userOptionsMenu(user);
      return {
        key: user?.id,
        ...user,
        details: (
          <Dropdown className={'course-container__dropdown'} menu={{ items }}>
            <Text>...</Text>
          </Dropdown>
        ),
      };
    });
  }, [users, userOptionsMenu]);

  return (
    <DashboardLayout>
      <UsersCreateModal
        setIsModalOpen={setIsModalOpen}
        isModalOpen={isModalOpen}
      />
      <TableViewLayout
        title={'Users'}
        columns={userColumns}
        dataSource={usersData}
        createResource={showModal}
        createButtonText={'Create User'}
        loading={loading}
        error={error}
      />
      <CSVLink
        data={userActivityData}
        headers={userActivityHeader}
        filename={'Learner Activity Report.csv'}
        ref={csvLink}
        target='_blank'
      />
    </DashboardLayout>
  );
};

export default Users;
