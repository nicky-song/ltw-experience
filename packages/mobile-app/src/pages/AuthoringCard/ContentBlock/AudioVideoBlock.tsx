import {
  AudioBlockType,
  VideoBlockType,
} from '@learn-to-win/common/features/Cards/cardTypes';
import { Video, ResizeMode } from 'expo-av';
import { View, StyleSheet } from 'react-native';
import { useCardCompletionForMedia } from '@learn-to-win/common/hooks/CardCompletionCheck';
import { useMediaURL } from '@learn-to-win/common/utils/useMediaURL';
import { ActivityIndicator } from '../../../components/ActivityIndicator/ActivityIndicator';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export function AudioVideoBlock({
  contentBlock,
}: {
  // Audio happens to be able to be played by the Video component
  contentBlock: VideoBlockType | AudioBlockType;
}) {
  const { setMediaAsViewed } = useCardCompletionForMedia(contentBlock.id);
  const { mediaURL, isLoading } = useMediaURL(contentBlock);
  return (
    <>
      {!!contentBlock.url && (
        <View style={styles.mediaContainer}>
          {isLoading ? (
            <ActivityIndicator />
          ) : (
            <>
              {contentBlock.type === 'audio' && (
                // Added music icon for android
                <Icon name={'music'} style={styles.expandIcon} size={100} />
              )}
              <Video
                source={{ uri: mediaURL }}
                onPlaybackStatusUpdate={(status) => {
                  if (status.isLoaded && status.didJustFinish) {
                    setMediaAsViewed();
                  }
                }}
                onError={() => {
                  setMediaAsViewed();
                }}
                resizeMode={ResizeMode.CONTAIN}
                style={styles.video}
                useNativeControls
                testID='audio-video-block'
              />
            </>
          )}
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  mediaContainer: {
    width: '100%',
    aspectRatio: 16 / 9, // prevent layout shift when video is loading
    marginVertical: 8,
    justifyContent: 'center', // center loader,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  video: {
    width: '100%',
    aspectRatio: 16 / 9,
  },
  expandIcon: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -50 }, { translateY: -50 }],
    color: '#919191',
  },
});
