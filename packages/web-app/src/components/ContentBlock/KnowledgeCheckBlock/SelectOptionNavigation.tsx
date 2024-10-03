import { LessonBackButton } from '../../AuthoringCard/LessonNavigation';
import Button from '@components/Button';
import classNames from 'classnames';

export function SelectOptionNavigation({
  onPrev,
  answered,
  isQuiz,
  feedbackType,
  isConfidenceSelected,
  isCardEnrollmentCompleted,
  onFinish,
  checkAnswerSelectAny,
}: {
  onPrev: () => void;
  answered: number;
  isQuiz: boolean;
  feedbackType: string | null;
  isConfidenceSelected: boolean;
  isCardEnrollmentCompleted: boolean;
  onFinish: () => void;
  checkAnswerSelectAny: () => void;
}) {
  const answerIncorrect = feedbackType === 'incorrect';
  const isConfidence = feedbackType === 'confidence';
  const isKnowledgeCheck = !isQuiz && answerIncorrect;
  let buttonText = '';
  if (isCardEnrollmentCompleted || feedbackType === 'correct') {
    buttonText = 'Continue';
  } else if (!answered) {
    buttonText = 'Answer to Continue';
  } else if (!feedbackType || isConfidence) {
    buttonText = 'Check';
  } else if (isKnowledgeCheck) {
    buttonText = 'Please Try Again';
  } else {
    buttonText = 'Continue';
  }
  const disableButton =
    !isCardEnrollmentCompleted &&
    (!answered || isKnowledgeCheck || (isConfidence && !isConfidenceSelected));
  return (
    <div className='knowledge-card-container'>
      <LessonBackButton onClick={onPrev} />
      <Button
        disabled={disableButton}
        htmlType='button'
        size='large'
        type={answered ? 'default' : 'text'}
        data-testid='knowledge-check-button'
        classes={classNames({
          'knowledge-card-container__button': true,
          'card-container__disable-button': !answered,
          'knowledge-card-container__try-again-button':
            buttonText === 'Please Try Again',
        })}
        onClick={buttonText === 'Continue' ? onFinish : checkAnswerSelectAny}>
        {buttonText}
      </Button>
    </div>
  );
}
