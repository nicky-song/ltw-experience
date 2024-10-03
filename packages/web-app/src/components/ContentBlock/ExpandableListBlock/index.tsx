import React, { useState, useEffect, useCallback, useRef } from 'react';
import classNames from 'classnames';
import { useAppDispatch, useAppSelector } from '@hooks/reduxHooks';
import {
  Card,
  ContentBlockType,
  ExpandableListBlockType,
  ListSection,
  ListSectionType,
  SlateJSON,
} from '@learn-to-win/common/features/Cards/cardTypes';
import { Button, Row, Col, Popover, Divider } from 'antd';
import {
  DownOutlined,
  DeleteOutlined,
  HolderOutlined,
  CopyOutlined,
  PlusOutlined,
  FileImageOutlined,
} from '@ant-design/icons';
import './expandableList.scss';
import { useNavigate, useParams } from 'react-router-dom';
import { EditorControlType } from '@components/EditorControl';
import { ContentBlockEditor } from '@components/RichText/ContentBlockEditor';
import { updateCardAction } from '@learn-to-win/common/features/Cards/cardSlice';
import { updateContentBlockInCard } from '@components/ContentBlock/CardHelper';
import { defaultSectionText } from '@learn-to-win/common/constants/expandableList';
import {
  useSortable,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  restrictToVerticalAxis,
  restrictToWindowEdges,
} from '@dnd-kit/modifiers';
import { v4 as uuidv4 } from 'uuid';
import { useCardCompletionForExpandableList } from '@learn-to-win/common/hooks/CardCompletionCheck';
import EditControlMove from '@components/EditorControl/EditControlMove';
import { useEditContentBlockControls } from '@components/ContentBlock/contentBlockHooks';
import { dndReorderList } from '../utils';

