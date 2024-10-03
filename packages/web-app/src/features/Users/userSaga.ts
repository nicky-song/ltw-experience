import { takeEvery, put, call } from 'redux-saga/effects';
import {
  getUsers as getUsersAPI,
  createUser as createUserAPI,
} from './userService';
import type { User } from './userSlice';
import { GetUsersParams } from '@/types/requestParams';
import { PayloadAction } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

function* getUsers(action: PayloadAction<GetUsersParams>) {
  try {
    const response: ReturnType<typeof getUsersAPI> = yield call(
      getUsersAPI,
      action.payload,
    );
    yield put({ type: 'user/getUsersSuccess', payload: response });
  } catch (error) {
    yield put({
      type: 'user/getUsersFailure',
      payload: (error as AxiosError)?.message || error,
    });
  }
}

const getUserPayload = (user: User) => {
  const { role, ...rest } = user;
  return { ...rest, roles: [role] };
};

export function* createUser(action: PayloadAction<User>) {
  try {
    const user: ReturnType<typeof createUserAPI> = yield call(
      createUserAPI,
      getUserPayload(action.payload),
    );
    yield put({ type: 'user/createUserSuccess', payload: user });
  } catch (error) {
    yield put({ type: 'user/createUserFailure', payload: error });
  }
}

function* userSaga() {
  yield takeEvery('user/getUsers', getUsers);
  yield takeEvery('user/createUser', createUser);
}

export default userSaga;
