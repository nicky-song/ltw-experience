import React, { MouseEvent, useMemo } from 'react';
import './index.scss';
import { PlusOutlined } from '@ant-design/icons';
import Button from '@components/Button';
import { Divider, Menu } from 'antd';
import { MenuItem } from './types';

interface PageLayoutProps {
  children?: React.ReactNode;
}
const PageLayout = ({ children }: PageLayoutProps) => {
  return <div className='page-layout'>{children}</div>;
};

interface PageLayoutSideBarProps {
  items: MenuItem[];
  onCreate: (e: MouseEvent) => void;
}
PageLayout.SideBar = function PageOverviewSideBar({
  items,
  onCreate,
}: PageLayoutSideBarProps) {
  const defaultKey = useMemo(
    () => (items?.length ? (items[0]?.key as string) : ''),
    [items],
  );
  return (
    <div className='page-layout__side-bar'>
      <Button
        htmlType='button'
        onClick={onCreate}
        size={'large'}
        type={'primary'}
        icon={<PlusOutlined />}>
        {'Create New'}
      </Button>
      <Divider />
      {defaultKey && (
        <Menu
          items={items}
          mode={'vertical'}
          defaultSelectedKeys={[defaultKey]}
        />
      )}
    </div>
  );
};

PageLayout.FlexContainer = function PageOverviewFlexContainer({
  children,
}: PageLayoutProps) {
  return <div className='page-layout__details'>{children}</div>;
};

export default PageLayout;
