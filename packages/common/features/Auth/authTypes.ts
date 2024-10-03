export interface AuthStateType {
  loading: boolean;
  userId: string;
  error: string | null;
  isAuthenticated: boolean;
  isInitialAuthLoading: boolean;
  userRoles: object;
  shouldChangePassword: boolean;
  user: object;
  tempCognitoUser: unknown;
}
