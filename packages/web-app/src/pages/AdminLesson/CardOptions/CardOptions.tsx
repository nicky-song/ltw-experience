import React, { useEffect, useState, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@hooks/reduxHooks';
import {
  Card,
  ContentBlockType,
  ContentBlockTypes,
  TemplateType,
} from '@learn-to-win/common/features/Cards/cardTypes';
import { addContentBlockToCard } from '@components/ContentBlock/CardHelper';
import { updateCardAction } from '@learn-to-win/common/features/Cards/cardSlice';
import { Button, Dropdown, Progress, Tooltip } from 'antd';
import { CopyOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import { useDebouncedCallback } from '@/hooks/useDebouncedCallback';
import './card-options.scss';
import { MAX_TITLE_LENGTH, TITLE_TOOL_TIP } from '../constants';
import { CardOptionsFactory } from './CardOptionsFactory';
import { v4 as uuidv4 } from 'uuid';
import {
  getAudioBlock,
  getBodyBlock,
  getExpandableListBlock,
  getImageBlock,
  getMultipleChoiceBlock,
  getSubtitleBlock,
  getTitleBlock,
  getVideoBlock,
} from '@learn-to-win/common/features/Cards/cardTemplates';

type CardOptionsProps = {
  createCardCopy: (newCard: Card) => void;
  displayDeletionConfirmationScreen: (flag: boolean) => void;
};

export const CardOptions: React.FC<CardOptionsProps> = ({
  createCardCopy,
  displayDeletionConfirmationScreen,
}) => {
  const { selectedCardId, cards } = useAppSelector((state) => state.card);
  const dispatch = useAppDispatch();
  const selectedCard = cards.find((card: Card) => selectedCardId === card.id);
  const [cardTitle, setCardTitle] = useState<string>('');
  const [editingTitle, setEditingTitle] = useState<boolean>(false);
  const titleInput = useRef<HTMLInputElement>(null);

  const addContentBlock = (
    type: ContentBlockTypes,
    templateType: TemplateType,
  ) => {
    let contentBlock;
    let index = undefined;
    if (selectedCard) {
      switch (type) {
        case 'title':
          contentBlock = getTitleBlock(uuidv4());
          break;
        case 'subtitle':
          contentBlock = getSubtitleBlock(uuidv4());
          break;
        case 'body':
          contentBlock = getBodyBlock(uuidv4());
          break;
        case 'image':
          contentBlock = getImageBlock(uuidv4());
          break;
        case 'video':
          contentBlock = getVideoBlock(uuidv4());
          break;
        case 'audio':
          contentBlock = getAudioBlock(uuidv4());
          break;
        case 'expandableList':
          contentBlock = getExpandableListBlock(uuidv4());
          break;
        case 'multipleChoice':
          contentBlock = getMultipleChoiceBlock(uuidv4());
          break;
        default:
          contentBlock = {};
          break;
      }
      if (
        templateType &&
        ['multipleChoice', 'trueFalse'].includes(templateType)
      ) {
        index = 0;
      }
      const newCard = addContentBlockToCard(
        selectedCard,
        contentBlock as ContentBlockType,
        index,
      );
      dispatch(updateCardAction(newCard));
    }
  };

  const handleCopyCard = () => {
    if (selectedCard) {
      const newCard = {
        ...selectedCard,
        sequenceOrder: selectedCard.sequenceOrder + 1,
      };
      createCardCopy(newCard);
    }
  };

  const isTitleOrEndCard =
    selectedCard?.sequenceOrder === 0 ||
    selectedCard?.sequenceOrder === cards.length - 1;
  const cardJson = selectedCard?.json;
  const hasExpandableList = cardJson?.contentBlocks.find((block) => {
    return block.type === 'expandableList';
  });

  const templateType = cardJson?.templateType ?? 'blank';

  const cardOptionsFactory = new CardOptionsFactory(
    templateType,
    addContentBlock,
  );
  cardOptionsFactory.getOptionsByTemplate();

  if (hasExpandableList) {
    cardOptionsFactory.removeOptions([
      'expandableList',
      'expandableList-divider',
    ]);
  }
  const items = cardOptionsFactory.getItems();

  const isAddingBlocksDisabled = () => {
    const knowledgeCheckLimit = 2;
    const contentBlocksLength = cardJson?.contentBlocks.length ?? 0;
    const isKnowledgeCheck =
      ['multipleChoice', 'trueFalse'].includes(templateType) &&
      contentBlocksLength >= knowledgeCheckLimit;
    // Can add more templates if necessary
    return isKnowledgeCheck;
  };
  useEffect(() => {
    if (selectedCard?.title) {
      setCardTitle(selectedCard.title);
    }
  }, [selectedCard?.title]);

  const saveTitle = useDebouncedCallback((card: Card, title: string) => {
    const updatedCard: Card = {
      ...card,
      title,
      json: { ...card.json, titleSynced: true },
    };
    dispatch(updateCardAction(updatedCard));
  });

  return (
    <div
      className={classNames(
        'card-options-container',
        editingTitle && 'card-options-container__outline',
      )}>
      <input
        placeholder='Add a title here'
        ref={titleInput}
        data-testid={'titleInput'}
        type='text'
        className={classNames({
          'card-options-container__title': true,
          'card-options-container__title-shortened': !editingTitle,
        })}
        onBlur={() => {
          if (selectedCard) {
            saveTitle(selectedCard, cardTitle);
          }
          setEditingTitle(false);
        }}
        onKeyDown={(e) => {
          if (e.code === 'Enter' && titleInput?.current && selectedCard) {
            saveTitle(selectedCard, cardTitle);
            setEditingTitle(false);
            titleInput.current.blur();
          }
        }}
        onFocus={() => {
          setEditingTitle(true);
        }}
        onChange={(e) => {
          if (MAX_TITLE_LENGTH >= e.target.value.length) {
            setCardTitle(e.target.value);
          }
        }}
        value={cardTitle}></input>
      {editingTitle && (
        <Tooltip placement={'top'} title={TITLE_TOOL_TIP}>
          <div
            className='card-options-container__progress-container'
            data-testid='title-circle-progress'>
            <Progress
              type={'circle'}
              className='card-options-container__progress'
              size={20}
              showInfo={false}
              percent={(cardTitle?.length / MAX_TITLE_LENGTH) * 100}></Progress>
          </div>
        </Tooltip>
      )}
      {!editingTitle && (
        <div
          className={classNames({
            'card-options-container--hidden': isTitleOrEndCard,
            'card-options-container__buttons': true,
          })}>
          <div
            className={classNames({
              'card-options-container__not-allowed': isAddingBlocksDisabled(),
            })}>
            <div
              className={classNames({
                'card-options-container__disabled': isAddingBlocksDisabled(),
              })}>
              <Dropdown menu={{ items }} trigger={['click']}>
                <Tooltip title='Content Block'>
                  <Button
                    type='text'
                    icon={<PlusOutlined />}
                    data-testid='addContentBlockButton'
                    disabled={isAddingBlocksDisabled()}
                  />
                </Tooltip>
              </Dropdown>
            </div>
          </div>
          <Tooltip title='Duplicate'>
            <Button
              type='text'
              icon={<CopyOutlined />}
              onClick={handleCopyCard}
            />
          </Tooltip>
          <Tooltip title='Delete'>
            <Button
              type='text'
              icon={<DeleteOutlined />}
              onClick={() => displayDeletionConfirmationScreen(true)}
            />
          </Tooltip>
        </div>
      )}
    </div>
  );
};
