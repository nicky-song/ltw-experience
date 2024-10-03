import client from '../../services/client';
import { Amplify, Auth } from 'aws-amplify';
import { UserResponse } from '@learn-to-win/common/types/UserServiceTypes';

Amplify.configure({
  aws_cognito_region: process.env.EXPO_PUBLIC_AUTH_REGION,
  aws_user_pools_id: process.env.EXPO_PUBLIC_AUTH_USER_POOL_ID,
  aws_user_pools_web_client_id:
    process.env.EXPO_PUBLIC_AUTH_USER_POOL_WEB_CLIENT_ID,
});

export const login = async (email: string, password: string) => {
  const cognitoResult = await Auth.signIn(email, password);
  if (cognitoResult.challengeName === 'NEW_PASSWORD_REQUIRED') {
    return { cognitoResult };
  }
  const loginResponse = await client.patch(
    process.env.EXPO_PUBLIC_API_GATEWAY_URL + `login_event`,
  );
  cognitoResult.roles = loginResponse.data.roles;
  return { cognitoResult, loginResponse };
};

export const forgotPassword = async (email: string) => {
  return await Auth.forgotPassword(email);
};

export const resetPassword = async (
  username: string,
  code: string,
  newPassword: string,
): Promise<unknown> => {
  return await Auth.forgotPasswordSubmit(username, code, newPassword);
};

export const changePassword = async (data: {
  password: string;
  cognitoUser: unknown;
}) => {
  await Auth.completeNewPassword(data.cognitoUser, data.password);
  const response = await client.patch<UserResponse>(
    process.env.EXPO_PUBLIC_API_GATEWAY_URL + `login_event`,
  );
  return response.data;
};

export const getAuthToken = async () => {
  // Will throw error if not authenticated
  const currentSession = await Auth.currentSession();
  return { token: currentSession?.getAccessToken()?.getJwtToken() };
};

export const getAllUserInfo = async () => {
  const { token } = await getAuthToken();
  const { username: id } = await Auth.currentUserInfo();
  const response = await client.get<UserResponse>(
    process.env.EXPO_PUBLIC_API_GATEWAY_URL + `users/${id}`,
  );
  return {
    ...response.data,
    token,
  };
};
