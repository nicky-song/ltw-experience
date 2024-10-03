import {
  changePassword,
  forgotPassword,
  getAllUserInfo,
  login,
  resetPassword,
} from './authService';
import client from '../../services/client';

describe('authService', () => {
  it('can login', async () => {
    jest.spyOn(client, 'patch').mockResolvedValueOnce({
      data: {
        id: 'abcdfg123',
      },
    });

    expect(await login('demo@test.com', '12345678')).toEqual({
      cognitoResult: {
        username: 'abcdfg123',
        attributes: {
          email: 'demo@test.com',
          name: 'John Rambo',
          phone: '+460777777777',
        },
        signInUserSession: {
          accessToken: { jwtToken: '123456' },
        },
      },

      loginResponse: {
        data: {
          id: 'abcdfg123',
        },
      },
    });
  });

  it('can detect reset temp password', async () => {
    expect(await login('demo@test.com', 'resetTempPassword')).toEqual({
      cognitoResult: {
        challengeName: 'NEW_PASSWORD_REQUIRED',
      },
    });
  });

  it('can call forgotPassword', async () => {
    expect(await forgotPassword('test@test.com')).toEqual(undefined);
  });

  it('can call resetPassword', async () => {
    expect(
      await resetPassword('test@test.com', '123456', 'newPassword'),
    ).toEqual(undefined);
  });

  it('can call changePassword', async () => {
    jest.spyOn(client, 'patch').mockResolvedValueOnce({
      data: {
        id: 'abcdfg123',
      },
    });
    expect(
      await changePassword({ password: 'newPassword', cognitoUser: {} }),
    ).toEqual({
      id: 'abcdfg123',
    });
  });

  it('can call getAllUserInfo', async () => {
    jest.spyOn(client, 'get').mockResolvedValueOnce({
      data: {
        id: 'abcdfg123',
      },
    });
    expect(await getAllUserInfo()).toEqual({
      id: 'abcdfg123',
      token: '123456',
    });
  });
});
