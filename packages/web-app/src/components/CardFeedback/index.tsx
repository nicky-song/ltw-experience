import React, { useEffect, useMemo, useRef } from 'react';
import './index.scss';
import classNames from 'classnames';
import { FeedBackType } from '@learn-to-win/common/constants/cardFeedbackType';
import { useAppDispatch, useAppSelector } from '@hooks/reduxHooks';
import {
  Card,
  ContentBlockType,
  Feedback,
  KnowledgeCheckBlockType,
  SlateJSON,
  TextContentBlockTypes,
} from '@learn-to-win/common/features/Cards/cardTypes';
import { ContentBlockEditor } from '@components/RichText/ContentBlockEditor';
import { EditorControlType } from '@components/EditorControl';
import { updateCardAction } from '@learn-to-win/common/features/Cards/cardSlice';
import { updateContentBlockInCard } from '@components/ContentBlock/CardHelper';
import Confetti from '@learn-to-win/common/assets/confetti.json';
import Lottie from 'lottie-web';
import ConfidenceCard from './ConfidenceCard';

interface CardFeedbackProps {
  children?: React.ReactNode;
  feedBack?: FeedBackType;
  editable?: boolean;
  blockId: string;
  confidenceCheck?: boolean;
  selectedConfidence?: number;
  onConfidenceSelected?: (confidence: number) => void;
}
const CardFeedback: React.FC<CardFeedbackProps> = ({
  children,
  blockId,
  feedBack,
  editable,
  confidenceCheck = true,
  selectedConfidence,
  onConfidenceSelected,
}: CardFeedbackProps) => {
  const lottieContainer = useRef<HTMLDivElement>(null);
  const { cards, selectedCardId } = useAppSelector((state) => state.card);
  const card = useMemo(
    () => cards.find((card: Card) => card.id === selectedCardId),
    [cards, selectedCardId],
  );
  const block: KnowledgeCheckBlockType = card?.json?.contentBlocks?.find(
    (block: ContentBlockType) => block.id === blockId,
  ) as KnowledgeCheckBlockType;

  useEffect(() => {
    if (!lottieContainer?.current) {
      return;
    }
    const animationItem = Lottie.loadAnimation({
      container: lottieContainer.current as Element,
      renderer: 'svg',
      loop: false,
      autoplay: false,
      name: 'feedback-confetti',
      animationData: Confetti,
    });
    if (feedBack === 'correct') {
      setTimeout(() => {
        animationItem?.play();
      }, 600);
    } else {
      animationItem?.stop();
    }
    return () => {
      animationItem?.destroy();
    };
  }, [feedBack]);

  if (!card || !block) {
    return null;
  }
  return (
    <div className='feedback'>
      {children}
      {feedBack === 'correct' && (
        <div
          data-testid='feedback-celebration'
          className={'feedback__celebration'}
          ref={lottieContainer}></div>
      )}
      <div
        className={classNames({
          'feedback__text-container': true,
          'feedback--correct': feedBack === 'correct',
          'feedback--disable-correct': feedBack !== 'correct',
        })}>
        <FeedbackCard
          card={card}
          block={block}
          editable={editable}
          header={block.correctFeedback.header}
          body={block.correctFeedback.body}
          feedbackType='correct'
        />
      </div>
      <div
        className={classNames({
          'feedback__text-container': true,
          'feedback--incorrect': feedBack === 'incorrect',
          'feedback--disable-incorrect': feedBack !== 'incorrect',
        })}>
        <FeedbackCard
          card={card}
          block={block}
          editable={editable}
          header={block.incorrectFeedback.header}
          body={block.incorrectFeedback.body}
          feedbackType='incorrect'
        />
      </div>
      <div
        className={classNames({
          'feedback__text-container': true,
          'feedback--confidence': feedBack === 'confidence' && confidenceCheck,
          'feedback--disable-confidence':
            !confidenceCheck || feedBack !== 'confidence',
        })}
        data-testid='confidence-card-container'>
        <ConfidenceCard
          editing={editable}
          selectedConfidence={selectedConfidence}
          onConfidenceSelected={onConfidenceSelected}
        />
      </div>
    </div>
  );
};

interface FeedbackCardProps {
  editable?: boolean;
  card: Card;
  block: KnowledgeCheckBlockType;
  header: SlateJSON;
  body: SlateJSON;
  feedbackType: 'correct' | 'incorrect';
}
const FeedbackCard = ({
  block,
  card,
  editable,
  header,
  body,
  feedbackType,
}: FeedbackCardProps) => {
  const dispatch = useAppDispatch();
  const editorCommonProps = {
    blockId: block.id,
    card,
    editable: !!editable,
    blockType: block.type as TextContentBlockTypes,
    editorControlProps: {
      editorType: EditorControlType.bodyText,
      enableMoveControls: false,
      characterCount: 95,
      enableCharacterCount: true,
      enableDelete: false,
      enableSizeControls: false,
      enabled: true,
    },
  };

  const updateFeedbackText = (feedback: Feedback) => {
    const updatedBlock: KnowledgeCheckBlockType = {
      ...block,
    };
    if (feedbackType === 'correct') {
      updatedBlock.correctFeedback = feedback;
    } else if (feedbackType === 'incorrect') {
      updatedBlock.incorrectFeedback = feedback;
    }
    const newCard = updateContentBlockInCard(
      card,
      updatedBlock,
      card?.json?.titleSynced,
    );
    dispatch(updateCardAction(newCard));
  };

  const saveHeader = (richText: SlateJSON) => {
    updateFeedbackText({ header: richText, body });
  };

  const saveBody = (richText: SlateJSON) => {
    updateFeedbackText({ header, body: richText });
  };

  return (
    <div className={'feedback__card'}>
      <ContentBlockEditor
        {...editorCommonProps}
        save={saveHeader}
        editableText={header}
      />
      <ContentBlockEditor
        {...editorCommonProps}
        save={saveBody}
        editableText={body}
      />
    </div>
  );
};

export default CardFeedback;
