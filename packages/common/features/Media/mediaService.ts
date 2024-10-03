import { getApiGatewayUrl, getRestClient } from '../../utils/restClient';
import axios, { AxiosProgressEvent } from 'axios';
import { RcFile } from 'antd/es/upload';

interface putTemporaryUrlParams {
  onUploadProgress: (progressEvent: AxiosProgressEvent) => void;
  organizationId: string;
  file: RcFile;
  data: ArrayBuffer;
}
export const putTemporaryUrl = async ({
  onUploadProgress,
  organizationId,
  file,
  data,
}: putTemporaryUrlParams) => {
  const uploadMedia = await getRestClient().post(`${getApiGatewayUrl()}media`, {
    organizationId,
    mimeType: file.type,
    fileName: file.name,
    path: '/test',
  });
  const putUrl = uploadMedia?.data?.temporaryPutUrl;
  if (putUrl) {
    await axios.put(putUrl, data, {
      onUploadProgress,
      headers: { 'Content-Type': file.type },
    });
  }
  return uploadMedia;
};

export const getTemporaryUrl = async (url: string) => {
  const { data } = await getRestClient().get<{
    temporaryGetUrl: string;
  }>(url);
  return data.temporaryGetUrl;
};
