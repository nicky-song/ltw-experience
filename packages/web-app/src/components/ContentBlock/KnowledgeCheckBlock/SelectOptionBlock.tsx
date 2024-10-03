import { EditorControlType } from '@components/EditorControl';
import { ContentBlockEditor } from '@components/RichText/ContentBlockEditor';
import {
  Card,
  MultipleChoiceBlockType,
  MultipleChoiceType,
  SlateJSON,
  AnswerOption,
  ContentBlockType,
  TrueFalseBlockType,
} from '@learn-to-win/common/features/Cards/cardTypes';
import './selectOption.scss';
import classNames from 'classnames';
import { useAppSelector } from '@hooks/reduxHooks';
import { useNavigate, useParams } from 'react-router-dom';
import { useCallback, useState, useRef } from 'react';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

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
import { PlusOutlined } from '@ant-design/icons';
import { MIN_OPTIONS, multipleChoiceDropdownValues } from './constants';
import { Select, Button as AntdButton, Checkbox } from 'antd';
import {
  SELECT_ALL_LABEL,
  SELECT_ONE_LABEL,
} from '@learn-to-win/common/constants/multipleChoiceTypeText';
import { dndReorderList } from '../utils';
import Text from '@components/Typography/Text';
import { v4 as uuidv4 } from 'uuid';
import { useBatchCardUpdates } from '../contentBlockHooks';
import MultipleSelectOption from './SelectOption';
import LearnerSelectOption from './LearnerSelectOption';

interface SelectOptionBlockProps {
  block: MultipleChoiceBlockType | TrueFalseBlockType;
  id: string;
  showEditor: boolean;
  editing: boolean;
  card: Card;
}

