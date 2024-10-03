import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { Drawer, Menu, MenuProps, Input, Tag, Form } from 'antd';
import CustomButton from '@components/Button';
import './index.scss';
import UploadMedia from '@components/UploadMedia';
import Text from '@components/Typography/Text';
import { ReactNode, useState } from 'react';
import { useDebouncedCallback } from '@hooks/useDebouncedCallback';

interface PageOverviewDrawer {
  defaultSelectedKeys: string[];
  menuItems: MenuProps['items'];
  onClose: () => void;
  isDrawerOpen: boolean;
  itemData: { id: string; title: string; description: string };
  // Params will change depending on if learning item/ course
  onFormSubmit: (params: {
    title: string | null;
    description: string | null;
    organizationId: string;
  }) => void;
}
const PageOverviewDrawer = ({
  defaultSelectedKeys,
  menuItems,
  onClose,
  isDrawerOpen,
  itemData,
  onFormSubmit,
}: PageOverviewDrawer) => {
  const [title, setTitle] = useState(itemData?.title);
  const [description, setDescription] = useState(itemData?.description);
  const debouncedSubmit = useDebouncedCallback(onFormSubmit);

  const updateTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    const descriptionInput = description ? description : null;
    const titleInput = e?.target?.value ? e.target.value : null;
    debouncedSubmit({
      title: titleInput,
      description: descriptionInput,
      organizationId: '1edd401b-4f47-6b0c-af14-f7a89e373a72',
    });
  };

  const updateDescription = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
    const descriptionInput = e?.target?.value ? e.target.value : null;
    const titleInput = title ? title : null;
    debouncedSubmit({
      title: titleInput,
      description: descriptionInput,
      organizationId: '1edd401b-4f47-6b0c-af14-f7a89e373a72',
    });
  };

  const updateS3Url = () => {
    // To do: course needs a image url on backend
    return null;
  };

  const removeS3Url = () => {
    // To do: course needs a image url on backend
    return null;
  };

  return (
    <div className='page-overview-drawer'>
      <Drawer
        open={isDrawerOpen}
        width={440}
        onClose={onClose}
        closeIcon={
          <CustomButton
            htmlType='button'
            size='large'
            type='ghost'
            icon={<CloseOutlined />}
          />
        }
        title={
          <Menu
            items={menuItems}
            mode={'horizontal'}
            className='page-overview-drawer__menu'
            defaultSelectedKeys={defaultSelectedKeys}></Menu>
        }>
        <Form>
          <DrawerSection>
            {/*to do: Implement course image on backend */}
            <UploadMedia
              updateS3Url={updateS3Url}
              mediaName={''}
              mediaUrl={''}
              removeS3Url={removeS3Url}
              contentType={'image'}
            />
          </DrawerSection>
          <DrawerSection title={'Title'}>
            <Input
              title='Title'
              data-testid={'page-overview-drawer-title'}
              defaultValue={title}
              className={'page-overview-drawer__input'}
              value={title}
              onChange={updateTitle}
              placeholder='Course title'
            />
          </DrawerSection>
          <DrawerSection title={'Description'}>
            <Input.TextArea
              title='Description'
              data-testid={'page-overview-drawer-desc'}
              defaultValue={description}
              className={'page-overview-drawer__input'}
              placeholder='Course description'
              onChange={updateDescription}
              value={description}
              autoSize={{ minRows: 8 }}
            />
          </DrawerSection>
          <DrawerSection title={'Tags'}>
            {/*to do: implement tags on the backend and here*/}
            <Tag bordered className='page-overview-drawer__new-tag'>
              <div>
                <PlusOutlined /> New Tag
              </div>
            </Tag>
          </DrawerSection>
        </Form>
      </Drawer>
    </div>
  );
};

interface DrawerSectionProps {
  children: ReactNode;
  title?: string;
  initialValue?: string;
  inputRules?: { required: boolean; message: string }[];
}
const DrawerSection = ({
  children,
  title,
  initialValue,
  inputRules,
}: DrawerSectionProps) => {
  return (
    <>
      {!!title && (
        <div className={'page-overview-drawer__input-label'}>
          <Text>{title}</Text>
        </div>
      )}
      <Form.Item initialValue={initialValue} name={title} rules={inputRules}>
        {children}
      </Form.Item>
    </>
  );
};

export default PageOverviewDrawer;
