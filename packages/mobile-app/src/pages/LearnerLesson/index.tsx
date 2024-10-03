import CardCarousel from '../AuthoringCard/CardCarousel';
import { AuthoringCard } from '../AuthoringCard';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import { useMutation } from 'react-query';
import { useInterval } from '@learn-to-win/common/hooks/useInterval';
import {
  useAppDispatch as useDispatch,
  useAppSelector as useSelector,
} from '../../hooks/reduxHooks';
import {
  fetchAndCreateEnrollments,
  getCardsEnrollmentAction,
} from '@learn-to-win/common/features/Enrollments/enrollmentSlice';
import {
  getLearningItemEnrollment,
  updateCardEnrollment,
  updateCardEnrollmentStartedAt,
  updateCourseEnrollmentCompletedAt,
  updateCourseEnrollmentStartedAt,
  updateLearningEnrollment,
} from '@learn-to-win/common/features/Enrollments/enrollmentService';
import { Card } from '@learn-to-win/common/features/Cards/cardTypes';
import { getEnrollmentIdFromEnrollmentIRI } from '@learn-to-win/common/features/Enrollments/utils';
import { useLearningItem } from '@learn-to-win/common/hooks/useLearningItem';
import styles from './LearnerLesson.styles';
import { Button } from '@ant-design/react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import ProgressBar from '../ProgressBar';
import MenuUnfoldOutlined from '../../icons/MenuUnfoldOutlined.svg';
import { SafeArea } from '../../components/SafeArea';
import { ActivityIndicator } from '../../components/ActivityIndicator/ActivityIndicator';
import { CardCompletionCheckProvider } from '@learn-to-win/common/hooks/CardCompletionCheck';
import { PortalProvider } from '@gorhom/portal';
import { CardType } from '@learn-to-win/common/constants';
import { AuthoringCardPropsProvider } from '@learn-to-win/common/hooks/AuthoringCardProps';

