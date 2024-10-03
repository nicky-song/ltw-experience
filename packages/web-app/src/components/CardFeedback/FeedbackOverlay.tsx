import classNames from 'classnames';
import { FeedBackType } from '@learn-to-win/common/constants/cardFeedbackType';
interface FeedbackOverlayProps {
  feedBack: FeedBackType;
  isConfidenceCheckEnabled?: boolean;
  onClick?: (e?: React.MouseEvent<HTMLDivElement>) => void;
}
const FeedbackOverlay = ({
  feedBack,
  isConfidenceCheckEnabled = true,
  onClick,
}: FeedbackOverlayProps) => {
  if (feedBack === 'confidence' && !isConfidenceCheckEnabled) {
    return (
      <div className='disabled-confidence__overlay'>
        <div className='disabled-confidence__overlay__title'>
          Confidence Check Hidden.
        </div>
        <div>Screen not visible to learner after answering.</div>
      </div>
    );
  }
  return (
    <div
      className={classNames({
        'feedback__overlay--enabled': feedBack,
        'feedback__overlay--disabled': !feedBack,
      })}
      data-testid='feedback-overlay'
      onClick={onClick}></div>
  );
};

export default FeedbackOverlay;
