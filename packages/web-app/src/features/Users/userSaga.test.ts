import { expectSaga } from 'redux-saga-test-plan';
import { call } from 'redux-saga/effects';
import { createUser } from './userSaga';
import { createUser as createUserAPI, UserWithRoles } from './userService';

jest.mock('@/constants/envVariables', () => ({
  API_GATEWAY_URL: 'http://localhost:8080/',
}));

describe('userSaga', () => {
  const firstName = 'test';
  const lastName = 'test';
  const email = 'test@test.com';
  const role = 'ORG_ROLE_LEARNER';
  const id = '1';
  const userPayload: UserWithRoles = {
    id,
    firstName,
    lastName,
    email,
    roles: [role],
  };
  it('should handle createUser success', () => {
    const response = {
      ...userPayload,
      id: '123',
      roles: ['ROLE_USER', 'ORG_ROLE_LEARNER'],
    };

    return expectSaga(createUser, {
      type: 'user/createUser',
      payload: { id, firstName, lastName, email, role },
    })
      .provide([[call(createUserAPI, userPayload), response]])
      .put({ type: 'user/createUserSuccess', payload: response })
      .run();
  });
  it('should handle createUser failure', () => {
    const error = new Error('error');

    return expectSaga(createUser, {
      type: 'user/createUser',
      payload: { id, firstName, lastName, email, role },
    })
      .provide([[call(createUserAPI, userPayload), Promise.reject(error)]])
      .put({ type: 'user/createUserFailure', payload: error })
      .run();
  });
});
