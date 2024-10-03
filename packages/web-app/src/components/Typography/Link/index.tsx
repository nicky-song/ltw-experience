import { Typography } from 'antd';
import classNames from 'classnames';
import { ReactNode, MouseEventHandler } from 'react';
import './styles.scss';

interface LinkProps {
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
  href: string;
  classes?: string;
}
function Link(props: LinkProps) {
  const { classes = '' } = props;

  return (
    <Typography.Link
      className={classNames('typography-link', classes)}
      {...props}
    />
  );
}

export default Link;
