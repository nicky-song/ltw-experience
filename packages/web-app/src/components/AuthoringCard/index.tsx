import './index.scss';
import { getContentBlocksFromCard } from '../ContentBlock/CardHelper';
import { useAppDispatch, useAppSelector } from '@hooks/reduxHooks';
import { Card } from '@learn-to-win/common/features/Cards/cardTypes';
import Button from '@components/Button';
import { BlankCardMessage } from '@pages/AdminLesson/BlankCardMessage/BlankCardMessage';
import classNames from 'classnames';
import { setSelectedCardIdAction } from '@learn-to-win/common/features/Cards/cardSlice';
import { useScrollObserver } from '@hooks/useScrollObserver';
import NextItemScreen from './NextItemScreen';
import { useNavigate, useParams } from 'react-router-dom';
import { useCardCompletionCheck } from '@learn-to-win/common/hooks/CardCompletionCheck';
import { CardType } from '@learn-to-win/common/constants';
import { LessonBackButton } from './LessonNavigation';

interface AuthoringCardProps {
  card: Card;
  onPrev?: () => void;
  onFinish?: () => void;
  cardType?: CardType;
  previewMode?: boolean;
  loading?: boolean;
}
const AuthoringCard: React.FC<AuthoringCardProps> = ({
  card,
  onPrev,
  onFinish,
  cardType,
  previewMode = false,
}) => {
  const { selectedCardId } = useAppSelector((state) => state.card);
  const { cardEnrollments } = useAppSelector((state) => state.enrollment);
  const dispatch = useAppDispatch();
  const { learningItemId } = useParams();
  const { scrollableElement, observedElement, isAtBottom } =
    useScrollObserver();
  const { isCardComplete, continueMessage, isCompletionUIHidden } =
    useCardCompletionCheck({
      isAtBottom,
      cardEnrollment: cardEnrollments?.find(
        (cardEnrollment) => cardEnrollment.cardId === card.id,
      ),
      cardType,
    });
  const navigate = useNavigate();

  const setSelfAsSelectedCard = () => {
    if (previewMode) {
      return;
    }
    if (learningItemId) {
      navigate(`/learning_item/${learningItemId}/card/${card?.id}`);
    }
    dispatch(setSelectedCardIdAction(card?.id));
  };

  const editable = card?.id === selectedCardId;
  const contentBlocks = getContentBlocksFromCard(
    card,
    !cardType && !previewMode,
  );

  const isContentCard =
    cardType === CardType.KNOWLEDGE_CARD ||
    cardType === CardType.LESSON_CARD ||
    cardType === CardType.QUIZ_CARD;
  return (
    <div
      className={classNames({
        'card-container__wrapper': true,
        'card-container__wrapper__preview-mode': previewMode,
      })}>
      <div
        onClick={() => {
          !editable && setSelfAsSelectedCard();
        }}
        data-testid={`card-${card?.id}`}
        className={classNames({
          'card-container__card-component': true,
          'card-container__not-editable':
            !editable && !cardType && !previewMode,
          'card-container__preview-mode': previewMode,
        })}>
        <div
          className={classNames({
            'card-container__gradient': true,
            'card-container__gradient__show': !isAtBottom,
            'card-container__gradient__hide': isAtBottom,
          })}></div>
        <div
          ref={observedElement}
          className={classNames({
            'card-container__not-editable':
              !editable && !cardType && !previewMode,
            'card-container__content-blocks': true,
          })}>
          {contentBlocks}
          {contentBlocks.length === 0 && editable && (
            <BlankCardMessage key={'blank-card'} />
          )}
          {cardType === CardType.END_CARD && (
            <NextItemScreen onFinish={onFinish} />
          )}
          <div
            ref={scrollableElement}
            className='card-container__content-spacer'></div>
        </div>
        {!isCompletionUIHidden && cardType !== CardType.END_CARD && (
          <div className='card-container__card-buttons'>
            {isContentCard && <LessonBackButton onClick={onPrev} />}
            <Button
              disabled={!isCardComplete}
              htmlType='button'
              size='large'
              type={!isCardComplete ? 'text' : 'default'}
              data-testid='lesson-next-button'
              classes={classNames({
                'card-container__start-button': !isContentCard,
                'card-container__disable-button': !isCardComplete,
              })}
              onClick={onFinish}>
              {continueMessage}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthoringCard;
