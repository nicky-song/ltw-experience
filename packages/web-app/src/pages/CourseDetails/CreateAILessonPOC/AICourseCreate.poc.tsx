import { useNavigate, useParams } from 'react-router-dom';
import { useMutation } from 'react-query';
import { createLearningItem } from '@learn-to-win/common/features/LearningItems/learningItemService';
import {
  getBodyBlock,
  getTitleBlock,
} from '@learn-to-win/common/features/Cards/cardTemplates';
import { UploaderPoc } from './Uploader.poc';
import { Alert, Progress, Space, Spin } from 'antd';
import { useState } from 'react';
import { AI_SERVICE_URL } from '@/constants/envVariables';
import { createCard } from '@learn-to-win/common/features/Cards/cardService';
import { CardType } from '@learn-to-win/common/constants';

type Lesson = {
  title: string;
  slides: {
    title: string;
    content: string;
  }[];
  imageSearchTerms: string;
  imageSearchResults: {
    results: {
      id: string;
      urls: {
        full: string;
        raw: string;
        regular: string;
        small: string;
        thumb: string;
      };
    }[];
  };
};
const LESSON_PROGRESS = 20;

export function AICourseCreatePoc() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  // mutation for generating a lesson
  const { mutate, isLoading, isError } = useMutation<
    unknown,
    unknown,
    { uuid: string }
  >(async ({ uuid }) => {
    setProgress(0);
    const res = await fetch(`${AI_SERVICE_URL}/lessons/${uuid}`);
    const lesson = (await res.json()) as Lesson;
    if (courseId) {
      const learningItem = await createLearningItem({
        type: 'lesson',
        state: 'draft',
        name: lesson.title,
        description: 'Get started with your AI lesson',
        courseId,
      });

      setProgress(LESSON_PROGRESS);

      if (learningItem) {
        // create cards for each slide
        let cardIdx = 1;
        for (const slide of lesson.slides) {
          await createCard({
            title: slide.title,
            type: CardType.LESSON_CARD,
            sequenceOrder: cardIdx,
            learningItemId: learningItem.id,
            confidenceCheck: false,
            json: {
              description: '',
              templateType: 'blank',
              contentBlocks: [
                getTitleBlock('1', slide.title),
                getBodyBlock('2', slide.content),
              ],
              version: '1',
            },
          });
          cardIdx++;
          setProgress(
            LESSON_PROGRESS +
              (cardIdx / lesson.slides.length) * (100 - LESSON_PROGRESS),
          );
          // sleep so we don't get rate limited
          await new Promise((resolve) => setTimeout(resolve, 500));
        }

        // Navigate to course
        navigate('/learning_item/' + learningItem.id);
      }
    }
    return lesson;
  });

  return (
    <>
      {isLoading ? (
        <>
          <Space
            direction='vertical'
            align='center'
            style={{ width: '100%', padding: 20 }}>
            <Spin size='large' />
          </Space>

          <Progress percent={progress} showInfo={false} />
        </>
      ) : (
        <UploaderPoc
          onUploadSuccess={mutate}
          url={`${AI_SERVICE_URL}/createIndex`}
        />
      )}
      {isError && (
        <Alert
          message='Error'
          description='There was an error creating your lesson. Please try again.'
          type='error'
        />
      )}
    </>
  );
}
