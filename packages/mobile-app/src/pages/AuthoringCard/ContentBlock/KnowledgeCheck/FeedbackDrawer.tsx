import { Feedback } from '@learn-to-win/common/features/Cards/cardTypes';
import { StyleSheet, View } from 'react-native';
import { Confetti } from './Confetti';
import { RichTextViewer } from '../RichTextViewer';
import { LessonBackButton } from '../../LessonNavigation';
import { Button } from '@ant-design/react-native';

export function FeedbackDrawer({
  answerCorrect,
  canContinue,
  feedback,
  onPrev,
  onFinish,
}: {
  answerCorrect: boolean;
  canContinue: boolean;
  feedback: Feedback;
  onPrev: () => void;
  onFinish: () => void;
}) {
  return (
    <View style={styles.container}>
      {answerCorrect && <Confetti />}
      <View
        style={[
          styles.drawer,
          {
            backgroundColor: answerCorrect ? '#F6FFED' : '#FFF1F0',
          },
        ]}>
        <View style={styles.feedbackContent}>
          <RichTextViewer json={feedback.header} />
          <RichTextViewer json={feedback.body} />
        </View>
        <View style={styles.navigation}>
          <LessonBackButton onPress={onPrev} />
          <Button
            disabled={!canContinue}
            testID='lesson-next-button'
            style={[
              styles.buttonContinue,
              !canContinue && styles.buttonDisabled,
            ]}
            type={canContinue ? 'primary' : 'ghost'}
            onPress={onFinish}>
            {canContinue ? 'Continue' : 'Please Try Again'}
          </Button>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { position: 'absolute', bottom: 0, width: '100%' },
  drawer: {
    borderTopStartRadius: 8,
    borderTopEndRadius: 8,
    justifyContent: 'space-between',
  },
  feedbackContent: {
    padding: 25,
    minHeight: 200,
  },
  navigation: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginBottom: 36,
  },
  buttonContinue: {
    marginRight: 10,
    backgroundColor: '#6FC07A',
    minWidth: 180,
  },
  buttonDisabled: { backgroundColor: undefined },
});
