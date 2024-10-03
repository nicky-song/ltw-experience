import { StyleSheet, View } from 'react-native';
import { LessonBackButton } from '../../LessonNavigation';
import { Button } from '@ant-design/react-native';

export function SelectOptionNavigation({
  onPrev,
  answered,
  isCardEnrollmentCompleted,
  onFinish,
  checkAnswerSelectAny,
}: {
  onPrev: () => void;
  answered: number;
  isCardEnrollmentCompleted: boolean;
  onFinish: () => void;
  checkAnswerSelectAny: () => void;
}) {
  return (
    <View style={styles.container}>
      <LessonBackButton onPress={onPrev} />
      <Button
        disabled={!answered}
        testID='lesson-next-button'
        style={[styles.buttonContinue, !answered && styles.buttonDisabled]}
        type={answered ? 'primary' : 'ghost'}
        onPress={isCardEnrollmentCompleted ? onFinish : checkAnswerSelectAny}>
        {isCardEnrollmentCompleted
          ? 'Continue'
          : !answered
          ? 'Answer to Continue'
          : 'Check'}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 36,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  buttonContinue: {
    marginRight: 10,
    backgroundColor: '#6FC07A',
    minWidth: 180,
  },
  buttonDisabled: { backgroundColor: undefined },
});
