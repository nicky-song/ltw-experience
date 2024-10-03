import { useCallback, useMemo } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { useAppSelector as useSelector } from '../../hooks/reduxHooks';
import { Card } from '@learn-to-win/common/features/Cards/cardTypes';
import { useLearningItem } from '@learn-to-win/common/hooks/useLearningItem';
import styles from './LessonDetails.styles';
import { Button } from '@ant-design/react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import MoreInfo from '../../components/MoreInfo/MoreInfo';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function LessonDetails({ route, navigation }) {
  const { learningItemEnrollmentId, invitationId, currentIndex } = route.params;

  const { learningItemLoading, learningItemError, learningItemData } =
    useLearningItem(learningItemEnrollmentId);

  const {
    cards: data,
    error: cardsError,
    loading: cardsLoading,
  } = useSelector((state) => state.card);
  const { error, loading } = useSelector((state) => state.enrollment);

  const returnToLearningItem = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const cardLength = data.length;

  const displayCards = useMemo(() => {
    return data?.map((card: Card, idx: number) => {
      const textStyleModifier =
        idx > currentIndex ? styles.cardTitleGray : null;
      return (
        <View key={card?.id} style={styles.cardRow}>
          <Icon name='tablet1' style={[styles.tabletIcon, textStyleModifier]} />
          <Text style={[styles.cardTitle, textStyleModifier]}>
            {card?.title}
          </Text>
          {currentIndex === idx && (
            <Text style={styles.youAreHere}>You're Here</Text>
          )}
        </View>
      );
    });
  }, [currentIndex, data]);

  const insets = useSafeAreaInsets();

  if (!learningItemEnrollmentId || !invitationId) {
    return (
      <View>
        <Text>Params learningItemEnrollmentId and invitationId required</Text>
        <Text>
          LIEI:{learningItemEnrollmentId}, II: {invitationId}
        </Text>
      </View>
    );
  }

  return (
    <>
      {cardsLoading || loading || learningItemLoading ? (
        <View>
          <ActivityIndicator size='large' color='#6FC07A' />
        </View>
      ) : error || cardsError || learningItemError ? (
        <View>
          <Text>{error}</Text>
        </View>
      ) : (
        <View style={[styles.page, { paddingBottom: insets.bottom }]}>
          <View style={styles.lessonDetailsContainer}>
            <View style={[styles.headerContainer, { paddingTop: insets.top }]}>
              <View style={styles.lessonDetailsBlock}>
                <Text style={styles.lessonDetails}>Lesson Details</Text>
              </View>
              <Button
                style={styles.menuButton}
                type='ghost'
                onPress={returnToLearningItem}>
                <Icon name='close' style={styles.buttonIcon} />
              </Button>
            </View>
            <View style={styles.lessonTitleContainer}>
              <View style={styles.placeHolderImage}></View>
              <Text style={styles.learningItemName}>
                {learningItemData?.name}
              </Text>
            </View>
            <View style={styles.lessonDescription}>
              <MoreInfo
                text={learningItemData?.description}
                linesToTruncate={3}
                textStyle={styles.description}
              />
            </View>
          </View>
          <ScrollView>{displayCards}</ScrollView>
        </View>
      )}
    </>
  );
}
