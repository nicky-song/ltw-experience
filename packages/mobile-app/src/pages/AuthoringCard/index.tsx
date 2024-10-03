import { getContentBlocksFromCard } from './CardHelper';
import { Text, View } from 'react-native';
import { Button } from '@ant-design/react-native';
import {
  GestureHandlerRootView,
  ScrollView,
} from 'react-native-gesture-handler';
import styles from './AuthoringCard.styles';
import { useCallback, useState } from 'react';
import InView from 'react-native-component-inview';
import { useAppSelector } from '../../hooks/reduxHooks';
import { useNavigation } from '@react-navigation/native';
import { LessonPreview } from './LessonPreview';
import { useNextLearningItem } from './useNextLearningItem';
import { ActivityIndicator } from '../../components/ActivityIndicator/ActivityIndicator';
import { useCardCompletionCheck } from '@learn-to-win/common/hooks/CardCompletionCheck';
import { LessonBackButton } from './LessonNavigation';
import { CardType } from '@learn-to-win/common/constants';

interface AuthoringCardProps {
  card: any;
  onPrev?: () => void;
  onFinish?: () => void;
  cardType?: CardType;
}

export function AuthoringCard({
  card,
  onPrev,
  onFinish,
  cardType,
}: AuthoringCardProps) {
  const { cardEnrollments } = useAppSelector((state) => state.enrollment);

  const [isAtBottom, setIsAtBottom] = useState(false);
  const { isCardComplete, continueMessage, isCompletionUIHidden } =
    useCardCompletionCheck({
      isAtBottom,
      cardEnrollment: cardEnrollments?.find(
        (cardEnrollment) => cardEnrollment.cardId === card.id,
      ),
      cardType,
    });

  const contentBlocks = getContentBlocksFromCard(card);

  const { navigateToNextLesson, nextLesson, isLoading } = useNextLearningItem({
    isEnabled: cardType === CardType.END_CARD,
    learningItemId: card.learningItemId,
    // courseEnrollmentId: card.courseEnrollmentId,
  });

  const navigation = useNavigation();
  const onEndCardFinish = useCallback(() => {
    onFinish();
    navigation.goBack();
  }, [navigation, onFinish]);

  return (
    <GestureHandlerRootView style={styles.gestureContainer}>
      <ScrollView style={styles.carouselContainer}>
        {contentBlocks}
        <InView
          onChange={(isVisible: boolean) => setIsAtBottom(isVisible)}
          style={styles.inView}>
          <View style={styles.contentSpacer}>
            <Text> </Text>
          </View>
        </InView>
      </ScrollView>
      {nextLesson && <LessonPreview lesson={nextLesson} />}
      {!isCompletionUIHidden && (
        <View style={styles.buttonContainer}>
          {cardType === CardType.TITLE_CARD && (
            <Button
              testID='lesson-next-button'
              style={styles.startButton}
              type={'primary'}
              onPress={onFinish}>
              Get Started
            </Button>
          )}

          {cardType === CardType.LESSON_CARD && (
            <>
              <LessonBackButton onPress={onPrev} />
              <Button
                disabled={!isCardComplete}
                testID='lesson-next-button'
                style={[
                  styles.buttonContinue,
                  !isCardComplete && styles.buttonDisabled,
                ]}
                type={isCardComplete ? 'primary' : 'ghost'}
                onPress={onFinish}>
                {continueMessage}
              </Button>
            </>
          )}

          {cardType === CardType.END_CARD && (
            <View style={styles.endCardButtonContainer}>
              {isLoading && <ActivityIndicator />}
              {nextLesson && (
                <Button
                  testID='lesson-next-button'
                  style={styles.nextLessonButton}
                  type={'primary'}
                  onPress={navigateToNextLesson}>
                  Next Lesson
                </Button>
              )}
              <Button
                style={styles.backToCourses}
                type={'ghost'}
                onPress={onEndCardFinish}>
                Back To Course
              </Button>
            </View>
          )}
        </View>
      )}
    </GestureHandlerRootView>
  );
}
