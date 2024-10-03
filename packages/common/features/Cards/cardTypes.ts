import { Descendant } from 'slate';
import { CardType } from '../../constants';

export type GetCardsParams = {
  learningItemId: string | undefined;
  cardId?: string;
  resetSelectedCard?: boolean;
  filter?: string;
};

export interface CardsState {
  cards: Card[];
  selectedCardId: string | null;
  loading: boolean;
  error: null | string;
}

export type CreateCardValues = {
  title: string;
  type: CardType;
  sequenceOrder: number;
  learningItemId: string | undefined;
  json: CardJson;
  confidenceCheck?: boolean;
};

export type ImportCardResponse = {
  cards: Card[];
};

export type Card = CreateCardValues & {
  id: string;
  learningItem: string;
};

//Content Blocks

export type CardJson = {
  description: string;
  contentBlocks: ContentBlockType[];
  version: string;
  titleSynced?: boolean;
  templateType: TemplateType;
};

export type SlateJSON = Descendant[];

type ContentBlockBase = {
  id: string;
  type: string;
};

export type KnowledgeCheckBlockBase = ContentBlockBase & {
  correctFeedback: Feedback;
  incorrectFeedback: Feedback;
  question: SlateJSON;
};

type TextContentBlockPartial =
  | {
    text: string;
  }
  | {
    json: SlateJSON;
  };

export type TitleBlockType = ContentBlockBase & {
  type: 'title';
} & TextContentBlockPartial;

export type SubtitleBlockType = ContentBlockBase & {
  type: 'subtitle';
} & TextContentBlockPartial;

export type BodyBlockType = ContentBlockBase & {
  type: 'body';
} & TextContentBlockPartial;

export type MediaBlockType = ContentBlockBase & {
  url: string | undefined;
  name: string | undefined;
};

export type ImageBlockType = MediaBlockType & {
  type: 'image';
};

export type VideoBlockType = MediaBlockType & {
  type: 'video';
};

export type AudioBlockType = MediaBlockType & {
  type: 'audio';
};

export type MultipleChoiceBlockType = KnowledgeCheckBlockBase & {
  type: 'multipleChoice';
  multipleChoiceType: MultipleChoiceType;
  options: Array<AnswerOption>;
  randomize: boolean;
};

export type Feedback = {
  header: SlateJSON;
  body: SlateJSON;
};

export type MultipleChoiceType = 'selectone' | 'selectall';

export type TrueFalseBlockType = KnowledgeCheckBlockBase & {
  type: 'trueFalse';
  multipleChoiceType: 'selectone';
  options: [AnswerOption, AnswerOption];
};

export type AnswerOption = {
  id: string;
  optionText: SlateJSON;
  isCorrect: boolean;
};

export type ExpandableListBlockType = ContentBlockBase & {
  type: 'expandableList';
  sections: Array<ListSection>;
};

export type ListSection = {
  id: string;
  title: SlateJSON;
  content: SlateJSON;
};

export type ListSectionType = 'title' | 'content';
export type MultipleChoiceSectionType = 'question' | 'option';

// Types that can be treated as text. IE ones that have text or json properties (per TextContentBlockPartial)
export type TextContentBlockType =
  | TitleBlockType
  | SubtitleBlockType
  | BodyBlockType
  | ExpandableListBlockType
  | MultipleChoiceBlockType
  | TrueFalseBlockType;

export type KnowledgeCheckBlockType =
  | MultipleChoiceBlockType
  | TrueFalseBlockType;

export type TextContentBlockTypes = TextContentBlockType['type'];

export type ContentBlockType =
  | TitleBlockType
  | SubtitleBlockType
  | BodyBlockType
  | ImageBlockType
  | ExpandableListBlockType
  | VideoBlockType
  | AudioBlockType
  | MultipleChoiceBlockType
  | TrueFalseBlockType;

export type ContentBlockTypes = ContentBlockType['type'];

export type TemplateType =
  | 'blank'
  | 'text'
  | 'media'
  | 'expandableList'
  | 'slideshow'
  | 'multipleChoice'
  | 'trueFalse'
  | null;
