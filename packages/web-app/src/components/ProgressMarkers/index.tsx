import classNames from 'classnames';
import './index.scss';
import { Card } from '@learn-to-win/common/features/Cards/cardTypes';

interface ProgressMarkersProps {
  currentIndex: number;
  cardList: Card[];
}
const ProgressMarkers = ({ currentIndex, cardList }: ProgressMarkersProps) => {
  return (
    <div className='progress-markers'>
      {cardList.map((curr, idx) => {
        return (
          <div
            key={curr?.id}
            className={classNames({
              'progress-markers__marker': true,
              'progress-markers__done': idx <= currentIndex,
            })}></div>
        );
      })}
    </div>
  );
};

export default ProgressMarkers;
