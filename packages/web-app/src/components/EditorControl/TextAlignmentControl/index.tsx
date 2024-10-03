import { Button } from 'antd';
import {
  AlignLeftOutlined,
  MenuOutlined,
  AlignCenterOutlined,
  AlignRightOutlined,
} from '@ant-design/icons';
import { commonProps } from '../utils';

interface TextAlignmentControlProps {
  isLeftAligned?: boolean;
  isLeftAlignedChange?: (isLeftAligned: boolean) => void;
  isFullJustified?: boolean;
  isFullJustifiedChange?: (isFullJustified: boolean) => void;
  isCenterJustified?: boolean;
  isCenterJustifiedChange?: (isCenterJustified: boolean) => void;
  isRightAligned?: boolean;
  isRightAlignedChange?: (isRightAligned: boolean) => void;
}

function TextAlignmentControl(props: TextAlignmentControlProps) {
  return (
    <div className='format-button-group'>
      <Button
        {...commonProps}
        data-testid='text-alignment-control-left-align-button'
        type={props.isLeftAligned ? 'primary' : 'text'}
        onClick={() =>
          props.isLeftAlignedChange &&
          props.isLeftAlignedChange(!props.isLeftAligned)
        }
        icon={<AlignLeftOutlined />}></Button>
      <Button
        {...commonProps}
        data-testid='text-alignment-control-full-justified-button'
        type={props.isFullJustified ? 'primary' : 'text'}
        onClick={() =>
          props.isFullJustifiedChange &&
          props.isFullJustifiedChange(!props.isFullJustified)
        }
        icon={<MenuOutlined />}></Button>
      <Button
        {...commonProps}
        data-testid='text-alignment-control-center-justified-button'
        type={props.isCenterJustified ? 'primary' : 'text'}
        onClick={() =>
          props.isCenterJustifiedChange &&
          props.isCenterJustifiedChange(!props.isCenterJustified)
        }
        icon={<AlignCenterOutlined />}></Button>
      <Button
        {...commonProps}
        data-testid='text-alignment-control-right-align-button'
        type={props.isRightAligned ? 'primary' : 'text'}
        onClick={() =>
          props.isRightAlignedChange &&
          props.isRightAlignedChange(!props.isRightAligned)
        }
        icon={<AlignRightOutlined />}></Button>
    </div>
  );
}

export default TextAlignmentControl;
