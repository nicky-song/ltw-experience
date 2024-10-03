import { SoundOutlined } from '@ant-design/icons';
import Spinner from '@components/Spinner';
import Text from '@components/Typography/Text';
import './index.scss';
import {
  AudioBlockType,
  Card,
} from '@learn-to-win/common/features/Cards/cardTypes';
import { Popover } from 'antd';
import { useCallback, useState } from 'react';
import { useMediaActions } from '@components/ContentBlock/contentBlockHooks';
import classNames from 'classnames';
import { useAppSelector } from '@hooks/reduxHooks';
import MediaDrawer from './MediaDrawer';
import MediaPopover from './MediaPopover';
import { useCardCompletionForMedia } from '@learn-to-win/common/hooks/CardCompletionCheck';
import { useMediaURL } from '@learn-to-win/common/utils/useMediaURL';
import { CardType } from '@learn-to-win/common/constants';

interface AudioBlockProps {
  id: string;
  card: Card;
  showEditor: boolean;
}

const AudioBlock: React.FC<AudioBlockProps> = ({
  id,
  card,
  showEditor,
}: AudioBlockProps) => {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { addMediaUrl, removeMediaUrl } = useMediaActions(card, id, 'audio');
  const { setMediaAsViewed } = useCardCompletionForMedia(id);
  const { selectedCardId } = useAppSelector((state) => state.card);
  const editable = card.id === selectedCardId && showEditor;
  const audioBlock = card.json?.contentBlocks.find(
    (block) => block.id === id,
  ) as AudioBlockType;

  const { mediaURL: audioUrl, isLoading: loadingMedia } =
    useMediaURL(audioBlock);

  const toggleDrawer = useCallback((shouldOpen: boolean) => {
    setDrawerOpen(shouldOpen);
  }, []);

  const editAudioBlock = () => {
    setPopoverOpen(false);
    toggleDrawer(true);
  };

  return (
    <>
      <Popover
        open={popoverOpen}
        placement='rightTop'
        arrow={false}
        trigger='click'
        onOpenChange={(open) => {
          if (showEditor && editable) {
            setPopoverOpen(open);
          } else {
            setPopoverOpen(false);
          }
        }}
        content={
          <MediaPopover
            card={card}
            blockId={id}
            type={'Audio'}
            editMedia={editAudioBlock}
            url={audioBlock.url}
            enableMoveControls={
              ![CardType.KNOWLEDGE_CARD, CardType.QUIZ_CARD].includes(card.type)
            }
          />
        }>
        <div
          tabIndex={-1}
          className={classNames({
            'media-block': true,
            'media-block__editable': editable,
            'media-block__pointer': editable,
          })}>
          <div
            className={'media-block__media'}
            data-testid={'audio-content-block'}>
            {!!audioBlock.url && !loadingMedia && (
              <div className='media-block__controls-background'>
                {!popoverOpen && showEditor && (
                  <div className='media-block__controls-shroud'></div>
                )}
                <audio
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  data-testid={'media-block-tag'}
                  className={'media-block__audio'}
                  onEnded={setMediaAsViewed}
                  controls>
                  <source src={audioUrl} />
                </audio>
              </div>
            )}
            {!audioBlock.url && !loadingMedia && editable ? (
              <div className='media-block__add-audio-wrapper'>
                <div
                  className={classNames({
                    'media-block__disable-dashed': popoverOpen,
                    'media-block__disable-hover': true,
                    'media-block__add-audio': true,
                  })}>
                  <SoundOutlined /> <Text>Add Audio</Text>
                </div>
              </div>
            ) : (
              <Spinner spinning={loadingMedia} />
            )}
          </div>
        </div>
      </Popover>
      <MediaDrawer
        toggleDrawer={toggleDrawer}
        open={drawerOpen}
        removeMediaUrl={removeMediaUrl}
        addMediaUrl={addMediaUrl}
        media={audioBlock}
        type={'audio'}
        mediaUrl={audioUrl}
      />
    </>
  );
};

export default AudioBlock;
