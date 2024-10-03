import React from 'react';
import { Button } from 'antd';
import Icon from '@ant-design/icons';
import { ReactComponent as FontSizeLargeIcon } from '@/assets/fontSizeLargeIcon.svg';
import { ReactComponent as FontSizeLargeSelectedIcon } from '@/assets/fontSizeLargeSelectedIcon.svg';
import { ReactComponent as FontSizeMediumIcon } from '@/assets/fontSizeMediumIcon.svg';
import { ReactComponent as FontSizeMediumSelectedIcon } from '@/assets/fontSizeMediumSelected.svg';
import { ReactComponent as FontSizeSmallIcon } from '@/assets/fontSizeSmallIcon.svg';
import { ReactComponent as FontSizeSmallSelectedIcon } from '@/assets/fontSizeSmallSelectedIcon.svg';
import { commonProps } from '../utils';

interface TextSizeControlProps {
  isTextLarge?: boolean;
  toggleIsTextLarge?: (isTextLarge: boolean) => void;
  isTextMedium?: boolean;
  toggleIsTextMedium?: (isTextMedium: boolean) => void;
  isTextSmall?: boolean;
  toggleIsTextSmall?: (isTextSmall: boolean) => void;
}

const TextSizeControl: React.FC<TextSizeControlProps> = (
  props: TextSizeControlProps,
) => {
  return (
    <div className='format-button-group'>
      <Button
        {...commonProps}
        data-testid='text-size-control-large-button'
        type={props.isTextLarge ? 'primary' : 'text'}
        onClick={(e) => {
          e.preventDefault();
          props.toggleIsTextLarge?.(!props.isTextLarge);
        }}
        icon={
          <Icon
            className='custom-icon'
            component={
              props.isTextLarge ? FontSizeLargeSelectedIcon : FontSizeLargeIcon
            }
          />
        }></Button>
      <Button
        {...commonProps}
        data-testid='text-size-control-medium-button'
        type={props.isTextMedium ? 'primary' : 'text'}
        onClick={(e) => {
          e.preventDefault();
          props.toggleIsTextMedium?.(!props.isTextMedium);
        }}
        icon={
          <Icon
            className='custom-icon'
            component={
              props.isTextMedium
                ? FontSizeMediumSelectedIcon
                : FontSizeMediumIcon
            }
          />
        }></Button>
      <Button
        {...commonProps}
        data-testid='text-size-control-small-button'
        type={props.isTextSmall ? 'primary' : 'text'}
        onClick={(e) => {
          e.preventDefault();
          props.toggleIsTextSmall?.(!props.isTextSmall);
        }}
        icon={
          <Icon
            className='custom-icon'
            component={
              props.isTextSmall ? FontSizeSmallSelectedIcon : FontSizeSmallIcon
            }
          />
        }></Button>
    </div>
  );
};

export default TextSizeControl;