export function LearnerLesson({ route, navigation }) {
  const { learningItemEnrollmentId, invitationId } = route.params || {};
  const [currentIndex, setCurrentIndex] = useState(0);
  const { seconds: elapsedItemTime, resetTimer } = useInterval();
  const dispatch = useDispatch();
  const { learningItemLoading, learningItemError, learningItemData } =
    useLearningItem(learningItemEnrollmentId);

  const {
    cards: data,
    error: cardsError,
    loading: cardsLoading,
  } = useSelector((state) => state.card);
  const { error, loading, cardEnrollments } = useSelector(
    (state) => state.enrollment,
  );

  const { mutate: mutateLearningEnrollment } = useMutation<
    unknown,
    unknown,
    { lastCard: boolean }
  >({
    mutationFn: async ({ lastCard }) => {
      let date = null;
      let startedAt = null;
      if (!learningItemEnrollmentId) {
        return;
      }

      if (lastCard) {
        date = new Date().toISOString();
      }

      // dont update startedAt on first page render elapsedItemTime
      if (currentIndex === 0 && elapsedItemTime !== 0) {
        startedAt = new Date().toISOString();
      }

      await updateLearningEnrollment({
        learningItemEnrollmentId,
        completedAt: date,
        startedAt,
        elapsedSec: elapsedItemTime,
      });
    },
  });

  const { mutate: mutateCourseEnrollment } = useMutation<
    unknown,
    unknown,
    { lastCard: boolean }
  >({
    mutationFn: async ({ lastCard }) => {
      if (!learningItemEnrollmentId) {
        return;
      }
      const date = new Date().toISOString();

      const learningItemData = await getLearningItemEnrollment(
        learningItemEnrollmentId,
      );
      const courseItemEnrollmentId = getEnrollmentIdFromEnrollmentIRI(
        learningItemData?.courseEnrollment,
      );

      if (currentIndex === 0) {
        await updateCourseEnrollmentStartedAt({
          courseItemEnrollmentId,
          startedAt: date,
        });
      }

      if (lastCard) {
        await updateCourseEnrollmentCompletedAt({
          courseItemEnrollmentId,
        });
      }
    },
  });

  const { mutate: mutateCardEnrollment } = useMutation<
    unknown,
    unknown,
    { card: Card }
  >({
    mutationFn: async ({ card }) => {
      if (!learningItemEnrollmentId) {
        return;
      }

      const date = new Date().toISOString();
      const cardEnrollmentId = cardEnrollments?.find(
        (cardEnrollment) => cardEnrollment.cardId === card?.id,
      )?.id;

      // set startedAt for next card
      if (data?.length !== currentIndex + 1) {
        const nextCardId = data?.[currentIndex + 1]?.id;
        const nextCardEnrollmentId = cardEnrollments?.find(
          (cardEnrollment) => cardEnrollment.cardId === nextCardId,
        )?.id;

        await updateCardEnrollmentStartedAt({
          cardEnrollmentId: nextCardEnrollmentId,
          startedAt: date,
        });
      }

      // set completedAt & elapsedSec for current card
      await updateCardEnrollment({
        cardEnrollmentId,
        completedAt: date,
        elapsedSec: elapsedItemTime,
      });
    },
    onSuccess: () => {
      dispatch(
        getCardsEnrollmentAction({
          learningItemEnrollmentId,
        }),
      );
    },
  });

  const exitLearningItem = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  useEffect(() => {
    dispatch(
      fetchAndCreateEnrollments({
        learningItemEnrollmentId,
      }),
    );
    return () => {
      if (learningItemEnrollmentId) {
        mutateLearningEnrollment({ lastCard: false });
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const nextCard = useCallback(() => {
    if (currentIndex < data?.length - 1) {
      setCurrentIndex(() => currentIndex + 1);
    }
    resetTimer();
  }, [currentIndex, data?.length, resetTimer]);

  const prevCard = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(() => currentIndex - 1);
    }
    resetTimer();
  }, [currentIndex, resetTimer]);

  const updateOnContentSlide = useCallback(
    (lastCard: boolean, card: Card) => {
      return () => {
        mutateCardEnrollment({ card });
        mutateLearningEnrollment({ lastCard });
        mutateCourseEnrollment({ lastCard });
        nextCard();
      };
    },
    [
      nextCard,
      mutateLearningEnrollment,
      mutateCardEnrollment,
      mutateCourseEnrollment,
    ],
  );
  const cardLength = data.length;

  const displayCards = useMemo(() => {
    return data?.map((card: Card, idx: number) => {
      let onFinish = updateOnContentSlide(false, card);
      if (idx === cardLength - 2) {
        onFinish = updateOnContentSlide(true, card);
      }
      return (
        <CardCompletionCheckProvider key={card.id} cardId={card.id} card={card}>
          <AuthoringCardPropsProvider onPrev={prevCard} onFinish={onFinish}>
            <AuthoringCard
              card={card}
              onPrev={prevCard}
              onFinish={onFinish}
              cardType={card.type}
            />
          </AuthoringCardPropsProvider>
        </CardCompletionCheckProvider>
      );
    });
  }, [cardLength, data, prevCard, updateOnContentSlide]);

  if (!(learningItemEnrollmentId && invitationId)) {
    return (
      <View>
        <Text>Params learningItemEnrollmentId and invitationId required</Text>
        <Text>
          LIEI:{learningItemEnrollmentId}, II: {invitationId}
        </Text>
      </View>
    );
  }

  const cardCount = displayCards?.length;
  return (
    <PortalProvider>
      <SafeArea centerContent>
        {cardsLoading || loading || learningItemLoading ? (
          <View>
            <ActivityIndicator />
          </View>
        ) : error || cardsError || learningItemError ? (
          <View>
            <Text>{error}</Text>
          </View>
        ) : (
          <>
            <View style={styles.cardContainer}>
              <ProgressBar cardCount={cardCount} currentIndex={currentIndex} />
              <View style={styles.headerContainer}>
                <Button
                  style={styles.menuButton}
                  type='ghost'
                  onPress={() => {
                    navigation.navigate('LessonDetails', {
                      learningItemEnrollmentId,
                      invitationId,
                      currentIndex,
                    });
                  }}>
                  <MenuUnfoldOutlined height={24} width={24} />
                </Button>
                <Text style={styles.learningItemName}>
                  {learningItemData?.name}
                </Text>
                <Button
                  style={styles.menuButton}
                  type='ghost'
                  onPress={exitLearningItem}>
                  <Icon name='close' style={styles.buttonIcon} />
                </Button>
              </View>
            </View>
            <CardCarousel currentIndex={currentIndex}>
              {displayCards}
            </CardCarousel>
          </>
        )}
      </SafeArea>
    </PortalProvider>
  );
}
