import ItemEditorLayout from '@/layouts/ItemEditorLayout';
import { Link, useParams } from 'react-router-dom';
import {
  useAppSelector,
  useAppDispatch as useDispatch,
} from '@hooks/reduxHooks';
import ExpandableListBlock from '@components/ContentBlock/ExpandableListBlock';
import {
  Card,
  ContentBlockType,
} from '@learn-to-win/common/features/Cards/cardTypes';
import './index.scss';
import Text from '@components/Typography/Text';
import Button from '@components/Button';
import { useEffect, useMemo, useState } from 'react';
import {
  getCardsAction,
  updateCardAction,
} from '@learn-to-win/common/features/Cards/cardSlice';
import SelectOptionBlock from '@components/ContentBlock/KnowledgeCheckBlock/SelectOptionBlock';
import CardFeedback from '@components/CardFeedback';
import { FeedBackType } from '@learn-to-win/common/constants/cardFeedbackType';
import { Tooltip } from 'antd';
import {
  InfoCircleOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
} from '@ant-design/icons';
import { feedbackTooltipText } from './constants';
import FeedbackOverlay from '@components/CardFeedback/FeedbackOverlay';
import classNames from 'classnames';
import { CardType } from '@learn-to-win/common/constants';

const FocusModeEditor = () => {
  const {
    learningItemId,
    cardId,
    blockId = '',
    learningItemType = 'lesson',
  } = useParams();
  const [editTitle, setEditTitle] = useState<string>();
  const [feedbackType, setFeedbackType] = useState<FeedBackType>(null);
  const [confidenceCheck, setConfidenceCheck] = useState<boolean>(true);
  const dispatch = useDispatch();
  const { cards = [] } = useAppSelector((state) => state.card);
  const IconTagName = confidenceCheck ? EyeOutlined : EyeInvisibleOutlined;

  useEffect(() => {
    if (cardId) {
      dispatch(getCardsAction({ learningItemId, cardId }));
    }
  }, [cardId, dispatch, learningItemId]);

  useEffect(() => {
    const card = cards.find((card: Card) => card.id === cardId);

    if (
      card?.type == CardType.QUIZ_CARD &&
      card?.confidenceCheck !== undefined
    ) {
      setConfidenceCheck(card?.confidenceCheck);
    }
  }, [cards, cardId]);

  const card = cards.find((card: Card) => card.id === cardId);
  const block = card?.json?.contentBlocks.find(
    (block) => block.id === blockId,
  ) as ContentBlockType;
  const isKnowledgeCheck =
    block?.type === 'multipleChoice' || block?.type === 'trueFalse';

  const getBlock = useMemo(() => {
    if (!card) {
      return;
    }
    const type = block?.type;
    switch (type) {
      case 'expandableList':
        setEditTitle('Edit Expandable List');
        return (
          <ExpandableListBlock
            id={blockId}
            key={blockId}
            block={block}
            card={card}
            editing
          />
        );
      case 'multipleChoice':
        setEditTitle('Editing Multiple Choice');
        return (
          <SelectOptionBlock
            id={blockId}
            showEditor={false}
            key={blockId}
            block={block}
            card={card}
            editing
          />
        );
      case 'trueFalse':
        setEditTitle('Editing True or False');
        return (
          <SelectOptionBlock
            id={blockId}
            showEditor={false}
            key={blockId}
            block={block}
            card={card}
            editing
          />
        );
      default:
        // 404 page goes here
        return;
    }
  }, [blockId, card, block]);

  const updateConfidenceCheck = (confidenceCheck: boolean) => {
    const newCard = {
      ...(card as Card),
      confidenceCheck: confidenceCheck,
    };
    dispatch(updateCardAction(newCard));
  };

  return (
    <ItemEditorLayout
      learningItemType={learningItemType}
      learningItemId={learningItemId}>
      <div className={'block-editing-page'}>
        {isKnowledgeCheck && (
          <div className='block-editing-page__feedback-controls'>
            <Button
              htmlType='button'
              size='large'
              type={feedbackType === null ? 'primary' : 'ghost'}
              onClick={() => {
                setFeedbackType(null);
              }}>
              Question
            </Button>
            {card?.type == CardType.QUIZ_CARD && (
              <Button
                htmlType='button'
                size='large'
                type={feedbackType === 'confidence' ? 'primary' : 'ghost'}
                onClick={() => {
                  setFeedbackType('confidence');
                }}>
                <span>
                  {' '}
                  Confidence
                  <IconTagName
                    className='block-editing-page__feedback-controls__confidence-icon'
                    onClick={() => {
                      updateConfidenceCheck(!confidenceCheck);
                      setConfidenceCheck(!confidenceCheck);
                    }}
                  />
                </span>
              </Button>
            )}
            <Button
              htmlType='button'
              size='large'
              type={feedbackType === 'correct' ? 'primary' : 'ghost'}
              onClick={() => {
                setFeedbackType('correct');
              }}>
              Correct
            </Button>
            <Button
              htmlType='button'
              size='large'
              type={feedbackType === 'incorrect' ? 'primary' : 'ghost'}
              onClick={() => {
                setFeedbackType('incorrect');
              }}>
              Incorrect
            </Button>
          </div>
        )}
        <div>
          <div className={'block-editing-page__header'}>
            <Text classes={'block-editing-page__title'}>{editTitle}</Text>
            <Link
              className='block-editing-page__done-btn'
              data-testid='content-block-editor-done'
              to={`/learning_item/${learningItemId}/card/${cardId}`}>
              <Button htmlType='button' size='small' type={'primary'}>
                Done
              </Button>
            </Link>
          </div>
          <div className={'block-editing-page__card-wrapper'}>
            <div className={'block-editing-page__card-scroll'}>
              <div className={'block-editing-page__card'}>{getBlock}</div>
            </div>
            {isKnowledgeCheck && (
              <div>
                <CardFeedback
                  feedBack={feedbackType}
                  blockId={blockId}
                  editable
                  confidenceCheck={confidenceCheck}>
                  <FeedbackOverlay
                    feedBack={feedbackType}
                    isConfidenceCheckEnabled={confidenceCheck}
                    onClick={() => {
                      setFeedbackType(null);
                    }}></FeedbackOverlay>
                </CardFeedback>
              </div>
            )}
          </div>
          {isKnowledgeCheck && (
            <Tooltip
              className={classNames({
                'block-editing-page__tooltip': true,
                'block-editing-page--tooltip-disabled': feedbackType === null,
              })}
              title={feedbackTooltipText(feedbackType)}>
              <InfoCircleOutlined />
            </Tooltip>
          )}
        </div>
      </div>
    </ItemEditorLayout>
  );
};

export default FocusModeEditor;
