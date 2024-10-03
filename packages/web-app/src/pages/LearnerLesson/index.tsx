import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  useAppDispatch as useDispatch,
  useAppSelector as useSelector,
} from '@hooks/reduxHooks';
import { useMutation } from 'react-query';
import { Alert, Progress } from 'antd';
import { CloseOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import AuthoringCard from '@components/AuthoringCard';
import Button from '@components/Button';
import CardCarousel from '@components/CardCarousel';
import {
  getLearningItemEnrollment,
  updateCardEnrollment,
  updateCardEnrollmentStartedAt,
  updateCourseEnrollmentCompletedAt,
  updateCourseEnrollmentStartedAt,
  updateLearningEnrollment,
} from '@learn-to-win/common/features/Enrollments/enrollmentService';
import {
  fetchAndCreateEnrollments,
  getCardsEnrollmentAction,
} from '@learn-to-win/common/features/Enrollments/enrollmentSlice';
import { GetLearningItemEnrollmentParams } from '@learn-to-win/common/features/Enrollments/enrollmentTypes';
import { Card } from '@learn-to-win/common/features/Cards/cardTypes';
import { lastContentCardIndex, maxMarkerAmount } from './constants';
import { useInterval } from '@learn-to-win/common/hooks/useInterval';
import Text from '@components/Typography/Text';
import { CardDrawer } from './CardDrawer';
import './index.scss';
import { useLearningItem } from '@learn-to-win/common/hooks/useLearningItem';
import { getEnrollmentIdFromEnrollmentIRI } from '@learn-to-win/common/features/Enrollments/utils';
import ProgressMarkers from '@/components/ProgressMarkers';
import Spinner from '@/components/Spinner';
import { CardCompletionCheckProvider } from '@learn-to-win/common/hooks/CardCompletionCheck';
import { AuthoringCardPropsProvider } from '@learn-to-win/common/hooks/AuthoringCardProps';

const LearnerLesson: React.FC = () => {
  const { learningItemEnrollmentId, invitationId } = useParams();
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();
  const [detailsOpen, setDetailsOpen] = useState(false);
  const dispatch = useDispatch();
  const { seconds: elapsedItemTime, resetTimer } = useInterval();
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

      if (currentIndex !== 0 && currentIndex >= data?.length - 1) {
        exitLearningItem();
      }
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
        cardEnrollmentId: cardEnrollmentId,
        completedAt: date,
        elapsedSec: elapsedItemTime,
      });
    },
    onSuccess: () => {
      dispatch(
        getCardsEnrollmentAction({
          learningItemEnrollmentId: learningItemEnrollmentId as string,
        }),
      );
    },
  });

  useEffect(() => {
    dispatch(
      fetchAndCreateEnrollments({
        learningItemEnrollmentId,
      } as GetLearningItemEnrollmentParams),
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
  }, [currentIndex, data, resetTimer]);

  const prevCard = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(() => currentIndex - 1);
    }
    resetTimer();
  }, [currentIndex, resetTimer]);

  const exitLearningItem = useCallback(() => {
    navigate(`/learner/invitation/${invitationId}/details`);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invitationId, navigate]);

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

  const displayCards = useMemo(() => {
    return data?.map((card: Card, idx: number) => {
      let onFinish = updateOnContentSlide(false, card);
      if (idx === data?.length - lastContentCardIndex) {
        onFinish = updateOnContentSlide(true, card);
      }
      return (
        <Fragment key={card?.id}>
          <CardCompletionCheckProvider cardId={card?.id} card={card}>
            <AuthoringCardPropsProvider onPrev={prevCard} onFinish={onFinish}>
              <AuthoringCard
                card={card}
                onPrev={prevCard}
                onFinish={onFinish}
                cardType={card.type}
              />
            </AuthoringCardPropsProvider>
          </CardCompletionCheckProvider>
        </Fragment>
      );
    });
  }, [data, prevCard, updateOnContentSlide]);

  return (
    <Spinner spinning={cardsLoading || loading || learningItemLoading}>
      {!!(error || cardsError || learningItemError) && (
        <Alert message={error} type='error' description='An error occurred' />
      )}
      <div className={'learning-details'}>
        <div className='learning-details__nav'>
          <div className='learning-details__menu'>
            <Button
              htmlType='button'
              size='large'
              type='ghost'
              classes={'learning-details__menu-button'}
              data-testid={'opn-lsn-details'}
              onClick={() => {
                setDetailsOpen(true);
              }}
              icon={<MenuUnfoldOutlined />}></Button>
            <Text classes='learning-details__lesson-title'>
              {learningItemData?.name}
            </Text>
          </div>
          <div className='learning-details__progress-markers'>
            {displayCards?.length < maxMarkerAmount ? (
              <ProgressMarkers currentIndex={currentIndex} cardList={data} />
            ) : (
              <div className='learning-details__progress-bar'>
                <Progress
                  percent={Math.floor(
                    (currentIndex / (displayCards?.length - 1)) * 100,
                  )}
                  showInfo={false}></Progress>
                <p>
                  {currentIndex + 1}/{displayCards?.length}
                </p>
              </div>
            )}
          </div>
          <Button
            htmlType='button'
            classes={'learning-details__exit'}
            size='large'
            type='ghost'
            onClick={exitLearningItem}
            icon={<CloseOutlined />}></Button>
        </div>
        <CardCarousel currentIndex={currentIndex}>{displayCards}</CardCarousel>
        <div className='learning-details__carousel-container'>
          <CardDrawer
            currentIndex={currentIndex}
            learningData={learningItemData}
            cardList={data}
            open={detailsOpen}
            setOpen={setDetailsOpen}
          />
        </div>
      </div>
    </Spinner>
  );
};

export default LearnerLesson;
