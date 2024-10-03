import Button from '@components/Button';

import { ArrowLeftOutlined } from '@ant-design/icons';

export function LessonBackButton({
  onClick,
}: {
  onClick: (() => void) | undefined;
}) {
  return (
    <Button
      htmlType='button'
      shape='circle'
      size='large'
      type='primary'
      data-testid='lesson-prev-button'
      onClick={onClick}
      icon={<ArrowLeftOutlined />}
    />
  );
}
