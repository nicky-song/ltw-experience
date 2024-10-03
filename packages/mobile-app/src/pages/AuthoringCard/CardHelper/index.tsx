import { ContentBlock } from '../ContentBlock/ContentBlock';
import { ReactElement } from 'react';
import { Card, CardJson } from '@learn-to-win/common/features/Cards/cardTypes';

export function getContentBlocksFromCard(card: Card): ReactElement[] {
  const components: ReactElement[] = [];

  const json = card.json as unknown as CardJson;
  if (!json?.contentBlocks) return [];
  for (const contentBlock of json.contentBlocks) {
    components.push(
      <ContentBlock
        key={contentBlock.id}
        contentBlock={contentBlock}
        card={card}
      />,
    );
  }

  return components;
}
