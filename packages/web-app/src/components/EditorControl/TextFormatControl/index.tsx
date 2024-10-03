import React from 'react';
import { Button } from 'antd';
import {
  BoldOutlined,
  ItalicOutlined,
  UnderlineOutlined,
  StrikethroughOutlined,
} from '@ant-design/icons';
import { commonProps } from '../utils';

interface TextFormatControlProps {
  isItalic?: boolean;
  isItalicChange?: () => void;
  isStrong?: boolean;
  isStrongChange?: () => void;
  isUnderlined?: boolean;
  isUnderlinedChange?: () => void;
  isStrikethrough?: boolean;
  isStrikethroughChanged?: () => void;
}

function TextFormatControl(props: TextFormatControlProps) {
  return (
    <div className='format-button-group'>
      <Button
        {...commonProps}
        data-testid='text-format-control-strong-button'
        type={props.isStrong ? 'primary' : 'text'}
        onClick={(e) => {
          e.preventDefault();
          props.isStrongChange?.();
        }}
        icon={<BoldOutlined />}></Button>
      <Button
        {...commonProps}
        data-testid='text-format-control-italic-button'
        type={props.isItalic ? 'primary' : 'text'}
        onClick={() => props.isItalicChange?.()}
        icon={<ItalicOutlined />}></Button>
      <Button
        {...commonProps}
        data-testid='text-format-control-underline-button'
        type={props.isUnderlined ? 'primary' : 'text'}
        onClick={() => props.isUnderlinedChange?.()}
        icon={<UnderlineOutlined />}></Button>
      <Button
        {...commonProps}
        type={props.isStrikethrough ? 'primary' : 'text'}
        data-testid='text-format-control-strikethrough-button'
        onClick={() => props.isStrikethroughChanged?.()}
        icon={<StrikethroughOutlined />}></Button>
    </div>
  );
}

export default TextFormatControl;
