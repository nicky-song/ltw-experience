import {
  CheckCircleOutlined,
  CloseOutlined,
  DoubleRightOutlined,
  ExpandOutlined,
  FileImageOutlined,
  FontSizeOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import { Button, Drawer, Menu, MenuProps } from 'antd';
import { FC, ReactNode, useContext, useState } from 'react';
import { lessonCardsKey, importCardsKey } from './constants';
import { TemplateType } from '@learn-to-win/common/features/Cards/cardTypes';
import './NewCardDrawer.scss';
import ImportCardForm from './ImportCardForm';
import {
  CardTemplateOption as CardTemplateOptionType,
  CardTemplateTypes,
} from './types';
import { DrawerContext } from '@pages/AdminLesson/context';
import { DrawerContext as DrawerContextType } from '@pages/AdminLesson/types';
import CustomButton from '@components/Button';
import { LearningItemType } from '@learn-to-win/common/constants';

const cardTemplateMultipleChoice: CardTemplateTypes = {
  title: 'Multiple Choice',
  description:
    'Learner picks the right answer from a list of choices. Images are optional!',
  icon: UnorderedListOutlined,
  color1: '#FDEEEB',
  color2: '#D7FEF6',
  type: 'multipleChoice',
};

const cardTemplateLessonOptions: CardTemplateTypes[] = [
  {
    title: 'Blank',
    description:
      'Unleash content control with blank cards. Arrange images, text, video, audio, and more.',
    icon: ExpandOutlined,
    color1: '#FCFDEB',
    color2: '#EDFEFD',
    type: 'blank',
  },
  {
    title: 'Text',
    description: 'Share written information with ease.',
    icon: FontSizeOutlined,
    color1: '#F7BEDB',
    color2: '#CAE1FD',
    type: 'text',
  },
  {
    title: 'Media',
    description: 'Bring content to life with video, images, or audio.',
    icon: FileImageOutlined,
    color1: '#DE33FD',
    color2: '#B085F9',
    type: 'media',
  },
  {
    title: 'Slideshow',
    description: 'Share a series of images with a slideshow.',
    icon: DoubleRightOutlined,
    color1: '#38F067',
    color2: '#07C0B5',
    type: 'slideshow',
  },
  {
    title: 'Expandable List',
    description: 'Break down concepts into a digestible, interactive list.',
    icon: UnorderedListOutlined,
    color1: '#60D1FD',
    color2: '#F7FDEB',
    type: 'expandableList',
  },
  cardTemplateMultipleChoice,
  {
    title: 'True or False',
    description: 'Retain learner knowledge with a true or false question.',
    icon: CheckCircleOutlined,
    color1: '#FFB2ED',
    color2: '#FEC7C9',
    type: 'trueFalse',
  },
];

const cardTemplateQuizOptions: CardTemplateTypes[] = [
  cardTemplateMultipleChoice,
  {
    title: 'True or False',
    description: 'Retain learner knowledge with a true or false question.',
    icon: CheckCircleOutlined,
    color1: '#FFB2ED',
    color2: '#FEC7C9',
    type: 'trueFalse',
  },
];

export const NewCardDrawer: FC<{
  createCardWithTemplate: (type: TemplateType) => void;
  learningItemType: string;
}> = ({ createCardWithTemplate, learningItemType }) => {
  const [tabKey, setTabKey] = useState(lessonCardsKey);
  const { isDrawerOpen, setIsDrawerOpen } =
    (useContext(DrawerContext) as DrawerContextType) || {};

  const items: MenuProps['items'] = [
    {
      label: `${learningItemType} Cards`,
      key: lessonCardsKey,
    },
    {
      label: 'Import Cards',
      key: importCardsKey,
    },
  ];
  const clickMenu: MenuProps['onClick'] = (event) => {
    const { key } = event;
    setTabKey(key);
  };

  return (
    <Drawer
      open={isDrawerOpen}
      onClose={() => {
        setTabKey(lessonCardsKey);
        setIsDrawerOpen(false);
      }}
      width={440}
      closeIcon={
        <CustomButton
          htmlType='button'
          size='large'
          type='ghost'
          icon={<CloseOutlined />}></CustomButton>
      }
      title={
        <Menu
          onClick={clickMenu}
          items={items}
          mode={'horizontal'}
          className='new-card-drawer__menu-nav'
          defaultSelectedKeys={[lessonCardsKey]}></Menu>
      }
      className='new-card-drawer'
      destroyOnClose>
      <DrawerState
        tabKey={tabKey}
        cardTemplateOptions={
          learningItemType.toLowerCase() === LearningItemType.LESSON
            ? cardTemplateLessonOptions
            : cardTemplateQuizOptions
        }
        createCardWithTemplate={createCardWithTemplate}
      />
    </Drawer>
  );
};

const DrawerState: FC<{
  tabKey: string;
  cardTemplateOptions: CardTemplateTypes[];
  createCardWithTemplate: (type: TemplateType) => void;
}> = ({ tabKey, cardTemplateOptions, createCardWithTemplate }) => {
  const { setIsDrawerOpen } =
    (useContext(DrawerContext) as DrawerContextType) || {};
  switch (tabKey) {
    case lessonCardsKey:
      return (
        <>
          {cardTemplateOptions.map((option: CardTemplateTypes) => (
            <CardTemplateOption
              key={option.title}
              onClick={(type: TemplateType) => {
                createCardWithTemplate(type);
                setIsDrawerOpen(false);
              }}
              title={option.title}
              description={option.description}
              color1={option.color1}
              color2={option.color2}
              icon={option.icon}
              type={option.type}
            />
          ))}
        </>
      );
    case importCardsKey:
      return <ImportCardForm />;
    default:
      return null;
  }
};

const CardTemplateOption: FC<CardTemplateOptionType> = ({
  onClick,
  title,
  description,
  color1,
  color2,
  icon,
  type,
}) => {
  const Icon = icon;
  return (
    <div
      onClick={() => onClick(type)}
      className='new-card-drawer__card-template-option'>
      <div className='new-card-drawer__card-template-option__graphic'>
        <LessonGraphic
          icon={
            <Icon className='new-card-drawer__card-template-option__graphic__icon' />
          }
          color1={color1}
          color2={color2}
        />
      </div>
      <div className='new-card-drawer__card-template-option__content-container'>
        <div className='new-card-drawer__card-template-option__content'>
          <div className='new-card-drawer__card-template-option__content__title'>
            {title}
          </div>
          {/* onClick not needed since it bubbles up to div*/}
          <Button size='small' type='primary' data-testid={title}>
            Select
          </Button>
        </div>
        <div>{description}</div>
      </div>
    </div>
  );
};

const LessonGraphic: FC<{
  icon: ReactNode;
  color1: string;
  color2: string;
}> = ({ icon, color1, color2 }) => {
  return (
    <div
      className='new-card-drawer__card-template-option__graphic__lesson-graphic'
      style={{
        background: `linear-gradient(90deg, ${color1} 0%, ${color2} 100%)`,
      }}>
      {icon}
    </div>
  );
};
