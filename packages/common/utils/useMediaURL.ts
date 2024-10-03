import { useQuery } from 'react-query';
import { getTemporaryUrl } from '../features/Media/mediaService';
import { temporaryUrlExpiry } from '../constants/media';
import {
  AudioBlockType,
  ImageBlockType,
  VideoBlockType,
} from '../features/Cards/cardTypes';

export const useMediaURL = (
  mediaBlock: VideoBlockType | AudioBlockType | ImageBlockType,
) => {
  const { data: mediaURL, isLoading } = useQuery(
    ['getS3Url', mediaBlock],
    async () => {
      if (!mediaBlock.url) {
        return;
      }
      return await getTemporaryUrl(mediaBlock.url);
    },
    { staleTime: temporaryUrlExpiry, refetchInterval: temporaryUrlExpiry },
  );

  return {
    mediaURL,
    isLoading,
  };
};
