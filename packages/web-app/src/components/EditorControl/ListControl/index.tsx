import React from 'react';
import { Button } from 'antd';
import Icon from '@ant-design/icons';
import { ReactComponent as NumberedListIcon } from '@/assets/numberedListIcon.svg';
import { ReactComponent as NumberedListSelectedIcon } from '@/assets/numberedListSelectedIcon.svg';
import { ReactComponent as BulletedListIcon } from '@/assets/bulletedListIcon.svg';
import { ReactComponent as BulletedListSelectedIcon } from '@/assets/bulletedListSelectedIcon.svg';

import { commonProps } from '../utils';

interface ListControlProps {
  hasNumberedList?: boolean;
  toggleNumberedList?: () => void;
  hasBulletedList?: boolean;
  toggleBulletedList?: () => void;
}

function ListControl(props: ListControlProps) {
  return (
    <div className='format-button-group'>
      <Button
        {...commonProps}
        data-testid='list-control-numbered-list-button'
        type='text'
        onClick={() => props.toggleNumberedList?.()}
        icon={
          <Icon
            className='custom-icon'
            component={
              props.hasNumberedList
                ? NumberedListSelectedIcon
                : NumberedListIcon
            }
          />
        }></Button>
      <Button
        {...commonProps}
        data-testid='list-control-bulleted-list-button'
        type='text'
        onClick={() => props.toggleBulletedList?.()}
        icon={
          <Icon
            className='custom-icon'
            component={
              props.hasBulletedList
                ? BulletedListSelectedIcon
                : BulletedListIcon
            }
          />
        }></Button>
    </div>
  );
}

export default ListControl;
