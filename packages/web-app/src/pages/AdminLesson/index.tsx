import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Pagination, PaginationProps, Space, Tooltip } from 'antd';
import './index.scss';
import {
  ArrowLeftOutlined,
  ExperimentOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  createCard as createCardAPI,
  deleteCard as deleteCardAPI,
  updateCard as updateCardAPI,
} from '@learn-to-win/common/features/Cards/cardService';
import { useMutation, useQuery } from 'react-query';
import AuthoringCard from '@components/AuthoringCard';
import Title from '@components/Typography/Title';
import {
  Card,
  CreateCardValues,
  TemplateType,
} from '@learn-to-win/common/features/Cards/cardTypes';
import { useAppDispatch, useAppSelector } from '@hooks/reduxHooks';
import {
  getCardsAction,
  getCardsAndSetSelectedCardAction,
  setSelectedCardIdAction,
} from '@learn-to-win/common/features/Cards/cardSlice';
import { NewCardDrawer } from './NewCardDrawer/NewCardDrawer';
import { DeletionConfirmationScreen } from './DeletionConfirmationScreen/DeletionConfirmationScreen';
import { CardOptions } from './CardOptions/CardOptions';
import { getLearningItem } from '@learn-to-win/common/features/LearningItems/learningItemService';
import { getIdFromUrl } from '@learn-to-win/common/utils/entityId';
import { getContentBlockByTemplateType } from '@learn-to-win/common/features/Cards/cardTemplates';
import { DrawerContext } from './context';
import { CardSwapper } from './CardSwapper/CardSwapper';
import { toProperCase } from '@learn-to-win/common/utils/getLearningItemTypeProperCase';
import { CardType, LearningItemType } from '@learn-to-win/common/constants';

