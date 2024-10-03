import {
  BodyBlockType,
  TitleBlockType,
  SubtitleBlockType,
  TemplateType,
  ContentBlockType,
  ImageBlockType,
  ExpandableListBlockType,
  ListSection,
  VideoBlockType,
  AudioBlockType,
  AnswerOption,
  MultipleChoiceBlockType,
  TrueFalseBlockType,
} from './cardTypes';
import { defaultSectionText } from '@learn-to-win/common/constants/expandableList';
import { v4 as uuidv4 } from 'uuid';
import { getSlateNode } from '@learn-to-win/common/utils/cardJsonUtils';
import { defaultCorrectFeedback, defaultFeedbackHeader, defaultIncorrectFeedback, defaultQuestion } from '../../constants/defaultBlockText';

export function getTitleBlock(id: string, name?: string) {
  const val: TitleBlockType = {
    id,
    type: 'title',
    json: getSlateNode('title',name ?? 'Add a title here')
  };
  return val;
}

export function getSubtitleBlock(id: string, name?: string) {
  const val: SubtitleBlockType = {
    id,
    type: 'subtitle',
    json: getSlateNode('subtitle',name ?? 'Add a subtitle here')
  };
  return val;
}

export function getBodyBlock(id: string, description?: string) {
  const bodyText = description ??
  'This is your body text. Ready to bring life to this empty space? Start adding info for your learners here.';
  const val: BodyBlockType = {
    id,
    type: 'body',
    json: getSlateNode('paragraph',bodyText)
  };
  return val;
}

export function getImageBlock(id: string, image?: string, name?: string) {
  const val: ImageBlockType = {
    id,
    type: 'image',
    url: image ?? '',
    name: name ?? '',
  };
  return val;
}

export function getVideoBlock(id: string, url?: string, name?: string) {
  const val: VideoBlockType = {
    id,
    type: 'video',
    url,
    name: name ?? 'Video',
  };
  return val;
}

export function getAudioBlock(id: string, url?: string, name?: string) {
  const val: AudioBlockType = {
    id,
    type: 'audio',
    url,
    name: name ?? 'Audio',
  };
  return val;
}

export function getExpandableListBlock(id: string): ExpandableListBlockType {
  const numSections = 3;
  const sections: Array<ListSection> = [];

  for (let i = 1; i <= numSections; i++) {
    sections.push({
      id: uuidv4(),
      title: getSlateNode('list-item',`Section Header ${i}`),
      content: getSlateNode('paragraph',defaultSectionText)
    });
  }
  const expandableBlock: ExpandableListBlockType = {
    id,
    type: 'expandableList',
    sections,
  };

  return expandableBlock;
}

export function getMultipleChoiceBlock(id: string): MultipleChoiceBlockType {
  return {
    id,
    type: 'multipleChoice',
    multipleChoiceType: 'selectone',
    randomize: false,
    correctFeedback: {
     header: getSlateNode('paragraph',defaultFeedbackHeader , {bold:true}),
     body:getSlateNode('paragraph',defaultCorrectFeedback)
    },
    incorrectFeedback:{
      header:getSlateNode('paragraph',defaultFeedbackHeader, {bold:true}),
      body:getSlateNode('paragraph',defaultIncorrectFeedback)
    },
    question: getSlateNode('title', defaultQuestion),
    options: makeDefaultAnswerOptions(),
  };
}

const makeDefaultAnswerOptions = (): Array<AnswerOption> => {
  const defaultNumOption = 4;
  const questionList: Array<AnswerOption> = [];

  for (let i = 1; i <= defaultNumOption; i++) {
    questionList.push({
      isCorrect: i === 1,
      id: uuidv4(),
      optionText: getSlateNode('paragraph', `Answer ${i}`)
    });
  }
  return questionList;
};

export function getTrueFalseBlock(id:string): TrueFalseBlockType{
  const trueFalseOptions: [AnswerOption, AnswerOption] = [{
    id: uuidv4(),
    optionText: getSlateNode('paragraph', 'True'),
    isCorrect: true,
  },
  {
    isCorrect: false,
    id: uuidv4(),
    optionText: getSlateNode('paragraph', 'False')
  }];
  return {
    id,
    type: 'trueFalse',
    options: trueFalseOptions,
    multipleChoiceType:'selectone',
    correctFeedback: {
      header: getSlateNode('paragraph',defaultFeedbackHeader , {bold:true}),
      body:getSlateNode('paragraph',defaultCorrectFeedback)
     },
     incorrectFeedback:{
       header:getSlateNode('paragraph',defaultFeedbackHeader, {bold:true}),
       body:getSlateNode('paragraph',defaultIncorrectFeedback)
     },
     question: getSlateNode('title', defaultQuestion),
  }
}

export const getContentBlockByTemplateType = (type: TemplateType) => {
  let contentBlocks: ContentBlockType[] = [];
  switch (type) {
    case 'blank':
      contentBlocks = [];
      break;
    case 'text':
      contentBlocks = [
        getTitleBlock(uuidv4(), 'Untitled'),
        getBodyBlock(uuidv4()),
      ];
      break;
    case 'media':
      contentBlocks = [
        getTitleBlock(uuidv4(), 'Untitled'),
        getImageBlock(uuidv4()),
        getBodyBlock(uuidv4()),
      ];
      break;
    case 'slideshow':
      contentBlocks = [];
      break;
    case 'expandableList':
      contentBlocks = [
        getTitleBlock(uuidv4(), 'Untitled'),
        getExpandableListBlock(uuidv4()),
      ];
      break;
    case 'multipleChoice':
      contentBlocks = [getMultipleChoiceBlock(uuidv4())];
      break;
    case 'trueFalse':
      contentBlocks = [getTrueFalseBlock(uuidv4())];
      break;
    default:
      contentBlocks = [];
      break;
  }
  return contentBlocks;
};
