import { Text } from 'react-native';
import {
  Card,
  ContentBlockType,
} from '@learn-to-win/common/features/Cards/cardTypes';
import { RichTextViewer } from './RichTextViewer';
import { ExpandableListBlock } from './ExpandableListBlock';
import { ImageBlock } from './ImageBlock';
import { AudioVideoBlock } from './AudioVideoBlock';
import { SelectOptionBlock } from './KnowledgeCheck/SelectOptionBlock';

interface ContentBlockProps {
  contentBlock: ContentBlockType;
  card: Card;
}

export function ContentBlock({ contentBlock, card }: ContentBlockProps) {
  switch (contentBlock.type) {
    case 'title':
    case 'subtitle':
    case 'body':
      return <RichTextViewer json={contentBlock?.json} />;
    case 'image':
      return <ImageBlock contentBlock={contentBlock} />;
    case 'expandableList':
      return <ExpandableListBlock contentBlock={contentBlock} />;
    case 'audio':
    case 'video':
      return <AudioVideoBlock contentBlock={contentBlock} />;
    case 'multipleChoice':
    case 'trueFalse':
      return <SelectOptionBlock card={card} contentBlock={contentBlock} />;
    default:
      return <Text>This card is not supported on our app. </Text>;
  }
}
