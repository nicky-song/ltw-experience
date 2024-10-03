import {
  AnswerOption,
  Card,
  MultipleChoiceBlockType,
  SlateJSON,
  TrueFalseBlockType,
} from '@learn-to-win/common/features/Cards/cardTypes';
import { CSS } from '@dnd-kit/utilities';
import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { DeleteOutlined, HolderOutlined } from '@ant-design/icons';
import InputOption from '@components/InputOption';
import classNames from 'classnames';
import { ContentBlockEditor } from '@components/RichText/ContentBlockEditor';

interface SelectOptionProps {
  showEditor: boolean;
  editing: boolean;
  card: Card;
  option: AnswerOption;
  block: MultipleChoiceBlockType | TrueFalseBlockType;
  saveOptionText: (optionId: string) => (richText: SlateJSON) => void;
  selectAndSaveQuestion: (optionId: string) => void;
  deleteOption: (optionId: string) => void;
  showError?: boolean;
  disableDelete: boolean;
}
const SelectOption: React.FC<SelectOptionProps> = ({
  option,
  showEditor,
  editing,
  card,
  block,
  saveOptionText,
  selectAndSaveQuestion,
  deleteOption,
  showError = false,
  disableDelete,
}: SelectOptionProps) => {
  const feedbackType = showEditor || editing ? 'success' : null;
  const { optionText } = option;
  const [showControls, setShowControls] = useState('');
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: option.id,
  });

  const style = {
    transform: CSS.Transform.toString(
      transform ? { ...transform, scaleY: 1 } : null,
    ),
    transition,
  };
  const canEditAnswer =
    editing && !showEditor && block.type === 'multipleChoice';
  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className={classNames({ 'multiple-choice--dragging': isDragging })}
        key={option.id}
        onMouseEnter={() => {
          setShowControls(option.id);
        }}
        onMouseLeave={() => {
          setShowControls('');
        }}>
        <InputOption
          feedBackType={option.isCorrect ? feedbackType : null}
          type={block.multipleChoiceType === 'selectone' ? 'radio' : 'checkbox'}
          value={option.isCorrect}
          label={
            <div
              onClick={() => {
                if (block.type !== 'multipleChoice' && editing) {
                  selectAndSaveQuestion(option.id);
                }
              }}
              className={classNames({
                'multiple-choice__option-controls': true,
                'multiple-choice__controls--disabled':
                  editing && showControls === option.id,
              })}>
              <ContentBlockEditor
                blockId={block.id}
                card={card}
                editable={canEditAnswer}
                blockType={'multipleChoice'}
                editorControlProps={{
                  enabled: false,
                  characterCount: 40,
                }}
                save={saveOptionText(option.id)}
                editableText={optionText}
                /* Disables enter key so that
                text box height does not exceed option height
              */
                disableInputType={['insertParagraph']}
              />
              {block.type === 'multipleChoice' && (
                <div
                  data-testid='mc-answer-controls'
                  className={classNames({
                    'multiple-choice__edit-options': true,
                    'multiple-choice__edit-options--enabled':
                      editing && showControls === option.id,
                  })}>
                  <div
                    role='button'
                    data-testid={`mc-delete-answer-btn-${option.id}`}
                    className={classNames({
                      'multiple-choice__delete-btn--disable': disableDelete,
                    })}
                    onClick={() => {
                      deleteOption(option.id);
                    }}>
                    <DeleteOutlined />
                  </div>

                  <div ref={setActivatorNodeRef} {...listeners} {...attributes}>
                    <HolderOutlined />
                  </div>
                </div>
              )}
            </div>
          }
          onChange={() => {
            selectAndSaveQuestion(option.id);
          }}
        />
      </div>
      {showError && (
        <div className='multiple-choice__option__error'>
          At least one option must be selected as correct
        </div>
      )}
    </>
  );
};

export default SelectOption;
