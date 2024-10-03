import type { User } from './userSlice';
import { GetUsersParams } from '@/types/requestParams';
import { getAuthToken } from '@features/Auth/authService';
import { API_GATEWAY_URL } from '@/constants/envVariables';
import client from '@/services/client';

export const getUsers = async (userParams: GetUsersParams) => {
  try {
    const { token } = await getAuthToken();
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    //TODO: to use params with special characters, write custom param serializer or move params to url.
    const params = {
      ...userParams,
    };
    const res = await client.get(API_GATEWAY_URL + 'users', {
      headers,
      params,
    });
    return res.data['hydra:member'];
  } catch (error) {
    console.log('error getting users:::', error);
  }
};

export type UserWithRoles = Omit<User, 'role'> & { roles: string[] };

export const createUser = async (user: UserWithRoles) => {
  try {
    const { token } = await getAuthToken();

    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const res = await client.post(API_GATEWAY_URL + 'users', user, { headers });
    return res.data;
  } catch (error) {
    console.log('error creating user:::', error);
    throw error;
  }
};
