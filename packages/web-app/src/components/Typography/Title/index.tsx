import { Typography } from 'antd';
import { MouseEvent, ReactNode } from 'react';
import classNames from 'classnames';

interface TitleProps {
  code?: boolean;
  delete?: boolean;
  disabled?: boolean;
  level: 1 | 2 | 3 | 4 | 5;
  mark?: boolean;
  onClick?: (event: MouseEvent) => void;
  italic?: boolean;
  type?: 'secondary' | 'success' | 'warning' | 'danger';
  underline?: boolean;
  children?: ReactNode;
  classes?: string;
}
function Title(props: TitleProps) {
  const { classes = '' } = props;
  return (
    <Typography.Title
      className={classNames('typography-title', classes)}
      {...props}
    />
  );
}

export default Title;
