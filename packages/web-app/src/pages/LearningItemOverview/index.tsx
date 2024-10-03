import PageLayout from '@/layouts/PageLayout';
import {
  ArrowLeftOutlined,
  InfoCircleOutlined,
  ReadOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import Button from '@components/Button';
import Title from '@components/Typography/Title';
import { useAppDispatch, useAppSelector } from '@hooks/reduxHooks';
import { getCardsAction } from '@learn-to-win/common/features/Cards/cardSlice';
import {
  getCourseDetailsAction,
  updateCourseDetailsAction,
} from '@learn-to-win/common/features/Courses/courseSlice';
import { getLearningItemsAction } from '@learn-to-win/common/features/LearningItems/learningItemSlice';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import './index.scss';
import { MenuItem } from '@/layouts/PageLayout/types';
import NavigationBarWrapper from '@components/NavigationBarWrapper/NavigationBarWrapper';
import { LearningItem } from '@learn-to-win/common/features/LearningItems/learningItemTypes';
import { LearningItemType } from '@learn-to-win/common/constants';
import { MenuProps } from 'antd';
import PageOverviewDrawer from '@components/PageOverviewDrawer';
import { CourseUpdatePayload } from '@learn-to-win/common/features/Courses/types';

const LearningItemDetails = () => {
  const { courseId } = useParams();
  const dispatch = useAppDispatch();
  const { learningItemList } = useAppSelector((state) => state.learningItem);
  const { courseDetails } = useAppSelector((state) => state.course);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const getLearningOverview = () => {
    if (!courseId) {
      return;
    }
    dispatch(
      getLearningItemsAction({
        courseId,
        organizationId: '1edd401b-4f47-6b0c-af14-f7a89e373a72',
      }),
    );
    dispatch(
      getCourseDetailsAction({
        courseId,
        organizationId: '1edd401b-4f47-6b0c-af14-f7a89e373a72',
      }),
    );
  };

  useEffect(() => {
    getLearningOverview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const sortByLq = (learningItemList: LearningItem[]) => {
    const learningItemListCopy = [...learningItemList];
    learningItemListCopy.sort((a) => {
      return a.type === LearningItemType.QUIZ ? 0 : -1;
    });
    return learningItemListCopy;
  };

  const sideMenuItems: MenuItem[] = useMemo(() => {
    return sortByLq(learningItemList)?.map((learningItem: LearningItem) => {
      const icon =
        learningItem?.type === LearningItemType.QUIZ ? (
          <ThunderboltOutlined />
        ) : (
          <ReadOutlined />
        );
      return {
        key: learningItem?.id,
        icon,
        label: learningItem?.name,
        onClick: (e: { key: string }) => {
          dispatch(getCardsAction({ learningItemId: e?.key }));
        },
      };
    });
  }, [learningItemList, dispatch]);

  const slideOutItems: MenuProps['items'] = [
    {
      label: `Course Details`,
      key: courseDetails?.id,
    },
  ];

  return (
    <PageLayout>
      <NavigationBarWrapper>
        <div className='learning-item-overview__back-container'>
          <div className={'learning-item-overview__back-container'}>
            <Button
              htmlType='button'
              shape={'default'}
              disabled={false}
              size={'middle'}
              type={'primary'}
              classes={'table-dashboard-container__back-button'}
              href={'/admin/courses'}
              icon={<ArrowLeftOutlined />}
            />
            <Title level={4}>{courseDetails?.title}</Title>
          </div>
          <div className={'learning-item-overview__right-nav'}>
            <Button
              htmlType='button'
              onClick={() => {
                setIsDrawerOpen(true);
              }}
              shape={'default'}
              disabled={false}
              size={'middle'}
              type={'ghost'}
              icon={<InfoCircleOutlined />}
            />
          </div>
        </div>
        <PageOverviewDrawer
          key={courseDetails?.id}
          onFormSubmit={(payload: CourseUpdatePayload) => {
            if (courseId) {
              dispatch(
                updateCourseDetailsAction({
                  courseAttributes: { ...payload },
                  courseId,
                }),
              );
            }
          }}
          isDrawerOpen={isDrawerOpen}
          defaultSelectedKeys={[courseDetails?.id]}
          menuItems={slideOutItems}
          itemData={courseDetails}
          onClose={() => {
            setIsDrawerOpen(false);
          }}
        />
      </NavigationBarWrapper>
      <PageLayout.FlexContainer>
        <PageLayout.SideBar items={sideMenuItems} onCreate={() => null} />
        {/* To Do: lq details and card grid component*/}
      </PageLayout.FlexContainer>
    </PageLayout>
  );
};

export default LearningItemDetails;
