import { LearningItem } from '@learn-to-win/common/features/LearningItems/learningItemTypes';
import { Divider, Drawer, Menu, MenuProps } from 'antd';
import Text from '@components/Typography/Text';
import { Card } from '@learn-to-win/common/features/Cards/cardTypes';
import {
  TabletOutlined,
  CheckCircleFilled,
  UserOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import classNames from 'classnames';
import Title from '@components/Typography/Title';
import Button from '@/components/Button';
interface CardDrawerProps {
  learningData: LearningItem;
  cardList: Card[];
  open: boolean;
  setOpen: (val: boolean) => void;
  currentIndex: number;
}

const items: MenuProps['items'] = [
  {
    label: 'Lesson Details',
    key: 'lessondetails',
  },
];

export const CardDrawer: React.FC<CardDrawerProps> = ({
  learningData,
  cardList,
  open,
  setOpen,
  currentIndex,
}: CardDrawerProps) => {
  return (
    <Drawer
      onClose={() => {
        setOpen(false);
      }}
      className='learning-details'
      closeIcon={
        <Button
          htmlType='button'
          classes={'learning-details__exit'}
          size='large'
          type='ghost'
          icon={<CloseOutlined />}></Button>
      }
      width={440}
      title={
        <div>
          <Menu
            mode={'horizontal'}
            items={items}
            className='learning-details__menu-nav'
            selectedKeys={['lessondetails']}
          />
        </div>
      }
      open={open}>
      <div className='learning-details__menu-wrapper'>
        <div className='learning-details__menu-container'>
          <div className='learning-details__menu-img-name'>
            {/*<img src='' alt='' /> Please replace with the actual image when user profile
            is available*/}
            <div className='learning-details__img-placeholder'>
              <UserOutlined style={{ fontSize: '35px' }} />
            </div>
            <Title level={5}>{learningData?.name}</Title>
          </div>
          <Text classes='learning-details__menu-desc'>
            {learningData?.description
              ? learningData?.description
              : 'No Description'}
          </Text>
        </div>
        <Divider className='learning-details__drawer-divider' />
      </div>

      <ol className='learning-details__card-list'>
        {cardList?.map((card: Card, idx: number) => {
          return (
            <li className='learning-details__list-item' key={card?.id}>
              <div className='learning-details__card-icon-title'>
                <TabletOutlined
                  className={classNames({
                    'learning-details__disabled': idx > currentIndex,
                  })}
                />
                <Text
                  classes={classNames({
                    'learning-details__menu-card-title': true,
                    'learning-details__menu-card-title-extended':
                      idx === currentIndex,
                    'learning-details__disabled': idx > currentIndex,
                  })}>
                  {card?.title ? card?.title : 'No Title'}
                </Text>
              </div>
              <div className='learning-details__complete-check'>
                {idx === currentIndex && (
                  <Text classes={'learning-details__menu-card-title'}>
                    You&apos;re Here
                  </Text>
                )}
                <CheckCircleFilled
                  className={classNames({
                    'learning-details__hidden': idx >= currentIndex,
                    'learning-details__green-check': true,
                  })}
                />
              </div>
            </li>
          );
        })}
      </ol>
    </Drawer>
  );
};
