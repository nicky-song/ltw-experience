import { UserResponse } from '@learn-to-win/common/types/UserServiceTypes';
import Heap from '@heap/react-native-heap';

export const initializeTrackers = (userData: UserResponse) => {
  // heap identify
  Heap.identify(userData.id);
  Heap.addUserProperties({
    email: userData.email,
    firstName: userData.firstName,
    lastName: userData.lastName,
  });
  // Add non string properties after, in case they break something
  Heap.addUserProperties({
    roles: userData.roles.join(','),
    organizations: userData.organizations.map((o) => o.name).join(','),
  });
};