const SelectOptionBlock: React.FC<SelectOptionBlockProps> = ({
  block,
  id,
  showEditor,
  editing,
  card,
}: SelectOptionBlockProps) => {
  const [selectType, setSelectType] = useState(block.multipleChoiceType);
  const isMultipleChoiceTypeSelectOne =
    block?.multipleChoiceType === 'selectone';
  const [optionWithValidationError, setOptionWithValidationError] = useState<
    string | null
  >(null);
  const { selectedCardId, loading } = useAppSelector((state) => state.card);
  const { learningItemId } = useParams();
  const scrollToBottomRef = useRef<HTMLDivElement | null>(null);
  const { learningItemList } = useAppSelector((state) => state.learningItem);
  const learningItem = learningItemList.find(
    (item) => item.id === learningItemId,
  );
  const isSelectedCard = card.id === selectedCardId;
  const editable = isSelectedCard && showEditor;
  const navigate = useNavigate();
  const { updateBlock, block: updatedBlock } = useBatchCardUpdates(
    block,
    scrollToBottomRef,
  );
  const { id: blockId, options: updatedBlockOptions = [] } =
    updatedBlock as MultipleChoiceBlockType;
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const saveQuestion = (
    richText: SlateJSON,
    _: Card,
    __: string,
    ___: string,
    titleSynced?: boolean,
  ) => {
    updateBlock(
      (prev: ContentBlockType) => ({
        ...prev,
        question: richText,
      }),
      'saveQuestion',
      false,
      titleSynced,
    );
  };

  const saveSelectType = useCallback(
    (selectType: MultipleChoiceType) => {
      setSelectType(selectType);
      updateBlock(
        () =>
          ({
            ...block,
            options: block?.options.map((option: AnswerOption, idx) => {
              return selectType === 'selectone'
                ? { ...option, isCorrect: idx === 0 }
                : option;
            }),
            multipleChoiceType: selectType,
          } as MultipleChoiceBlockType),
        'saveSelectType',
      );
    },
    [block, updateBlock],
  );

  const saveOptionText = useCallback(
    (optionId: string) => (richText: SlateJSON) => {
      updateBlock((prev: ContentBlockType) => {
        const prevMcBlock = prev as MultipleChoiceBlockType;
        return {
          ...prevMcBlock,
          options: prevMcBlock.options.map((option: AnswerOption) => {
            return option.id === optionId
              ? {
                  ...option,
                  optionText: richText,
                }
              : option;
          }),
        };
      }, 'saveOptionText');
    },
    [updateBlock],
  );

  const shouldUpdateAnswerOption = useCallback(
    (optionId: string) => {
      const correctOptions = updatedBlockOptions.filter(
        (option) => option.isCorrect,
      );

      if (
        block?.multipleChoiceType === 'selectall' &&
        correctOptions.length === 1 &&
        correctOptions[0].id === optionId
      ) {
        return false;
      }
      return true;
    },
    [updatedBlockOptions, block?.multipleChoiceType],
  );

  const selectAndSaveQuestion = useCallback(
    (optionId: string) => {
      let answerOptions: Array<AnswerOption>;
      if (!shouldUpdateAnswerOption(optionId)) {
        setOptionWithValidationError(optionId);
        return;
      }
      if (isMultipleChoiceTypeSelectOne) {
        answerOptions = updatedBlockOptions.map((option: AnswerOption) => {
          return {
            ...option,
            isCorrect: option.id === optionId,
          };
        });
      } else {
        answerOptions = updatedBlockOptions.map((option: AnswerOption) => {
          return option.id === optionId
            ? {
                ...option,
                isCorrect: !option.isCorrect,
              }
            : option;
        });
        setOptionWithValidationError(null);
      }

      updateBlock(
        () => ({ ...block, options: answerOptions } as MultipleChoiceBlockType),
        'selectAndSaveQuestion',
      );
    },
    [
      updatedBlockOptions,
      isMultipleChoiceTypeSelectOne,
      block,
      updateBlock,
      shouldUpdateAnswerOption,
    ],
  );

  const reorderOptions = useCallback(
    (event: DragEndEvent) => {
      updateBlock(
        () =>
          ({
            ...block,
            options: dndReorderList(event, updatedBlockOptions),
          } as MultipleChoiceBlockType),
        'reorderOptions',
      );
    },
    [updatedBlockOptions, block, updateBlock],
  );

  const addOption = useCallback(() => {
    if (loading) {
      return;
    }
    const newOptions: Array<AnswerOption> = [
      ...block.options,
      {
        id: uuidv4(),
        isCorrect: false,
        optionText: [
          {
            type: 'paragraph',
            children: [
              {
                text: `Answer ${block.options.length + 1}`,
              },
            ],
          },
        ],
      },
    ];
    updateBlock(
      () =>
        ({
          ...block,
          options: newOptions,
        } as MultipleChoiceBlockType),
      'addOption',
    );
  }, [block, loading, updateBlock]);

  const deleteOption = useCallback(
    (id: string) => {
      if (
        block.options.length <= MIN_OPTIONS ||
        !shouldUpdateAnswerOption(id)
      ) {
        return;
      }
      const optionsClone = structuredClone(block.options);
      const optionToDelete = optionsClone.find(
        (option: AnswerOption) => option.id === id,
      );
      if (
        optionToDelete?.isCorrect &&
        block.multipleChoiceType === 'selectone'
      ) {
        optionsClone.forEach((option: AnswerOption, idx: number) => {
          if (option.isCorrect && idx - 1 >= 0) {
            optionsClone[idx - 1].isCorrect = true;
          } else if (option.isCorrect && idx + 1 <= optionsClone.length - 1) {
            optionsClone[idx + 1].isCorrect = true;
          }
        });
      }
      updateBlock(
        () =>
          ({
            ...block,
            options: optionsClone.filter(
              (option: AnswerOption) => option.id !== id,
            ),
          } as MultipleChoiceBlockType),
        'deleteOption',
      );
    },
    [block, updateBlock, shouldUpdateAnswerOption],
  );

  const randomizeOptions = useCallback(() => {
    if ('randomize' in block) {
      updateBlock(
        () => ({
          ...block,
          randomize: !block.randomize,
        }),
        'randomizeOptions',
      );
    }
  }, [block, updateBlock]);
  return (
    <>
      <div
        className={classNames({
          'multiple-choice': true,
          'multiple-choice--editable': editable,
        })}
        onClick={() => {
          if (editable) {
            navigate(
              `/learning_item/${learningItem?.type}/${learningItemId}/card/${card.id}/block/${id}`,
            );
          }
        }}>
        <div
          className={classNames({
            'multiple-choice__block--disabled': !editing && showEditor,
          })}>
          <div className={'multiple-choice__question'}>
            <ContentBlockEditor
              blockId={blockId}
              card={card}
              editable={editing && !showEditor}
              blockType={'multipleChoice'}
              editorControlProps={{
                editorType: EditorControlType.questionText,
                enableMoveControls: false,
                characterCount: 95,
                enableCharacterCount: true,
                enableDelete: false,
                enableSizeControls: false,
                enabled: true,
              }}
              save={saveQuestion}
              editableText={block.question}
            />
          </div>
          <div className='multiple-choice__type-desc'>
            {editing && block.type === 'multipleChoice' ? (
              <Select
                value={selectType}
                data-testid='mc-block-listbox'
                className='multiple-choice__dropdown'
                onChange={(option) => {
                  if (option === 'selectone' || option === 'selectall') {
                    saveSelectType(option);
                  }
                }}
                options={multipleChoiceDropdownValues}
              />
            ) : (
              <p>
                {block.multipleChoiceType === 'selectone'
                  ? SELECT_ONE_LABEL
                  : SELECT_ALL_LABEL}
              </p>
            )}
          </div>
          {editing || showEditor ? (
            <DndContext
              modifiers={[restrictToWindowEdges, restrictToVerticalAxis]}
              sensors={sensors}
              onDragEnd={reorderOptions}
              collisionDetection={closestCenter}>
              <SortableContext
                strategy={verticalListSortingStrategy}
                items={updatedBlockOptions.map(
                  (option: AnswerOption) => option.id,
                )}>
                {updatedBlockOptions.map((option: AnswerOption) => {
                  return (
                    <MultipleSelectOption
                      key={option.id}
                      editing={editing}
                      showEditor={showEditor}
                      card={card}
                      saveOptionText={saveOptionText}
                      selectAndSaveQuestion={selectAndSaveQuestion}
                      deleteOption={deleteOption}
                      option={option}
                      block={updatedBlock as MultipleChoiceBlockType}
                      showError={optionWithValidationError === option.id}
                      disableDelete={
                        !shouldUpdateAnswerOption(option.id) ||
                        updatedBlockOptions.length <= MIN_OPTIONS
                      }
                    />
                  );
                })}
              </SortableContext>
            </DndContext>
          ) : (
            <LearnerSelectOption
              card={card}
              block={block}
              isMultipleChoiceTypeSelectOne={isMultipleChoiceTypeSelectOne}
            />
          )}
        </div>
      </div>
      {block.type === 'multipleChoice' && (
        <div
          data-testid='mc-add-randomize-controls'
          className={classNames({
            'multiple-choice__bottom-controls': true,
            'multiple-choice__bottom-controls--hide': !editing,
          })}>
          <AntdButton
            data-testid='mc-add-answer-btn'
            onClick={() => {
              addOption();
            }}
            htmlType='button'
            size={'middle'}
            icon={<PlusOutlined />}
            type='dashed'>
            Add Answer
          </AntdButton>
          <div>
            <Checkbox
              value={block.randomize}
              checked={block.randomize}
              className={'multiple-choice__bottom-checkbox'}
              onChange={() => {
                randomizeOptions();
              }}
            />
            <Text>Randomize Answers</Text>
          </div>
        </div>
      )}
      {editing && (
        <div
          className={'multiple-choice__spacer'}
          ref={scrollToBottomRef}></div>
      )}
    </>
  );
};

export default SelectOptionBlock;
