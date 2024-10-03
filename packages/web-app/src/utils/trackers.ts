import { UserResponse } from '@learn-to-win/common/types/UserServiceTypes';

// make typescript happy about window.heap
declare global {
  interface Window {
    heap: any;
  }
}

export const initializeTrackers = (userData: UserResponse) => {
  const heap = window.heap;
  // heap identify
  heap.identify(userData.id);
  heap.addUserProperties({
    email: userData.email,
    firstName: userData.firstName,
    lastName: userData.lastName,
  });
  // Add non string properties after, in case they break something
  heap.addUserProperties({
    roles: userData.roles.join(','),
    organizations: userData.organizations.map((o) => o.name).join(','),
  });
};
