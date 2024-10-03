import { AxiosInstance } from 'axios';

let restClient: AxiosInstance | null = null;

export function getRestClient() {
  if (!restClient) {
    throw new Error('getRestClient called before setRestClient');
  }
  return restClient;
}

export function setRestClient(client: AxiosInstance) {
  restClient = client;
}

let API_GATEWAY_URL: string | null = null;
export function setApiGatewayUrl(url: string) {
  API_GATEWAY_URL = url;
}

export function getApiGatewayUrl() {
  if (!API_GATEWAY_URL) {
    throw new Error('getApiGatewayUrl called before setApiGatewayUrl');
  }
  return API_GATEWAY_URL;
}

let S3_FILE_PATH: string | null = null;
export function setS3FilePath(path:string){
  S3_FILE_PATH = path;
}

export function getS3FilePath(){
  if(!S3_FILE_PATH){
    throw new Error('getS3FilePath called before setS3FilePath');
  }
  return S3_FILE_PATH;
}
