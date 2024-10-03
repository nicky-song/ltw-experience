import { useState } from 'react';
import classNames from 'classnames';
import { Media } from '@components/ContentBlock/MediaBlock/MediaDrawer';
import Text from '@components/Typography/Text';
import { RcFile } from 'antd/es/upload';
import { UploadRequestOption } from 'rc-upload/lib/interface';
import { DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import { Empty, Progress, Upload, Button } from 'antd';
import { useMutation } from 'react-query';
import { putTemporaryUrl } from '@learn-to-win/common/features/Media/mediaService';
import { AxiosProgressEvent } from 'axios';
import {
  acceptedAudioTypes,
  acceptedImageTypes,
  acceptedVideoTypes,
} from '@learn-to-win/common/constants/media';
import './index.scss';

interface UploadMediaProps {
  updateS3Url: (id: string, fileName: string) => void;
  removeS3Url: () => void;
  contentType: 'image' | 'video' | 'audio';
  mediaUrl?: string;
  mediaName?: string;
}
const UploadMedia = ({
  updateS3Url,
  removeS3Url,
  contentType,
  mediaUrl,
  mediaName,
}: UploadMediaProps) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState(false);
  const { mutate } = useMutation<
    { data: { id: string; fileName: string } },
    null,
    { file: RcFile; data: ArrayBuffer }
  >({
    mutationFn: async ({ file, data }) => {
      return await putTemporaryUrl({
        onUploadProgress: ({ loaded, total }: AxiosProgressEvent) => {
          if (!total) {
            return;
          }
          const progress = (loaded / total) * 100;
          setUploadProgress(progress);
        },
        organizationId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        file,
        data,
      });
    },
    onSuccess: ({ data: { id, fileName } }) => {
      updateS3Url(id, fileName);
      setUploadProgress(0);
    },
    onError: () => {
      setUploadError(true);
      setUploadProgress(0);
    },
  });
  const uploadRequest = async ({ file }: UploadRequestOption) => {
    const uploadFile = file as RcFile;
    const reader = new FileReader();
    reader.readAsArrayBuffer(uploadFile);
    reader.onload = () => {
      // Show upload bar immediately for feedback
      setUploadProgress(1);
      mutate({ file: uploadFile, data: reader.result as ArrayBuffer });
    };
    reader.onerror = () => {
      setUploadError(true);
    };
  };

  const acceptedTypes = (type: string) => {
    switch (type) {
      case 'image':
        return acceptedImageTypes;
      case 'video':
        return acceptedVideoTypes;
      case 'audio':
        return acceptedAudioTypes;
    }
  };

  const getMediaTitleText = () => {
    const capitalType =
      contentType.toUpperCase().slice(0, 1) + contentType.slice(1);
    if (uploadError) {
      return `${capitalType} failed to upload. Try again.`;
    } else if (mediaName) {
      return mediaName;
    } else {
      return `No ${contentType} yet, try uploading one!`;
    }
  };
  return (
    <div className='media-upload'>
      {!uploadProgress &&
        (mediaUrl ? (
          <div className={'media-upload__preview-background'}>
            <Media mediaUrl={mediaUrl} type={contentType} altText={mediaUrl} />
          </div>
        ) : (
          <div data-testid='media-upload-empty-icon'>
            <Empty
              description=''
              className={classNames({
                'media-upload__preview__empty': !uploadError,
                'media-upload__preview__empty-danger': uploadError,
              })}
              image={<UploadOutlined />}
            />
          </div>
        ))}
      {!!uploadProgress && (
        <div className={'media-upload__preview__empty'}>
          <Text>Uploading...</Text>
          <Progress
            percent={uploadProgress}
            showInfo={false}
            size={'small'}></Progress>
        </div>
      )}
      <div
        className={classNames({
          'media-upload__preview__danger': uploadError,
          'media-upload__preview__info': true,
        })}>
        <Text classes='media-upload__preview-title'>{getMediaTitleText()}</Text>
        <div className={'media-upload__upload-buttons'}>
          <Upload
            accept={acceptedTypes(contentType)}
            showUploadList={false}
            customRequest={uploadRequest}>
            <Button
              data-testid='media-upload-button'
              disabled={!!uploadProgress}
              className='media-upload__button'
              icon={<UploadOutlined />}>
              {mediaUrl ? 'Change' : 'Upload'}
            </Button>
          </Upload>
          <Button
            danger
            disabled={!mediaUrl}
            onClick={removeS3Url}
            className='media-upload__button'
            icon={<DeleteOutlined />}>
            Remove
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UploadMedia;
