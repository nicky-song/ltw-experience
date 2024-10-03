import { useCallback, useEffect, useState } from 'react';
import { ImageBlockType } from '@learn-to-win/common/features/Cards/cardTypes';
import {
  ActivityIndicator,
  StyleSheet,
  View,
  Image as RNImage,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Button } from '@ant-design/react-native';
import { useNavigation } from '@react-navigation/native';
import { useMediaURL } from '@learn-to-win/common/utils/useMediaURL';
import { Image } from 'expo-image';

export function ImageBlock({ contentBlock }: { contentBlock: ImageBlockType }) {
  const imageBlock = contentBlock as ImageBlockType;
  const [imageAspectRatio, setImageAspectRatio] = useState<number>();

  const { mediaURL: mediaUrl, isLoading: loadingMedia } =
    useMediaURL(imageBlock);

  const navigation = useNavigation();

  const navigateToImageModalFullScreen = useCallback(
    (mediaUrl: string) => {
      return () => {
        navigation.navigate('ImageModal', {
          mediaUrl: mediaUrl,
        });
      };
    },
    [navigation],
  );

  useEffect(() => {
    if (mediaUrl) {
      RNImage.getSize(mediaUrl, (width, height) => {
        setImageAspectRatio(width / height);
      });
    }
  }, [mediaUrl]);

  return (
    <>
      {!!imageBlock.url && (
        <View
          style={[
            styles.mediaContainer,
            !imageAspectRatio ? styles.mediaContainerLoading : null,
          ]}>
          {!loadingMedia && imageAspectRatio ? (
            <View>
              <Image
                testID='content-media-block'
                style={[
                  styles.image,
                  {
                    aspectRatio: imageAspectRatio,
                  },
                ]}
                contentFit='contain'
                source={mediaUrl}
                alt={imageBlock.name}
              />
              <View style={styles.expandOverlay}>
                <Button
                  testID='media-block-fullscreen-button'
                  style={styles.expandButton}
                  type='ghost'
                  onPress={navigateToImageModalFullScreen(mediaUrl)}>
                  <Icon name='fullscreen' style={styles.expandIcon} />
                </Button>
              </View>
            </View>
          ) : (
            <ActivityIndicator size='large' color='#6FC07A' />
          )}
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  mediaContainerLoading: {
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mediaContainer: {
    marginBottom: 16,
  },
  image: {
    paddingTop: 8,
    paddingBottom: 8,
    borderRadius: 8,
  },
  expandOverlay: {
    position: 'absolute',
    top: 8,
    right: 9,
  },
  expandButton: {
    width: 30,
    height: 30,
    backgroundColor: '#000000',
    borderRadius: 8,
  },
  expandIcon: {
    position: 'absolute',
    fontSize: 26,
    left: -13,
    color: '#ffffff',
  },
});
