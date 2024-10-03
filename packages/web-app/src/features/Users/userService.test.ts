import { createUser } from './userService';

jest.mock('@/services/client', () => ({
  default: {
    get: function () {
      return new Promise((resolve) => {
        resolve({
          data: {
            'hydra:member': {
              firstName: 'test',
              lastName: 'test',
              email: 'test@test.com',
              id: '123',
              roles: ['ROLE_USER', 'ORG_ROLE_LEARNER'],
            },
          },
        });
      });
    },
    post: function () {
      return new Promise((resolve) => {
        resolve({
          data: {
            firstName: 'test',
            lastName: 'test',
            email: 'test@test.com',
            id: '123',
            roles: ['ROLE_USER', 'ORG_ROLE_LEARNER'],
          },
        });
      });
    },
  },
}));

jest.mock('@/constants/envVariables', () => ({
  API_GATEWAY_URL: 'http://localhost:8080/',
}));

jest.mock('@features/Auth/authService', () => ({
  getAuthToken: jest.fn(() => '123'),
}));

describe('userService', () => {
  const firstName = 'test';
  const lastName = 'test';
  const email = 'test@test.com';
  const roles = ['ORG_ROLE_LEARNER'];
  const id = '123';
  const payload = { id, firstName, lastName, email, roles };
  it('should create user', async () => {
    const data = {
      firstName,
      lastName,
      email,
      id: '123',
      roles: ['ROLE_USER', 'ORG_ROLE_LEARNER'],
    };

    const user = await createUser(payload);
    expect(user).toEqual(data);
  });

  it('should throw error', async () => {
    try {
      await createUser(payload);
    } catch (error) {
      expect(error).toEqual(new Error('error'));
    }
  });
});
