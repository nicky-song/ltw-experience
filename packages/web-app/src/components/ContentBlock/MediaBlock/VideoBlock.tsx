import { PlayCircleOutlined } from '@ant-design/icons';
import Spinner from '@components/Spinner';
import Text from '@components/Typography/Text';
import './index.scss';
import {
  Card,
  VideoBlockType,
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

interface VideoBlockProps {
  id: string;
  card: Card;
  showEditor: boolean;
}

const VideoBlock: React.FC<VideoBlockProps> = ({
  id,
  card,
  showEditor,
}: VideoBlockProps) => {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { addMediaUrl, removeMediaUrl } = useMediaActions(card, id, 'video');
  const { setMediaAsViewed } = useCardCompletionForMedia(id);
  const { selectedCardId } = useAppSelector((state) => state.card);
  const editable = card.id === selectedCardId && showEditor;
  const videoBlock = card.json?.contentBlocks.find(
    (block) => block.id === id,
  ) as VideoBlockType;

  const { mediaURL: videoUrl, isLoading: loadingMedia } =
    useMediaURL(videoBlock);

  const toggleDrawer = useCallback((shouldOpen: boolean) => {
    setDrawerOpen(shouldOpen);
  }, []);

  const editVideoBlock = () => {
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
          // Prevents popover from being opened in unselected card
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
            type={'Video'}
            editMedia={editVideoBlock}
            url={videoBlock.url}
            enableMoveControls={
              ![CardType.KNOWLEDGE_CARD, CardType.QUIZ_CARD].includes(card.type)
            }
          />
        }>
        <div
          data-testid='video-block-container'
          className={classNames({
            'media-block': true,
            'media-block__editable': editable,
            'media-block__pointer': editable,
          })}>
          <div className={'media-block__media'}>
            {!!videoBlock.url && !loadingMedia && (
              <>
                {!popoverOpen && showEditor && (
                  <div className='media-block__media-disabled'></div>
                )}
                <Video
                  data-testid={'video-content-block'}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className={'media-block__video'}
                  controls
                  src={videoUrl}
                  onVideoComplete={setMediaAsViewed}
                />
              </>
            )}
            {!videoBlock.url && !loadingMedia && editable ? (
              <div className='media-block__add-media-wrapper'>
                <div
                  className={classNames({
                    'media-block__disable-dashed': popoverOpen,
                    'media-block__disable-hover': true,
                    'media-block__add-media': true,
                  })}>
                  <PlayCircleOutlined /> <Text>Video</Text>
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
        media={videoBlock}
        type={'video'}
        mediaUrl={videoUrl}
      />
    </>
  );
};

function Video({
  src,
  onVideoComplete,
  ...rest
}: { src?: string; onVideoComplete?: () => void } & React.DetailedHTMLProps<
  React.VideoHTMLAttributes<HTMLVideoElement>,
  HTMLVideoElement
>) {
  const onEnded = useCallback(() => {
    // TODO: use more advanced completion detection.
    // https://stackoverflow.com/questions/37293834/how-to-check-a-user-watched-the-full-video-in-html5-video-player

    onVideoComplete?.();
  }, [onVideoComplete]);
  return (
    <video {...rest} onEnded={onEnded}>
      <source src={src} />
    </video>
  );
}

export default VideoBlock;
