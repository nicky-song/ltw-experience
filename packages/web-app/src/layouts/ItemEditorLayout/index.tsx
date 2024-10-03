import { Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import './index.scss';
import Title from '@components/Typography/Title';
import Text from '@components/Typography/Text';
import { useQuery } from 'react-query';
import { getLearningItem } from '@learn-to-win/common/features/LearningItems/learningItemService';
import { getIdFromUrl } from '@learn-to-win/common/utils/entityId';
import { toProperCase } from '@learn-to-win/common/utils/getLearningItemTypeProperCase';

interface ItemEditorLayoutProps {
  learningItemType: string;
  learningItemId?: string;
  children: ReactNode;
}
const ItemEditorLayout: React.FC<ItemEditorLayoutProps> = ({
  learningItemType,
  learningItemId,
  children,
}: ItemEditorLayoutProps) => {
  const { data: courseId } = useQuery(
    ['getLearningItem', learningItemId],
    async () => {
      if (!learningItemId) {
        return;
      }
      const { data } = await getLearningItem({ learningItemId });

      return getIdFromUrl(data.course);
    },
  );
  return (
    <div className={'item-editor-page'}>
      <nav className={'item-editor-page__nav'}>
        <div className={'item-editor-page__back-container'}>
          <Link to={`/admin/courses/${courseId}/details`}>
            <Button
              shape={'default'}
              size='middle'
              htmlType='button'
              disabled={false}
              icon={<ArrowLeftOutlined />}
            />
          </Link>
          {!!learningItemType && (
            <Title
              classes={'header-container__text'}
              level={5}
              data-testid='edit-lesson'>
              {`Editing ${
                learningItemType?.length ? toProperCase(learningItemType) : ''
              }`}
            </Title>
          )}
        </div>
        <Button
          className={'item-editor-page__menu-btn'}
          size='middle'
          htmlType='button'
          shape={'default'}
          disabled={false}
          icon={<Text classes={'item-editor-page__menu-icon'}>...</Text>}
        />
      </nav>
      {children}
    </div>
  );
};

export default ItemEditorLayout;
