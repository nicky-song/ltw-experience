import {
  CheckCircleOutlined,
  DeleteOutlined,
  SwapOutlined,
} from '@ant-design/icons';
import EditControlMove from '@components/EditorControl/EditControlMove';
import { Card } from '@learn-to-win/common/features/Cards/cardTypes';
import { Button, Divider } from 'antd';
import { useEditContentBlockControls } from '@components/ContentBlock/contentBlockHooks';

interface MediaPopoverProps {
  url?: string;
  card: Card;
  blockId: string;
  type: string;
  editMedia: () => void;
  enableMoveControls?: boolean;
}
const MediaPopover = ({
  url,
  card,
  blockId,
  type,
  editMedia,
  enableMoveControls = true,
}: MediaPopoverProps) => {
  const { moveContentDown, moveContentUp, deleteContent } =
    useEditContentBlockControls(blockId, card);

  return (
    <div
      className='edit-control-content'
      // Prevents the interactions from the tooltip to de-select text and close tooltip
      onMouseDown={(e) => e.preventDefault()}>
      <div className='edit-control-menu-item'>
        <EditControlMove
          text={type}
          onMoveUp={moveContentUp}
          onMoveDown={moveContentDown}
          enableMoveControls={enableMoveControls}
        />
      </div>
      <Divider className='edit-control-divider' />
      <Button
        data-testid={`choose-media-btn-${card.id}`}
        className='content-block__popup-button-mid'
        onClick={editMedia}
        type='text'
        icon={url ? <SwapOutlined /> : <CheckCircleOutlined />}>
        {url ? 'Change' : 'Choose'} {type}
      </Button>
      <Divider className='edit-control-divider' />
      <Button
        className='content-block__popup-button'
        onClick={deleteContent}
        type='text'
        icon={<DeleteOutlined />}
        danger>
        Delete
      </Button>
    </div>
  );
};

export default MediaPopover;
