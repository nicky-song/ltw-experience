import React, { FC } from 'react';
import { Avatar } from 'antd';
import Title from '@components/Typography/Title';
import { UserOutlined } from '@ant-design/icons';
import './styles.scss';
interface LoginLayoutInterface {
  children: React.ReactNode;
}
const LoginLayout: FC<LoginLayoutInterface> = ({ children }) => {
  return (
    <div className='login-layout'>
      <div>
        <div className='login-layout__company-info'>
          <Avatar
            className='login-layout__avatar'
            shape='square'
            size='large'
            icon={<UserOutlined />}
          />
          <Title level={5} classes={'login-layout__company-name'}>
            Learn to Win
          </Title>
        </div>
      </div>
      <div className='login-layout__children'>{children}</div>
    </div>
  );
};

export default LoginLayout;
