import { fireEvent, render, screen } from '@tests/testing';
import SelectOption from './SelectOption';
import {
  AnswerOption,
  Card,
  CardJson,
  MultipleChoiceBlockType,
  SlateJSON,
} from '@learn-to-win/common/features/Cards/cardTypes';
import { CardType } from '@learn-to-win/common/constants';

describe('SelectOption tests', () => {
  const saveOptionText = jest.fn((optionId) => (richText: SlateJSON) => null);
  const selectAndSaveQuestion = jest.fn();
  const deleteOption = jest.fn();

  const card: Card = {
    id: '1',
    title: 'Expandable List',
    type: CardType.LESSON_CARD,
    sequenceOrder: 1,
    learningItemId: '1',
    json: {} as CardJson,
    learningItem: '1',
    confidenceCheck: true,
  };

  const block = {
    id: '1',
    type: 'multipleChoice',
    multipleChoiceType: 'selectone',
    question: [
      {
        type: 'paragraph',
        children: [
          {
            text: 'Question 1',
          },
        ],
      },
    ],
    options: [
      {
        id: '1',
        isCorrect: false,
        optionText: [
          {
            type: 'paragraph',
            children: [
              {
                text: 'Answer 1',
              },
            ],
          },
        ],
      },
      {
        id: '2',
        isCorrect: false,
        optionText: [
          {
            type: 'paragraph',
            children: [
              {
                text: 'Answer 2',
              },
            ],
          },
        ],
      },
    ],
  } as MultipleChoiceBlockType;

  const option: AnswerOption = {
    id: '1',
    isCorrect: false,
    optionText: [
      {
        type: 'paragraph',
        children: [
          {
            text: 'Answer 1',
          },
        ],
      },
    ],
  };

  const props = {
    option,
    showEditor: false,
    editing: true,
    card,
    block,
    saveOptionText,
    selectAndSaveQuestion,
    deleteOption,
    showError: false,
    disableDelete: false,
  };

  it('should render answer option', async () => {
    render(<SelectOption {...props} />);
    expect(screen.getByText('Answer 1')).toBeInTheDocument();
    expect(screen.getByTestId('mc-delete-answer-btn-1')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'holder' })).toBeInTheDocument();
  });
  it('should render answer option with input type radio', async () => {
    render(<SelectOption {...props} />);
    const inputEl = screen.getByRole('radio');
    expect(inputEl).toBeInTheDocument();
    fireEvent.click(inputEl);
    expect(selectAndSaveQuestion).toHaveBeenCalledWith('1');
  });
  it('should render answer option with input type checkbox', async () => {
    block.multipleChoiceType = 'selectall';
    render(<SelectOption {...props} />);
    const inputEl = screen.getByRole('checkbox');
    expect(inputEl).toBeInTheDocument();
    fireEvent.click(inputEl);
    expect(selectAndSaveQuestion).toHaveBeenCalledWith('1');
  });
  it('should render delete button in disabled state', async () => {
    const updatedProps = {
      ...props,
      disableDelete: true,
    };
    render(<SelectOption {...updatedProps} />);
    expect(screen.getByTestId('mc-delete-answer-btn-1')).toHaveClass(
      'multiple-choice__delete-btn--disable',
    );
  });
  it('should invoke cb prop when delete button is clicked ', async () => {
    render(<SelectOption {...props} />);
    const deleteBtn = screen.getByTestId('mc-delete-answer-btn-1');
    fireEvent.click(deleteBtn);
    expect(deleteOption).toHaveBeenCalledWith('1');
  });
  it('should render error message when showError is true', async () => {
    const updatedProps = {
      ...props,
      showError: true,
    };
    render(<SelectOption {...updatedProps} />);
    expect(
      screen.getByText('At least one option must be selected as correct'),
    ).toBeInTheDocument();
  });
});