const AdminLesson: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [learningItemType, setLearningItemType] = useState<LearningItemType>(
    LearningItemType.LESSON,
  );
  const [showDeletionConfirmation, setShowDeletionConfirmation] =
    useState(false);
  const { learningItemId, cardId } = useParams();
  const learningItemTypeProperCase = toProperCase(learningItemType);
  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  const { selectedCardId, cards } = useAppSelector((state) => state.card);
  const getSelectedCard = useCallback(() => {
    return cards.find((card) => selectedCardId === card.id) as Card;
  }, [cards, selectedCardId]);

  const currentSlideIndex =
    Math.max(
      0,
      cards.findIndex((card) => card.id === selectedCardId),
    ) + 1;
  // Get course id from learning item object
  const { data: courseId } = useQuery(
    ['getLearningItem', learningItemId],
    async () => {
      const { data } = await getLearningItem({ learningItemId });
      setLearningItemType(data.type as LearningItemType);
      return getIdFromUrl(data.course);
    },
  );

  const { mutate } = useMutation<{ id: string }, unknown, CreateCardValues>({
    mutationFn: createCardAPI,
    onSuccess: (data) => {
      if (data?.id) {
        dispatch(
          getCardsAndSetSelectedCardAction({
            learningItemId,
            selectedCardId: data.id,
          }),
        );
      }
    },
  });

  const { mutate: mutateCardDeletion } = useMutation<unknown, unknown, string>({
    mutationFn: async (cardId) => {
      await deleteCardAPI(cardId);
    },
    onSuccess: () => {
      dispatch(
        getCardsAndSetSelectedCardAction({
          learningItemId,
          selectedCardId: cards[currentSlideIndex - 2].id,
        }),
      );
      setShowDeletionConfirmation(false);
    },
  });

  const { mutate: mutateCard } = useMutation<
    { id: string },
    unknown,
    Partial<Card> & { id: string }
  >({
    mutationFn: async (updatedCard) => {
      return await updateCardAPI(updatedCard);
    },
    onSuccess: (data) => {
      if (data?.id) {
        dispatch(
          getCardsAndSetSelectedCardAction({
            learningItemId,
            selectedCardId: data.id,
          }),
        );
      }
    },
  });

  const updateCardSequence = useCallback(
    (step: number) => {
      const currentCard = getSelectedCard();
      const newSequenceOrder = currentCard.sequenceOrder + step;

      const updatedCard = {
        ...currentCard,
        sequenceOrder: newSequenceOrder,
      };
      mutateCard(updatedCard);
    },
    [mutateCard, getSelectedCard],
  );

  const handleSetCurrentSlide = useCallback(
    (currentSlide: number) => {
      const cardId = cards[currentSlide - 1]?.id;
      navigate(`/learning_item/${learningItemId}/card/${cardId}`);
      dispatch(setSelectedCardIdAction(cardId));
    },
    [dispatch, cards, learningItemId, navigate],
  );

  const createCard = useCallback(
    (cardValues: CreateCardValues) => {
      mutate(cardValues);
    },
    [mutate],
  );

  const deleteCard = useCallback(() => {
    mutateCardDeletion(selectedCardId as string);
  }, [mutateCardDeletion, selectedCardId]);

  const setDeletionConfirmationDisplay = useCallback(
    (showDeletionConfirmation: boolean) => {
      setShowDeletionConfirmation(showDeletionConfirmation);
    },
    [setShowDeletionConfirmation],
  );

  const createCardWithTemplate = (type: TemplateType) => {
    let title = '';
    let cardType: string = learningItemType;

    switch (type) {
      case 'text':
        title = 'Text Card';
        break;
      case 'blank':
        title = 'Blank Card';
        break;
      case 'media':
        title = 'Media Card';
        break;
      case 'expandableList':
        title = 'Expandable List Card';
        break;
      case 'trueFalse':
        title = 'True or False Card';
        if (learningItemType === LearningItemType.LESSON) {
          cardType = CardType.KNOWLEDGE_CARD;
        }
        break;
      case 'multipleChoice':
        title = 'Multiple Choice Card';
        if (learningItemType === LearningItemType.LESSON) {
          cardType = CardType.KNOWLEDGE_CARD;
        }
        break;
      default:
        title = 'Default Title';
    }
    const currentCard = getSelectedCard();
    const cardValues: CreateCardValues = {
      title,
      type: cardType as CardType,
      sequenceOrder: currentCard.sequenceOrder + 1,
      learningItemId: learningItemId,
      confidenceCheck: cardType === CardType.QUIZ_CARD,
      json: {
        description: '',
        contentBlocks: getContentBlockByTemplateType(type),
        version: '1',
        templateType: type,
      },
    };
    createCard(cardValues);
  };

  // Fetch cards based on route
  useEffect(() => {
    dispatch(getCardsAction({ learningItemId, cardId }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cardsToShow = cards?.slice(
    Math.max(currentSlideIndex - 2, 0),
    Math.min(currentSlideIndex + 1, cards?.length),
  );

  const cardList = useMemo(
    () =>
      cardsToShow?.map((card: Card) => {
        // if there is flag for deletion, and the card is selected, show the new component (modal)
        if (showDeletionConfirmation && card.id === selectedCardId) {
          return (
            <DeletionConfirmationScreen
              key={card.id}
              closeDeleteConfirmationScreen={setDeletionConfirmationDisplay}
              deleteCard={deleteCard}
            />
          );
        }
        return <AuthoringCard card={card} key={card.id} />;
      }),
    [
      cardsToShow,
      showDeletionConfirmation,
      selectedCardId,
      setDeletionConfirmationDisplay,
      deleteCard,
    ],
  );

  const itemRender: PaginationProps['itemRender'] = (
    _,
    type,
    originalElement: React.ReactNode,
  ) => {
    const {
      props: { children },
    } = originalElement as React.ReactElement;

    if (type === 'page' && children > 1 && children < cards.length) {
      return <span>{children - 1}</span>;
    }

    if (type === 'page' && children == 1) {
      return <a>Title</a>;
    }

    if (type === 'page' && children == cards.length) {
      return <a>End</a>;
    }
    if (type === 'prev' || type === 'next') {
      return null;
    }

    return originalElement;
  };

  const isFirstCardSelected = currentSlideIndex === 1;
  const isLastCardSelected = currentSlideIndex === cards?.length;
  const contextValues = useMemo(
    () => ({ isDrawerOpen, setIsDrawerOpen, learningItemId, learningItemType }),
    [isDrawerOpen, setIsDrawerOpen, learningItemId, learningItemType],
  );
  return (
    <div className='header-container'>
      <div className='header-container__title-container'>
        <Link to={`/admin/courses/${courseId}/details`}>
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
          Editing {learningItemTypeProperCase}
        </Title>
        <Tooltip title={'Generate a quiz with AI.'}>
          <Link
            to={`/learning_item/${learningItemId}/quiz`}
            className={'header-container__quiz-button'}>
            <Button
              htmlType='button'
              shape={'default'}
              disabled={false}
              size={'middle'}
              icon={<ExperimentOutlined />}
            />
          </Link>
        </Tooltip>
      </div>
      <div className='header-container__body-container'>
        <div className='header-container__card-container'>
          <CardOptions
            createCardCopy={createCard}
            displayDeletionConfirmationScreen={setDeletionConfirmationDisplay}
          />
          <CardSwapper updateCardSequence={updateCardSequence} />
          <Space direction='horizontal' size={64}>
            {isFirstCardSelected && <CardSpacer />}
            {cardList}
            {isLastCardSelected && <CardSpacer />}
          </Space>
          <Pagination
            current={currentSlideIndex}
            onChange={(e) => handleSetCurrentSlide(e)}
            className='header-container__pagination'
            showTitle={true}
            pageSize={3}
            total={(cards?.length ?? 1) * 3} //total * 3 as we show 3 cards on a page
            showSizeChanger={false}
            itemRender={itemRender}
          />
        </div>

        <Tooltip title='Add New Card'>
          <div className='header-container__card-create-container'>
            <Button
              data-testid='createCardButton'
              size='large'
              type='primary'
              shape='circle'
              icon={<PlusOutlined />}
              className='header-container__create-card'
              onClick={() => setIsDrawerOpen(true)}
            />
          </div>
        </Tooltip>
      </div>
      <DrawerContext.Provider value={contextValues}>
        <NewCardDrawer
          createCardWithTemplate={createCardWithTemplate}
          learningItemType={learningItemTypeProperCase}
        />
      </DrawerContext.Provider>
    </div>
  );
};

const CardSpacer: React.FC = () => {
  return (
    <div className={'header-container__card-container__card-spacer'}>
      &nbsp;
    </div>
  );
};

export default AdminLesson;
