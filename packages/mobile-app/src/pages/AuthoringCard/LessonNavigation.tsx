import { StyleSheet } from 'react-native';
import { Button } from '@ant-design/react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export function LessonBackButton({ onPress }: { onPress: () => void }) {
  return (
    <Button
      style={styles.buttonPrev}
      type='ghost'
      testID='lesson-prev-button'
      onPress={onPress}>
      <Icon name='arrow-left-circle' style={styles.icon} />
    </Button>
  );
}

const styles = StyleSheet.create({
  buttonPrev: {
    borderWidth: 0,
  },
  icon: { fontSize: 48, color: 'black' },
});
