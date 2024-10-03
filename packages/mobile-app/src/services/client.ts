import axios from 'axios';
import { getAuthToken } from '../features/Auth/authService';
import {
  setApiGatewayUrl,
  setRestClient,
} from '@learn-to-win/common/utils/restClient';

const defaultOptions = {
  baseURL: process.env.EXPO_PUBLIC_API_GATEWAY_URL,
  method: 'get',
  headers: {
    'Content-Type': 'application/ld+json',
  },
};

// Create instance
const client = axios.create(defaultOptions);

// Set the AUTH token for any request
client.interceptors.request.use(async function (config) {
  const { token } = await getAuthToken();
  config.headers.Authorization = token ? `Bearer ${token}` : '';
  return config;
});

// Send instance to common package.
setRestClient(client);
setApiGatewayUrl(process.env.EXPO_PUBLIC_API_GATEWAY_URL);

export default client;
