import React, { useCallback, useState } from 'react';
import './index.scss';
import {
  Card,
  ImageBlockType,
} from '@learn-to-win/common/features/Cards/cardTypes';
import { useAppSelector } from '@hooks/reduxHooks';
import { Button, Popover } from 'antd';
import classNames from 'classnames';
import {
  ExpandOutlined,
  FullscreenExitOutlined,
  PictureOutlined,
} from '@ant-design/icons';
import MediaDrawer from './MediaDrawer';
import { useMediaActions } from '@components/ContentBlock/contentBlockHooks';
import Text from '@components/Typography/Text';
import Spinner from '@components/Spinner';
import MediaPopover from './MediaPopover';
import { toProperCase } from '@learn-to-win/common/utils/getLearningItemTypeProperCase';
import { useAppSelector as useSelector } from '../../../hooks/reduxHooks';
import { CardType } from '@learn-to-win/common/constants';
import { useMediaURL } from '@learn-to-win/common/utils/useMediaURL';

interface ImageBlockProps {
  id: string;
  card: Card;
  showEditor: boolean;
}

const ImageBlock: React.FC<ImageBlockProps> = ({
  id,
  card,
  showEditor,
}: ImageBlockProps) => {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { selectedCardId } = useAppSelector((state) => state.card);
  const editable = card.id === selectedCardId && showEditor;
  const imageBlock = card.json?.contentBlocks.find(
    (block) => block.id === id,
  ) as ImageBlockType;

  const { addMediaUrl, removeMediaUrl } = useMediaActions(card, id, 'image');

  const { mediaURL: mediaUrl, isLoading: loadingMedia } =
    useMediaURL(imageBlock);

  const { learningItemList } = useSelector((state) => state.learningItem);
  const learningItem = learningItemList.find(
    (item) => item.id === card.learningItemId,
  );

  const learningItemTypeProperCase =
    card.type === CardType.TITLE_CARD
      ? toProperCase(learningItem?.type as string)
      : '';

  const toggleDrawer = useCallback((shouldOpen: boolean) => {
    setDrawerOpen(shouldOpen);
  }, []);

  const editImageBlock = () => {
    setPopoverOpen(false);
    toggleDrawer(true);
  };

  return (
    <>
      <Popover
        open={popoverOpen && !fullScreen}
        placement='rightTop'
        arrow={false}
        trigger='click'
        onOpenChange={(open) => {
          // Prevents popover from being opened in unselected card
          if (showEditor && editable && !fullScreen) {
            setPopoverOpen(open);
          } else {
            setPopoverOpen(false);
          }
        }}
        content={
          <MediaPopover
            card={card}
            blockId={id}
            type={'Image'}
            editMedia={editImageBlock}
            url={imageBlock.url}
            enableMoveControls={
              ![CardType.KNOWLEDGE_CARD, CardType.QUIZ_CARD].includes(card.type)
            }
          />
        }>
        <div
          data-testid={'media-block-wrapper'}
          className={classNames({
            'media-block': true,
            'media-block__editable': editable,
            'media-block__pointer': editable,
          })}>
          <div className={'media-block__media'}>
            {!!imageBlock.url && !loadingMedia && (
              <div
                className={classNames({
                  'media-block__image-expand-wrapper': fullScreen,
                  'media-block__image-collapse-wrapper': !fullScreen,
                })}>
                <img
                  data-testid={'media-block-image'}
                  className={classNames({
                    'media-block__image-fullscreen': fullScreen,
                    'media-block__image': !fullScreen,
                  })}
                  src={mediaUrl}
                  alt={imageBlock.name}
                  tabIndex={-1}
                  onLoad={async () => setImageLoaded(true)}
                />
                {imageLoaded && (
                  <div
                    className={classNames({
                      'media-block__image-expand-overlay': fullScreen,
                      'media-block__image-collapse-overlay': !fullScreen,
                    })}>
                    <Button
                      data-testid={'media-block-icon-button'}
                      className={classNames({
                        'media-block__fullscreen-collapse-button': fullScreen,
                        'media-block__fullscreen-expand-button': !fullScreen,
                      })}
                      type='ghost'
                      onClick={() => setFullScreen(!fullScreen)}
                      icon={
                        fullScreen ? (
                          <FullscreenExitOutlined
                            className={'media-block__image-icon'}
                          />
                        ) : (
                          <ExpandOutlined
                            className={'media-block__image-icon'}
                          />
                        )
                      }
                    />
                  </div>
                )}
              </div>
            )}
            {!imageBlock.url && !loadingMedia && showEditor ? (
              <div className='media-block__add-media-wrapper'>
                <div
                  className={classNames({
                    'media-block__add-media': true,
                    'media-block__disable-hover': true,
                    'media-block__disable-dashed': popoverOpen,
                  })}>
                  <PictureOutlined />{' '}
                  <Text> {learningItemTypeProperCase} Image</Text>
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
        media={imageBlock}
        type={'image'}
        mediaUrl={mediaUrl}
      />
    </>
  );
};

export default ImageBlock;
