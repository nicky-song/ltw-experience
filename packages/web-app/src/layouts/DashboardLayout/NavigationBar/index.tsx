import React, { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Avatar, Button, Menu, Dropdown, Space } from 'antd';
import type { MenuProps } from 'antd';
import { MenuItemType } from 'antd/es/menu/hooks/useItems';
import { roles } from './constants';

import './index.scss';
import NavigationBarWrapper from '@components/NavigationBarWrapper/NavigationBarWrapper';

const items: MenuProps['items'] = roles;

const NavigationBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const currentRole = useMemo(() => {
    return roles.find(
      (role) =>
        location.pathname.substring(1, 1 + role?.pathprefix.length) ===
        role?.pathprefix,
    )?.key as string;
  }, [location]);

  const currentTab = useMemo(() => {
    return roles
      .find((role) => role?.key === currentRole)
      ?.tabs.find((tab) => location.pathname.includes(tab?.path))
      ?.key as string;
  }, [currentRole, location.pathname]);

  const handleNavigate = (roleKey: string, tabKey: string) => {
    navigate(
      roles
        .find((role) => role?.key === roleKey)
        ?.tabs.find((tab) => tab?.key === tabKey)?.path as string,
    );
  };

  return (
    <NavigationBarWrapper>
      <div className='navBarObject leftDropdownContainer'>
        <Dropdown
          menu={{
            items,
            selectable: true,
            onClick: (e) => handleNavigate(e.key, '0'),
          }}>
          <Space>
            <Button
              type='primary'
              className='navBarButton'
              data-testid={'roleDropdown'}>
              {roles.find((role) => role?.key === currentRole)?.abbreviation}
            </Button>
          </Space>
        </Dropdown>
      </div>
      <div className='navBarObject middleButtonsContainer'>
        <Menu
          className='middleButtonsMenu'
          onClick={(e) => handleNavigate(currentRole, e.key)}
          selectedKeys={[currentTab]}
          mode='horizontal'
          items={
            roles.find((role) => role?.key === currentRole)
              ?.tabs as MenuItemType[]
          }
        />
      </div>
      <div className='navBarObject rightProfileContainer'>
        <Avatar
          data-testid={'profileIcon'}
          className='profileAvatar'
          size='large'>
          BH
        </Avatar>
      </div>
    </NavigationBarWrapper>
  );
};

export default NavigationBar;
