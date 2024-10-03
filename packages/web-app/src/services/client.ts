import axios from 'axios';
import { API_GATEWAY_URL, S3_FILE_PATH } from '@/constants/envVariables';
import { getAuthToken } from '@features/Auth/authService';
import {
  setApiGatewayUrl,
  setRestClient,
  setS3FilePath,
} from '@learn-to-win/common/utils/restClient';

const defaultOptions = {
  baseURL: API_GATEWAY_URL,
  method: 'get',
  headers: {
    'Content-Type': 'application/ld+json',
  },
};

// Create client
const client = axios.create(defaultOptions);

// Set the AUTH token for any request
client.interceptors.request.use(async function (config) {
  const { token } = await getAuthToken();
  config.headers.Authorization = token ? `Bearer ${token}` : '';
  return config;
});

setRestClient(client);
setApiGatewayUrl(API_GATEWAY_URL);
setS3FilePath(S3_FILE_PATH);

export default client;
