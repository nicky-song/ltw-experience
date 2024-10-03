import { call, select } from 'redux-saga/effects';
import { expectSaga } from 'redux-saga-test-plan';
import {
  login,
  loginFailure,
  loginSuccess,
  setIsInitialAuthLoading,
  setUserInfo,
} from './authSlice';
import authSagaClass, { selectUser } from './authSaga';
import { mockUserData } from '../../constants/mockUserData';

const loginAPI = (email: string, pw: string) => Promise.resolve();
const mockUser = { ...mockUserData, token: '123' };
const getAllUserInfo = jest.fn(() => Promise.resolve(mockUser));
const initializeTrackers = jest.fn();

const myAuthSagaClass = new authSagaClass(
  loginAPI,
  getAllUserInfo,
  initializeTrackers,
);

describe('createLoginSaga', () => {
  it('should handle successful login', () => {
    const email = 'foo@bar.com';
    const password = 'password';
    const response = {
      cognitoResult: {
        challengeName: 'NOT_NEW_PASSWORD_REQUIRED',
        roles: ['ROLE_USER'],
      },
      loginResponse: {
        data: {
          id: '123',
        },
      },
    };
    return expectSaga(myAuthSagaClass.loginSaga.bind(myAuthSagaClass), {
      type: login.type,
      payload: { email, password },
    })
      .provide([[call(loginAPI, email, password), response]])
      .put(loginSuccess({ roles: ['ROLE_USER'] }))
      .run();
  });

  it('should handle login failure', () => {
    const email = 'foo@bar.com';
    const password = 'password';
    const error = new Error('Login failed');
    return expectSaga(myAuthSagaClass.loginSaga.bind(myAuthSagaClass), {
      type: login.type,
      payload: { email, password },
    })
      .provide([[call(loginAPI, email, password), Promise.reject(error)]])
      .put(loginFailure({ error }))
      .run();
  });

  it('should call isAuthenticated on startup', () => {
    return expectSaga(myAuthSagaClass.isAuthenticated.bind(myAuthSagaClass))
      .provide([[call(getAllUserInfo), Promise.resolve(mockUser)]])
      .put(setUserInfo(mockUser))
      .put(loginSuccess({ roles: ['admin', 'user'] }))
      .put(setIsInitialAuthLoading(false))
      .run();
  });

  it('should call trackAnalytics on setUserInfo', () => {
    return expectSaga(myAuthSagaClass.trackAnalytics.bind(myAuthSagaClass))
      .provide([
        [select(selectUser), mockUser],
        [call(initializeTrackers), Promise.resolve()],
      ])
      .run();
  });
});
