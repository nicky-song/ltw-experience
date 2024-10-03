import React, { Fragment } from 'react';
import NavigationBar from './NavigationBar';

const DashboardLayout: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  return (
    <Fragment>
      <NavigationBar></NavigationBar>
      {children}
    </Fragment>
  );
};

export default DashboardLayout;
