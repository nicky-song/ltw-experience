import { Typography } from 'antd';
import classNames from 'classnames';
import { MouseEventHandler, ReactNode } from 'react';
import './styles.scss';
interface TextProps {
  code?: boolean;
  delete?: boolean;
  disabled?: boolean;
  mark?: boolean;
  onClick?: MouseEventHandler<HTMLElement>;
  italic?: boolean;
  type?: 'secondary' | 'success' | 'warning' | 'danger';
  underline?: boolean;
  strong?: boolean;
  children?: ReactNode;
  classes?: string;
}
function Text(props: TextProps) {
  const { classes } = props;
  return (
    <Typography.Text
      className={classNames('typography-text', classes)}
      {...props}></Typography.Text>
  );
}

export default Text;
