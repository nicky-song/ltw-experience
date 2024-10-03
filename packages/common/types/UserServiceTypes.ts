export type UserResponse = {
  '@context': string;
  '@id': string;
  '@type': string;
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: string[];
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string;
  organizations: any[];
  userOrganizationRoles: any[];
};
