import { ReactElement } from 'react';
import BodyBlock from './TextBlock/BodyBlock';
import SubtitleBlock from './TextBlock/SubtitleBlock';
import TitleBlock from './TextBlock/TitleBlock';
import ImageBlock from './MediaBlock/ImageBlock';

import {
  Card,
  CardJson,
  ContentBlockType,
  KnowledgeCheckBlockType,
} from '@learn-to-win/common/features/Cards/cardTypes';
import { MAX_TITLE_LENGTH } from '@pages/AdminLesson/constants';
import { Element } from 'slate';
import ExpandableListBlock from './ExpandableListBlock';
import VideoBlock from './MediaBlock/VideoBlock';
import AudioBlock from './MediaBlock/AudioBlock';
import SelectOptionBlock from './KnowledgeCheckBlock/SelectOptionBlock';

export function getContentBlocksFromCard(
  card: Card,
  isAdminCard: boolean,
): ReactElement[] {
  const components: ReactElement[] = [];

  const json = card?.json as unknown as CardJson;

  if (!json?.contentBlocks) return [];
  for (const contentBlock of json.contentBlocks) {
    switch (contentBlock.type) {
      case 'title':
        components.push(
          <TitleBlock
            key={contentBlock.id}
            id={contentBlock.id}
            showEditor={isAdminCard}
            card={card}
          />,
        );
        break;
      case 'subtitle':
        components.push(
          <SubtitleBlock
            key={contentBlock.id}
            id={contentBlock.id}
            showEditor={isAdminCard}
            card={card}
          />,
        );
        break;
      case 'body':
        components.push(
          <BodyBlock
            key={contentBlock.id}
            id={contentBlock.id}
            showEditor={isAdminCard}
            card={card}
          />,
        );
        break;
      case 'image':
        components.push(
          <ImageBlock
            key={contentBlock.id}
            id={contentBlock.id}
            showEditor={isAdminCard}
            card={card}
          />,
        );
        break;
      case 'video':
        components.push(
          <VideoBlock
            key={contentBlock.id}
            id={contentBlock.id}
            showEditor={isAdminCard}
            card={card}
          />,
        );
        break;
      case 'audio':
        components.push(
          <AudioBlock
            key={contentBlock.id}
            id={contentBlock.id}
            showEditor={isAdminCard}
            card={card}
          />,
        );
        break;
      case 'expandableList':
        components.push(
          <ExpandableListBlock
            key={contentBlock.id}
            id={contentBlock.id}
            showEditor={isAdminCard}
            card={card}
            block={contentBlock}
            editing={false}
          />,
        );
        break;
      case 'trueFalse':
      case 'multipleChoice':
        components.push(
          <SelectOptionBlock
            key={contentBlock.id}
            id={contentBlock.id}
            showEditor={isAdminCard}
            card={card}
            block={contentBlock}
            editing={false}
          />,
        );
        break;
      default:
        //return error component
        break;
    }
  }

  return components;
}

export function addContentBlockToCard(
  card: Card,
  contentBlock: ContentBlockType,
  index?: number,
): Card {
  const json = { ...card.json } as unknown as CardJson;

  const newContentBlocks: Array<ContentBlockType> = [...json.contentBlocks];

  if (
    json.contentBlocks &&
    index !== undefined &&
    index >= 0 &&
    index < json.contentBlocks.length
  ) {
    newContentBlocks.splice(index, 0, contentBlock);
  } else {
    newContentBlocks.push(contentBlock);
  }

  json.contentBlocks = [...newContentBlocks];

  const newCard = { ...card, json };

  return newCard;
}

export function deleteContentBlockFromCard(
  card: Card,
  contentBlockId: string,
): Card {
  const json = { ...card.json } as unknown as CardJson;

  const newContentBlocks = json.contentBlocks
    ? json.contentBlocks.filter((block) => block.id !== contentBlockId)
    : [];

  json.contentBlocks = [...newContentBlocks];

  const newCard = { ...card, json };

  return newCard;
}

export function updateContentBlockInCard(
  card: Card,
  contentBlock: ContentBlockType,
  titleSynced?: boolean,
  skipTitleSync = false,
): Card {
  const json = { ...card.json } as unknown as CardJson;

  const newContentBlocks = json.contentBlocks ? [...json.contentBlocks] : [];

  const index = newContentBlocks.findIndex(
    (block) => block.id === contentBlock.id,
  );

  let title = card?.title;

  newContentBlocks[index] = contentBlock;

  json.contentBlocks = [...newContentBlocks];

  const shouldTitleSync = !skipTitleSync && !json?.titleSynced;

  if (
    shouldTitleSync &&
    index === 0 &&
    'json' in contentBlock &&
    ['title', 'subtitle', 'body'].includes(contentBlock.type)
  ) {
    const titleBlock = contentBlock?.json[0] as Element;
    title = titleBlock.children[0]?.text?.slice(0, MAX_TITLE_LENGTH);
  } else if (
    shouldTitleSync &&
    ['multipleChoice', 'trueFalse'].includes(contentBlock?.type)
  ) {
    const knowledgeCheckBlock = contentBlock as KnowledgeCheckBlockType;
    const question = knowledgeCheckBlock?.question[0] as Element;
    title = question.children[0]?.text?.slice(0, MAX_TITLE_LENGTH);
  }
  if (!skipTitleSync) {
    json.titleSynced = titleSynced;
  }
  return { ...card, json, title };
}

export function moveContentBlockUpInCard(
  card: Card,
  contentBlockId: string,
): Card {
  const json: CardJson = { ...card.json } as CardJson;

  const newContentBlocks = json.contentBlocks ? [...json.contentBlocks] : [];

  const index = newContentBlocks.findIndex(
    (block) => block.id === contentBlockId,
  );

  if (index == 0) {
    return card;
  }

  // Swap positions with the contentBlock previous to the one we are moving
  [newContentBlocks[index - 1], newContentBlocks[index]] = [
    newContentBlocks[index],
    newContentBlocks[index - 1],
  ];

  json.contentBlocks = [...newContentBlocks];

  const newCard = { ...card, json };

  return newCard;
}

export function moveContentBlockDownInCard(
  card: Card,
  contentBlockId: string,
): Card {
  const json: CardJson = { ...card.json } as CardJson;

  const newContentBlocks = json.contentBlocks ? [...json.contentBlocks] : [];

  const index = newContentBlocks.findIndex(
    (block) => block.id === contentBlockId,
  );

  if (index >= newContentBlocks.length - 1) {
    return card;
  }

  // Swap positions with the contentBlock after to the one we are moving
  [newContentBlocks[index + 1], newContentBlocks[index]] = [
    newContentBlocks[index],
    newContentBlocks[index + 1],
  ];

  json.contentBlocks = [...newContentBlocks];

  const newCard = { ...card, json };

  return newCard;
}
