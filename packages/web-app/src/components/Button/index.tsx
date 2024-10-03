import { Button as AntdButton } from 'antd';
import { ReactNode, MouseEventHandler } from 'react';
import classNames from 'classnames';
import './styles.scss';
interface ButtonProps {
  disabled?: boolean;
  href?: string;
  danger?: boolean;
  ghost?: boolean;
  htmlType: 'button' | 'submit' | 'reset' | undefined;
  icon?: ReactNode;
  loading?: boolean | { delay: number };
  shape?: 'default' | 'circle' | 'round';
  size: 'large' | 'middle' | 'small';
  target?: string;
  type:
    | 'default'
    | 'link'
    | 'text'
    | 'ghost'
    | 'primary'
    | 'dashed'
    | undefined;
  onClick?: MouseEventHandler<HTMLAnchorElement> &
    MouseEventHandler<HTMLButtonElement>;
  children?: ReactNode;
  classes?: string;
}
function Button(props: ButtonProps) {
  const { classes = '', disabled = false } = props;
  return (
    <AntdButton
      data-testid={'form-button'}
      id='form-button'
      {...props}
      className={classNames(
        {
          'form-button-background': !disabled,
          'disabled-btn': disabled,
        },
        'form-button',
        classes,
      )}
    />
  );
}

export default Button;
