import { Link, useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { Button, Pagination, Result, Space, Spin } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import Title from '@components/Typography/Title';
import React from 'react';
import './ai-quiz.scss';
import { serializeCard } from '@components/RichText/helpers';
import {
  CardSpacer,
  MultipleChoiceQuizCard,
  Question,
  randomID,
} from './Helpers.poc';
import { AI_SERVICE_URL } from '@/constants/envVariables';
import { getCardsAPI } from '@learn-to-win/common/features/Cards/cardService';

type Quiz = Question[];
type QuizCard = Question & { id: string };

export function AIQuizPoc() {
  const { learningItemId } = useParams();

  // fetch a quiz from the learning item
  const {
    data: quiz,
    isLoading,
    isError,
    refetch,
  } = useQuery(
    ['getQuizFromLearningItem', learningItemId],
    async () => {
      const cards = await getCardsAPI({
        learningItemId,
      });

      const cardString = cards.map((card) => serializeCard(card)).join('\n\n');

      const quizRaw = (await (
        await fetch(`${AI_SERVICE_URL}/generateQuiz`, {
          method: 'POST',
          body: JSON.stringify({
            slides: cardString,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        })
      ).json()) as Quiz;

      return quizRaw.map((question) => ({
        ...question,
        id: randomID(),
      })) as QuizCard[];
    },
    {
      retry: false,
      refetchInterval: false,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  );

  const [currentSlideIndex, setCurrentSlideIndex] = React.useState(1);

  const cardsToShow = quiz?.slice(
    Math.max(currentSlideIndex - 2, 0),
    Math.min(currentSlideIndex + 1, quiz?.length),
  );

  const currentSlideId = quiz?.[currentSlideIndex - 1]?.id;

  const isFirstCardSelected = currentSlideIndex === 1;
  const isLastCardSelected = currentSlideIndex === quiz?.length;

  return (
    <div className={'ai-quiz'}>
      <div className={'ai-quiz__header'}>
        <Link to={`/learning_item/${learningItemId}`}>
          <Button
            htmlType='button'
            shape={'default'}
            disabled={false}
            size={'middle'}
            type={'primary'}
            className='back-button'
            icon={<ArrowLeftOutlined />}
          />
        </Link>
        <Title
          classes={'header-container__text'}
          level={5}
          data-testid='edit-lesson'>
          Editing Quiz
        </Title>
      </div>

      {isLoading && (
        <Space
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
          }}>
          <Spin size={'large'} />
        </Space>
      )}
      {(isError || quiz?.length === 0) && (
        <Result
          status='warning'
          title='There are some problems generating a quiz.'
          extra={
            <Button type='primary' key='console' onClick={() => refetch()}>
              Try again
            </Button>
          }
        />
      )}
      {quiz && (
        <div className={'ai-quiz__content'}>
          <div
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
            }}>
            <Space direction='horizontal' size={64}>
              {isFirstCardSelected && <CardSpacer />}
              {cardsToShow?.map((card) => (
                <MultipleChoiceQuizCard
                  key={card.id}
                  question={card}
                  isDisabled={currentSlideId !== card.id}
                  onClick={() => {
                    const slideIndex =
                      quiz.findIndex((q) => q.id === card.id) + 1;
                    setCurrentSlideIndex(slideIndex);
                  }}
                />
              ))}
              {isLastCardSelected && <CardSpacer />}
            </Space>
          </div>
          <Pagination
            current={currentSlideIndex}
            onChange={(e) => setCurrentSlideIndex(e)}
            showTitle={true}
            pageSize={3}
            total={(quiz?.length ?? 1) * 3} //total * 3 as we show 3 cards on a page
            showSizeChanger={false}
            style={{
              margin: '50px auto',
              width: 'fit-content',
            }}
          />
        </div>
      )}
    </div>
  );
}
