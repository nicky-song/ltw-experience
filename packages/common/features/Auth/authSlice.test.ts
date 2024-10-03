import authReducer, {
  changePassword,
  login,
  loginFailure,
  loginSuccess,
  logout,
  setUserInfo,
} from './authSlice';
import { mockUserData } from '../../constants/mockUserData';

describe('authSlice', () => {
  const initialState = {
    loading: false,
    error: '',
    isAuthenticated: false,
    isInitialAuthLoading: true,
    shouldChangePassword: false,
    userRoles: [],
    user: {},
    userId: '',
    tempCognitoUser: null,
  };

  it('should handle login', () => {
    const state = authReducer(initialState, login({}));
    expect(state.loading).toEqual(true);
  });

  it('should handle loginSuccess', () => {
    const payload = { accessToken: 'foobar', roles: ['ROLE_USER'] };
    const state = authReducer(initialState, loginSuccess(payload));
    expect(state.loading).toEqual(false);
    expect(state.isAuthenticated).toEqual(true);
    expect(state.userRoles).toEqual(['ROLE_USER']);
  });

  it('should handle loginFailure', () => {
    const payload = { error: { message: 'Invalid credentials' } };
    const state = authReducer(initialState, loginFailure(payload));
    expect(state.loading).toEqual(false);
    expect(state.isAuthenticated).toEqual(false);
    expect(state.error).toEqual('Invalid credentials');
  });

  it('should handle logout', () => {
    const state = authReducer(
      {
        ...initialState,
        isAuthenticated: true,
        userRoles: ['ROLE_USER'],
      },
      logout(),
    );
    expect(state.isAuthenticated).toEqual(false);
    expect(state.userRoles).toEqual([]);
  });

  it('calls userInfo', () => {
    const state = authReducer(initialState, setUserInfo(mockUserData));
    expect(state.user).toEqual(mockUserData);
    expect(state.userId).toEqual(mockUserData.id);
    expect(state.userRoles).toEqual(mockUserData.roles);
  });

  it('calls changePassword', () => {
    const state = authReducer(
      initialState,
      changePassword({ user: mockUserData }),
    );
    expect(state.shouldChangePassword).toEqual(true);
    expect(state.isAuthenticated).toEqual(false);
    expect(state.tempCognitoUser).toEqual(mockUserData);
  });
});