interface ExpandableListBlockProps {
  editing: boolean;
  showEditor?: boolean;
  block: ExpandableListBlockType;
  id: string;
  card: Card;
}
const ExpandableListBlock: React.FC<ExpandableListBlockProps> = ({
  block,
  id,
  editing,
  showEditor,
  card,
}: ExpandableListBlockProps) => {
  const { sections } = block;
  const [expandedList, setExpandedList] = useState<Array<boolean>>([
    ...sections.map((_, idx) => idx === 0),
  ]);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isEditingSection, setIsEditingSection] = useState(false);
  const [isDeletingSection, setIsDeletingSection] = useState<number | null>(
    null,
  );
  const { selectedCardId, loading } = useAppSelector((state) => state.card);
  const { moveContentDown, moveContentUp, deleteContent } =
    useEditContentBlockControls(id, card);
  const { learningItemId } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const isSelectedCard = selectedCardId === card.id;

  useEffect(() => {
    if (isEditingSection) {
      setExpandedList(sections.map((_, idx) => idx === sections.length - 1));
      setIsEditingSection(false);
    }
    if (isDeletingSection) {
      setExpandedList(sections.map((_, idx) => idx === isDeletingSection - 1));
      setIsDeletingSection(null);
    }
  }, [sections, expandedList, isEditingSection, isDeletingSection]);

  const { setExpandableListSectionAsViewed } =
    useCardCompletionForExpandableList(block.id);

  const setExpanded = useCallback(
    (id: number) => {
      setExpandableListSectionAsViewed(id);
      setExpandedList(expandedList.map((_, idx) => idx === id));
    },
    [expandedList, setExpandableListSectionAsViewed],
  );

  const addBlock = useCallback(() => {
    if (!card || loading) {
      return;
    }
    const newSections = [
      ...sections,
      {
        id: uuidv4(),
        title: [
          {
            type: 'list-item',
            children: [
              {
                text: `Section Header ${sections.length + 1}`,
              },
            ],
          },
        ],
        content: [
          {
            type: 'paragraph',
            children: [
              {
                text: defaultSectionText,
              },
            ],
          },
        ],
      },
    ];
    const newCard = updateContentBlockInCard(
      card,
      {
        id: block.id,
        type: 'expandableList',
        sections: newSections,
      } as ContentBlockType,
      card.json?.titleSynced,
    );
    dispatch(updateCardAction(newCard));
    setIsEditingSection(true);
  }, [dispatch, block, card, sections, loading]);

  const onSort = useCallback(
    (event: DragEndEvent): void => {
      const newSections = dndReorderList(event, sections);
      const openSectionId = expandedList.findIndex((b: boolean) => b === true);
      const findNewOpenId = newSections.findIndex(
        (section: ListSection) => section.id === sections[openSectionId]?.id,
      );
      setExpanded(findNewOpenId);
      const newCard = updateContentBlockInCard(
        card,
        {
          id: block.id,
          type: 'expandableList',
          sections: newSections,
        } as ContentBlockType,
        card.json?.titleSynced,
      );
      dispatch(updateCardAction(newCard));
    },
    [sections, dispatch, block, expandedList, card, setExpanded],
  );

  const deleteSection = useCallback(
    (id: number) => {
      if (sections.length <= 1 || loading) {
        return;
      }
      const newSections = sections.filter((_, idx) => idx !== id);
      const newCard = updateContentBlockInCard(
        card,
        {
          id: block.id,
          type: block.type,
          sections: newSections,
        } as ContentBlockType,
        card?.json?.titleSynced,
      );
      dispatch(updateCardAction(newCard));
      setIsDeletingSection(id);
    },
    [dispatch, card, block, sections, loading],
  );

  const cloneSection = useCallback(
    (id: number) => {
      if (!card || loading) {
        return;
      }
      const newSection = structuredClone(sections[id]);
      newSection.id = uuidv4();
      const newCard = updateContentBlockInCard(
        card,
        {
          id: block.id,
          type: block.type,
          sections: [...sections, newSection],
        } as ContentBlockType,
        card?.json?.titleSynced,
      );
      dispatch(updateCardAction(newCard));
      setIsEditingSection(true);
    },
    [dispatch, block, sections, card, loading],
  );

  return (
    <Popover
      trigger='click'
      open={isPopoverOpen}
      placement='rightTop'
      arrow={false}
      content={
        <div
          className='edit-control-content'
          // Prevents the interactions from the tooltip to de-select text and close tooltip
          onMouseDown={(e) => e.preventDefault()}>
          <div className='edit-control-menu-item'>
            <EditControlMove
              text='Expandable List'
              onMoveUp={moveContentUp}
              onMoveDown={moveContentDown}
              enableMoveControls
            />
          </div>
          <Divider className='edit-control-divider' />
          <Button
            data-testid={`choose-exp-list-btn-${card.id}`}
            className='content-block__popup-button-mid'
            onClick={() => {
              setIsPopoverOpen(false);
              navigate(
                `/learning_item/lesson/${learningItemId}/card/${card.id}/block/${id}`,
              );
            }}
            type='text'
            icon={<FileImageOutlined />}>
            Edit Expandable List
          </Button>
          <Divider className='edit-control-divider' />
          <Button
            className='content-block__popup-button'
            onClick={deleteContent}
            type='text'
            icon={<DeleteOutlined />}
            danger>
            Delete
          </Button>
        </div>
      }>
      <div
        className={classNames({
          'expandable-block__wrapper-focus': showEditor && isPopoverOpen,
          'expandable-block__wrapper-hover': showEditor && isSelectedCard,
          'expandable-block': true,
        })}
        data-testid={'popover-selector'}
        tabIndex={1}
        onClick={() => {
          if (showEditor && selectedCardId === card.id) {
            setIsPopoverOpen(true);
          }
        }}
        onBlur={() => {
          setIsPopoverOpen(false);
        }}>
        <div className={'expandable-block__section-list'}>
          <DndContext
            modifiers={[restrictToWindowEdges, restrictToVerticalAxis]}
            sensors={sensors}
            onDragEnd={onSort}
            collisionDetection={closestCenter}>
            <SortableContext
              strategy={verticalListSortingStrategy}
              items={sections.map((section: ListSection) => section.id)}>
              {sections.map((section, idx) => {
                return (
                  <ExpandableListSection
                    title={section.title}
                    key={section.id}
                    content={section.content}
                    cloneSection={cloneSection}
                    deleteSection={deleteSection}
                    setExpanded={setExpanded}
                    expandedList={expandedList}
                    index={idx}
                    id={section.id}
                    editing={editing}
                    card={card}
                    block={block}
                  />
                );
              })}
            </SortableContext>
          </DndContext>
        </div>
        {editing && (
          <div className={'block-editing-page__add-section'}>
            <Button type='dashed' icon={<PlusOutlined />} onClick={addBlock}>
              Add Section
            </Button>
          </div>
        )}
      </div>
    </Popover>
  );
};

interface ExpandableListSectionProps {
  title: SlateJSON;
  content: SlateJSON;
  expandedList: Array<boolean>;
  setExpanded: (key: number) => void;
  deleteSection: (val: number) => void;
  cloneSection: (val: number) => void;
  editing: boolean;
  index: number;
  id: string;
  card: Card;
  block: ExpandableListBlockType;
}

