import { Tooltip } from 'antd';
import Text from '../Typography/Text';
import './index.scss';
import { InfoCircleOutlined, UserOutlined } from '@ant-design/icons';
import Button from '../Button';

interface NextItemScreenProps {
  onFinish: (() => void) | undefined;
}

const NextItemScreen: React.FC<NextItemScreenProps> = ({
  onFinish,
}: NextItemScreenProps) => {
  return (
    <div className='next-item'>
      <div className='next-item__header'>
        <Text>Ready for next lesson?</Text>
        <div className='next-item__time-info'>
          <Tooltip title={'TBD'}>
            <InfoCircleOutlined />
          </Tooltip>
          <h6 className={'next-item__time'}>5 mins</h6>
        </div>
      </div>
      <div className={'next-item__item-description'}>
        <div className='next-item__img-placeholder'>
          {/* Please replace when implementing next item feature */}
          <UserOutlined style={{ fontSize: '35px' }} />
        </div>
        <div className='next-item__description-text'>
          <h3>How to Launch Dupixent</h3>
          <p>
            Lorem ipsum dolor sit amet consectetur. Tellus duis ante sed integer
            tincidunt ...
          </p>
        </div>
      </div>
      <div className='next-item__navigation'>
        <Button htmlType='button' size='large' type='default'>
          Next Lesson
        </Button>
        <Button htmlType='button' size='large' type='ghost' onClick={onFinish}>
          Back to Courses
        </Button>
      </div>
    </div>
  );
};

export default NextItemScreen;
