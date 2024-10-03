import { Navigate, Outlet } from 'react-router-dom';
import { ReactElement } from 'react';
import { useAppSelector } from '@hooks/reduxHooks';
import { Spin } from 'antd';

function PrivateRoute(): ReactElement {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const isLoading = useAppSelector((state) => state.auth.isInitialAuthLoading);

  if (isLoading) {
    return <Spin spinning={isLoading} />;
  }

  return !isAuthenticated ? (
    <Navigate to='/login' replace={true} />
  ) : (
    <Outlet />
  );
}

export default PrivateRoute;
