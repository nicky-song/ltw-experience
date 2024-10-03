import {
  changePassword,
  confirmEmail,
  forgotPassword,
  getAllUserInfo,
  getAuthToken,
  login,
  register,
  resetPassword,
} from '@features/Auth/authService';
import { Auth } from 'aws-amplify';
import client from '@/services/client';

jest.mock('../../services/client', () => ({
  default: {
    post: jest.fn(),
    get: jest.fn(),
    patch: jest.fn(),
  },
}));

describe('authService', () => {
  it('register works', async () => {
    await register(
      'Ryan',
      'R',
      'rrabello@learntowin.com',
      'password',
      'Learn to Win',
    );
    expect(true).toBe(true);
    expect(client.post).toHaveBeenCalledWith('API_GATEWAY_URL/users', {
      firstName: 'Ryan',
      lastName: 'R',
      email: 'rrabello@learntowin.com',
      password: 'password',
      organizations: [
        {
          name: 'Learn to Win',
        },
      ],
    });
  });

  // WIP: fix this test
  it('logs in', async () => {
    (client.patch as jest.Mocked<any>).mockReturnValueOnce({
      data: {
        firstName: 'Ryan',
        // ... And more
      },
    });
    const { loginResponse } = await login('email', 'password');
    expect(Auth.signIn).toHaveBeenCalled();
    expect(client.patch).toHaveBeenCalled();
    expect(loginResponse).toStrictEqual({
      data: {
        firstName: 'Ryan',
      },
    });
  });

  it('calls getAuthToken', async () => {
    await getAuthToken();
    expect(Auth.currentSession).toHaveBeenCalled();
  });
  it('calls confirmEmail', async () => {
    await confirmEmail('123', '123');
    expect(Auth.confirmSignUp).toHaveBeenCalled();
  });
  it('calls change password', async () => {
    (client.patch as jest.Mocked<any>).mockReturnValueOnce({
      data: {
        firstName: 'Ryan',
        // ... And more
      },
    });
    const response = await changePassword({
      password: '123',
      user: {
        id: '123',
      },
    });
    expect(Auth.completeNewPassword).toHaveBeenCalled();
    expect(client.patch).toHaveBeenCalled();
    expect(response).toStrictEqual({
      firstName: 'Ryan',
    });
  });
  it('calls forgotPassword', async () => {
    await forgotPassword('123@gmail.com');
    expect(Auth.forgotPassword).toHaveBeenCalled();
  });

  it('calls resetPassword', async () => {
    await resetPassword('username', 'code', 'newPass');
    expect(Auth.forgotPasswordSubmit).toHaveBeenCalled();
  });
  it('calls getAllUserInfo', async () => {
    (client.get as jest.Mocked<any>).mockReturnValueOnce({
      data: {
        firstName: 'Ryan',
        // ... And more
      },
    });
    const { token, firstName } = await getAllUserInfo();
    expect(Auth.currentUserInfo).toHaveBeenCalled();
    expect(client.get).toHaveBeenCalled();
    expect(token).toBe('TEST_TOKEN');
    expect(firstName).toBe('Ryan');
  });
});
