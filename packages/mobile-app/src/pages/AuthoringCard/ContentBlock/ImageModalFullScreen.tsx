import { StyleSheet, View, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Button } from '@ant-design/react-native';

export function ImageModalFullScreen({ route, navigation }) {
  const mediaUrl = route.params.mediaUrl || {};
  return (
    <View style={styles.fullScreenContainer}>
      <Image
        style={styles.image}
        resizeMode='contain'
        source={{
          uri: mediaUrl,
        }}
      />
      <View style={styles.collapseOverlay}>
        <Button
          testID='media-block-collapse-button'
          style={styles.collapseButton}
          type='ghost'
          onPress={() => navigation.goBack()}>
          <Icon name='fullscreen-exit' style={styles.collapseIcon} />
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    backgroundColor: '#000000',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    height: '100%',
    width: '100%',
  },
  collapseOverlay: {
    position: 'absolute',
    top: 8,
    right: 9,
  },
  collapseButton: {
    width: 40,
    height: 40,
    backgroundColor: '#000000',
    borderRadius: 8,
  },
  collapseIcon: {
    position: 'absolute',
    fontSize: 26,
    left: -13,
    bottom: -13,
    color: '#ffffff',
  },
});
