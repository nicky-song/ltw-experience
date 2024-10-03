import classNames from 'classnames';
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import Button from '@components/Button';
import { useAppSelector } from '@hooks/reduxHooks';
import { CardType } from '@learn-to-win/common/constants';
import './CardSwapper.scss';

export const CardSwapper: React.FC<{
  updateCardSequence: (step: number) => void;
}> = ({ updateCardSequence }) => {
  const { selectedCardId, cards } = useAppSelector((state) => state.card);
  const selectedCardIndex = cards.findIndex(
    (card) => card.id === selectedCardId,
  );
  const selectedCard = cards[selectedCardIndex];
  const isTitleCard =
    selectedCard?.type === CardType.TITLE_CARD || selectedCardIndex === 0;
  const isEndCard =
    selectedCard?.type === CardType.END_CARD ||
    selectedCardIndex === cards.length - 1;

  // Disable left swap if the selected card is the end card or the first content card
  const isLeftSwapDisabled = isEndCard || selectedCardIndex === 1;
  // Disable right swap if the selected card is the title card or the last content card
  const isRightSwapDisabled =
    isTitleCard || selectedCardIndex === cards.length - 2;

  if (cards.length === 2) return null;

  return (
    <div className={'card-swapper-container'}>
      <Tooltip title='Move Card Left'>
        <Button
          type='ghost'
          htmlType='button'
          icon={<ArrowLeftOutlined />}
          size={'large'}
          disabled={isLeftSwapDisabled}
          classes={classNames({
            'card-swapper-container__button--hidden': isTitleCard,
          })}
          onClick={() => updateCardSequence(-1)}
          aria-label='Move Card Left'
        />
      </Tooltip>
      <Tooltip title='Move Card Right'>
        <Button
          type='ghost'
          htmlType='button'
          icon={<ArrowRightOutlined />}
          size={'large'}
          disabled={isRightSwapDisabled}
          classes={classNames({
            'card-swapper-container__button--hidden': isEndCard,
          })}
          onClick={() => updateCardSequence(1)}
          aria-label='Move Card Right'
        />
      </Tooltip>
    </div>
  );
};
