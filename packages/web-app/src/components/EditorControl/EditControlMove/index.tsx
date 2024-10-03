import { Button } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

interface EditControlMoveProps {
  text: string;
  enableMoveControls?: boolean;
  enableMoveUp?: boolean;
  enableMoveDown?: boolean;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}

const EditControlMove: React.FC<EditControlMoveProps> = (
  props: EditControlMoveProps,
) => {
  const { enableMoveUp = true, enableMoveDown = true } = props;

  return (
    <div
      className='edit-control-move-content'
      style={{ display: 'flex', justifyContent: 'space-between' }}>
      <span className='edit-control-move-text'>{props.text}</span>
      {props.enableMoveControls && (
        <span className='edit-control-move-button-group'>
          <Button
            size='small'
            type='default'
            disabled={!enableMoveUp}
            onClick={props.onMoveUp}
            icon={<ArrowUpOutlined />}></Button>
          <Button
            style={{ marginLeft: '8px' }}
            size='small'
            type='default'
            disabled={!enableMoveDown}
            onClick={props.onMoveDown}
            icon={<ArrowDownOutlined />}></Button>
        </span>
      )}
    </div>
  );
};

export default EditControlMove;
