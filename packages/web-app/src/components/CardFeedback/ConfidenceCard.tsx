import Button from '@components/Button';
import { ConfidenceScaleConfig } from '@learn-to-win/common/config/confidenceScaleConfig';
import './ConfidenceCard.scss';
import classNames from 'classnames';

interface ConfidenceCardProps {
  editing?: boolean;
  onConfidenceSelected?: (confidence: number) => void;
  selectedConfidence?: number;
}

const ConfidenceCard = ({
  editing,
  onConfidenceSelected,
  selectedConfidence,
}: ConfidenceCardProps) => {
  return (
    <div className={'confidence__card'}>
      <div className='confidence__card__header'>
        Select how confident you are with this answer:
      </div>
      <div className='confidence__card__scale'>
        {ConfidenceScaleConfig.map((scale) => (
          <div key={scale.value} className='confidence__card__scale__item'>
            <div className='confidence__card__scale__item__icon'>
              <Button
                htmlType='button'
                disabled={editing}
                type='default'
                size='large'
                classes={classNames({
                  confidence__card__scale__item__icon__button: true,
                  confidence__card__scale__item__icon__selected:
                    selectedConfidence === scale.value,
                })}
                onClick={() => onConfidenceSelected?.(scale.value)}
                data-testid={`confidence-level-${scale.value}`}>
                {scale.icon}
              </Button>
            </div>
            <div className='confidence__card__scale__item__label'>
              {scale.showLabel && (
                <div className='confidence__card__scale__item__label__text'>
                  {scale.label}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      {editing && (
        <Button
          htmlType='button'
          disabled
          type='default'
          size='large'
          classes='confidence__card__button'>
          Check
        </Button>
      )}
    </div>
  );
};

export default ConfidenceCard;
