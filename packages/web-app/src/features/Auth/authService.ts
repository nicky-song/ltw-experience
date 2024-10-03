import { AxiosResponse } from 'axios';
import { Auth } from 'aws-amplify';
import client from '@/services/client';
import { API_GATEWAY_URL } from '@/constants/envVariables';
import { UserResponse } from '@learn-to-win/common/types/UserServiceTypes';

export const register = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  organizationName: string,
): Promise<AxiosResponse> => {
  return await client.post<UserResponse>(API_GATEWAY_URL + 'users', {
    firstName,
    lastName,
    email,
    password,
    organizations: [
      {
        name: organizationName,
      },
    ],
  });
};

export const login = async (email: string, password: string) => {
  const cognitoResult = await Auth.signIn(email, password);
  if (cognitoResult.challengeName === 'NEW_PASSWORD_REQUIRED') {
    return { cognitoResult };
  }
  const loginResponse = await client.patch<UserResponse>(
    API_GATEWAY_URL + `login_event`,
  );
  cognitoResult.roles = loginResponse.data.roles;
  return { cognitoResult, loginResponse };
};

export const confirmEmail = async (code: string, clientId: string) => {
  return await Auth.confirmSignUp(clientId, code);
};

export const changePassword = async (data: {
  password: string;
  user: unknown;
}) => {
  await Auth.completeNewPassword(data.user, data.password);
  const response = await client.patch<UserResponse>(
    API_GATEWAY_URL + `login_event`,
  );
  return response.data;
};

export const forgotPassword = async (email: string): Promise<unknown> => {
  return await Auth.forgotPassword(email);
};

export const resetPassword = async (
  username: string,
  code: string,
  newPassword: string,
): Promise<unknown> => {
  return await Auth.forgotPasswordSubmit(username, code, newPassword);
};

export const getAuthToken = async () => {
  // Will throw error if not authenticated
  const currentSession = await Auth.currentSession();
  return { token: currentSession?.getAccessToken()?.getJwtToken() };
};

export const getAllUserInfo = async () => {
  const { token } = await getAuthToken();

  // TODO: Should we do these two calls or just call /login_event?
  const { username: id } = await Auth.currentUserInfo();
  const response = await client.get<UserResponse>(
    API_GATEWAY_URL + `users/${id}`,
  );
  return {
    ...response.data,
    token,
  };
};