const ExpandableListSection: React.FC<ExpandableListSectionProps> = ({
  title,
  content,
  editing,
  expandedList,
  setExpanded,
  cloneSection,
  deleteSection,
  block,
  index,
  id,
  card,
}: ExpandableListSectionProps) => {
  const dispatch = useAppDispatch();
  const { sections } = block;
  const listSectionRef = useRef<HTMLDivElement | null>(null);
  const { selectedCardId } = useAppSelector((state) => state.card);
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
  });
  const style = {
    transform: CSS.Transform.toString(
      transform ? { ...transform, scaleY: 1 } : null,
    ),
    transition,
  };
  useEffect(() => {
    if (expandedList[index] && listSectionRef.current) {
      listSectionRef?.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [expandedList, index]);
  const save = useCallback(
    (sectionType: ListSectionType) =>
      (
        richText: SlateJSON,
        card: Card,
        blockId: string,
        blockType: string,
        titleSynced?: boolean,
      ) => {
        const newSections = sections?.map(
          (section: ListSection, sectionIdx) => {
            return index === sectionIdx
              ? {
                  id: section.id,
                  title: sectionType === 'title' ? richText : section.title,
                  content:
                    sectionType === 'content' ? richText : section.content,
                }
              : section;
          },
        );

        const newCard = updateContentBlockInCard(
          card,
          {
            id: blockId,
            type: blockType,
            sections: newSections,
          } as ContentBlockType,
          titleSynced ?? card?.json?.titleSynced,
        );
        dispatch(updateCardAction(newCard));
      },
    [dispatch, index, sections],
  );
  return (
    <div
      ref={setNodeRef}
      style={style}
      className={classNames({
        'draggable-item__section': true,
        'draggable-item__section-divider': index !== 0,
        'draggable-item': true,
        'draggable-item__is-dragging': isDragging,
      })}
      data-testid={`section-${index}`}
      onClick={() => {
        if (selectedCardId === card.id) {
          setExpanded(index);
        }
      }}>
      <div
        className={classNames({
          'expandable-block__title': true,
          'expandable-block__title--selected': selectedCardId === card.id,
        })}>
        <div
          className={classNames({
            'draggable-item__content-wrapper': true,
            'draggable-item__content-wrapper-border': editing,
            'draggable-item__section-title': true,
          })}>
          <ContentBlockEditor
            blockId={block.id}
            card={card}
            editable={editing && expandedList[index]}
            blockType={'expandableList'}
            editorControlProps={{
              editorType: EditorControlType.sectionHeader,
              enableMoveControls: false,
              characterCount: 95,
              enableCharacterCount: true,
              enableDelete: false,
              enableSizeControls: false,
              enabled: true,
            }}
            save={save('title')}
            editableText={title}
          />
        </div>
        <Row wrap={false}>
          {editing && (
            <div ref={setActivatorNodeRef} {...listeners} {...attributes}>
              <Col className={'draggable-item__drag'}>
                <HolderOutlined />
              </Col>
            </div>
          )}
          <Col>
            <DownOutlined
              className={classNames({
                'draggable-item__disabled-icon': expandedList[index],
              })}
            />
          </Col>
        </Row>
      </div>
      <div
        className={classNames({
          'draggable-item__unexpanded': !expandedList[index],
          'draggable-item__expanded': expandedList[index],
          'draggable-item__section-content': true,
        })}>
        <div
          className={classNames({
            'draggable-item__content-wrapper': true,
            'draggable-item__content-wrapper-border': editing,
          })}>
          <ContentBlockEditor
            blockId={block.id}
            card={card}
            editable={editing && expandedList[index]}
            blockType={'expandableList'}
            editorControlProps={{
              editorType: EditorControlType.sectionText,
              enableMoveControls: false,
              enableCharacterCount: true,
              enableDelete: false,
              characterCount: 400,
              enableSizeControls: false,
              enableListControls: true,
              enabled: true,
            }}
            save={save('content')}
            editableText={content}
          />
        </div>
        {editing && (
          <div className={'draggable-item__section-controls'}>
            <Button
              data-testid={`expandable-clone-${index}`}
              size='small'
              icon={<CopyOutlined />}
              onClick={() => {
                cloneSection(index);
              }}
            />
            <Button
              data-testid={`expandable-del-${index}`}
              size='small'
              icon={<DeleteOutlined />}
              onClick={() => {
                deleteSection(index);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpandableListBlock;
