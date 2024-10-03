import { createSlice } from '@reduxjs/toolkit';
import { AuthStateType } from './authTypes';

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
} as AuthStateType;

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    login(state, action) {
      state.loading = true;
      state.error = '';
    },
    loginSuccess(state, action) {
      state.loading = false;
      state.isAuthenticated = true;
      state.shouldChangePassword = false; // used for reset password flow
      const { roles } = action.payload;
      state.userRoles = roles;
    },
    setIsInitialAuthLoading(state, action: { payload: boolean }) {
      state.isInitialAuthLoading = action.payload;
    },
    loginFailure(state, action) {
      const {
        payload: {
          error: { message },
        },
      } = action;

      state.error = message;
      state.loading = false;
      state.isAuthenticated = false;
      state.error = message;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.userRoles = [];
    },
    setUserInfo(state, action) {
      state.user = action.payload;
      state.userId = action.payload.id;
      state.userRoles = action.payload.roles;
    },
    changePassword(state, action: { payload: { user: unknown } }) {
      // User is identified but needs to complete login by changing password
      state.loading = false;
      state.shouldChangePassword = true;
      state.isAuthenticated = false;
      state.tempCognitoUser = action.payload.user;
    },
  },
});

export const {
  login,
  logout,
  loginSuccess,
  loginFailure,
  changePassword,
  setUserInfo,
  setIsInitialAuthLoading,
} = authSlice.actions;
export default authSlice.reducer;
