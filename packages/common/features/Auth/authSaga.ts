import { call, put, select, takeEvery } from 'redux-saga/effects';
import {
  changePassword,
  login,
  loginFailure,
  loginSuccess,
  setIsInitialAuthLoading,
  setUserInfo,
} from './authSlice';
import { SagaIterator } from 'redux-saga';
import { UserResponse } from '../../types/UserServiceTypes';
import { AuthStateType } from './authTypes';

type AuthAction<Payload> = {
  type: string;
  payload: Payload;
};

interface AuthSignInInput {
  email: string;
  password: string;
}

type loginCall = (email: string, password: string) => Promise<any>;
type getAllUserInfo = () => Promise<{ id?: string; token?: string }>;
type initializeTrackers = (userData: UserResponse) => void;

export const selectUser = (state: { auth: AuthStateType }) => state.auth.user;

class AuthSaga {
  constructor(
    loginAPI: loginCall,
    getAllUserInfo: getAllUserInfo,
    initializeTrackers: initializeTrackers,
  ) {
    this.loginAPI = loginAPI;
    this.getAllUserInfo = getAllUserInfo;
    this.initializeTrackers = initializeTrackers;
  }

  loginAPI: loginCall;
  getAllUserInfo: getAllUserInfo;
  initializeTrackers: initializeTrackers;

  *authSaga(this: AuthSaga) {
    yield takeEvery(login.type, this.loginSaga.bind(this));
    yield takeEvery(setUserInfo.type, this.trackAnalytics.bind(this));
    // Check if is authed when sagas start up
    yield call(this.isAuthenticated.bind(this));
  }

  *loginSaga(this: AuthSaga, props: AuthAction<AuthSignInInput>): SagaIterator {
    const email = props.payload.email;
    const password = props.payload.password;

    try {
      const { cognitoResult, loginResponse } = yield call(
        this.loginAPI,
        email,
        password,
      );
      if (cognitoResult.challengeName === 'NEW_PASSWORD_REQUIRED') {
        yield put(changePassword({ user: cognitoResult }));
        return;
      }
      if (loginResponse) {
        if (loginResponse.data.id) yield put(setUserInfo(loginResponse.data));
      }
      yield put(loginSuccess({ roles: cognitoResult.roles }));
    } catch (error: unknown) {
      yield put(loginFailure({ error }));
    }
  }

  *isAuthenticated(): SagaIterator {
    try {
      const user = yield call(this.getAllUserInfo);
      if (user.id) {
        yield put(setUserInfo(user));
        yield put(loginSuccess({ roles: user.roles }));
      }
    } catch (e) {
      /* empty */
    }
    yield put(setIsInitialAuthLoading(false));
  }

  *trackAnalytics(): SagaIterator {
    try {
      const userData = yield select(selectUser);
      this.initializeTrackers(userData);
    } catch (e) {
      /* empty */
    }
  }
}

export default AuthSaga;
