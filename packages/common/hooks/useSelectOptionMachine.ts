import { createMachine } from 'xstate';

type Context = {
  isQuiz: boolean;
  learnerAnswers: string[];
  confidence: number | null;
};

const isNotQuiz = (context: Context) => {
  return !context.isQuiz;
};
export const selectOptionMachine = createMachine<Context>({
  id: 'select-option-machine',
  initial: 'loading',
  predictableActionArguments: true,
  states: {
    loading: {
      on: {
        SUCCESS_COMPLETE: 'completed',
        SUCCESS_INCOMPLETE: 'selectOption',
      },
    },
    selectOption: {
      on: {
        SYNC_ANSWERS: {
          target: 'completed',
          actions: 'syncAnswers',
        },
        SELECT_ONE: [
          {
            target: 'showFeedback',
            actions: 'addAnswer',
            cond: isNotQuiz,
          },
          {
            target: 'selectOption',
            actions: 'addAnswer',
            cond: (context) => context.isQuiz,
          },
        ],
        TOGGLE_OPTION: [
          {
            target: 'selectOption',
            actions: 'toggleOption',
          },
        ],
        CHECK_ANSWER: {
          target: 'showFeedback',
          cond: (context) => {
            // CHECK_ANSWER can only be triggered if there is at least one answer
            return context.learnerAnswers.length > 0;
          },
        },
        SELECT_CONFIDENCE: {
          target: 'selectOption',
          actions: 'selectConfidence',
        }
      },
    },
    showFeedback: {
      entry: 'updateServer',
      on: {
        COMPLETE: {
          target: 'completed',
          actions: 'onComplete',
        },
        SELECT_ONE: {
          target: 'showFeedback',
          actions: 'addAnswer',
          cond: isNotQuiz,
        },
        TOGGLE_OPTION: {
          target: 'selectOption',
          actions: 'toggleOption',
          cond: isNotQuiz,
        },
      },
    },
    completed: {
      // type: 'final',
      on: {
        SYNC_ANSWERS: {
          target: 'completed',
          actions: 'syncAnswers',
        },
        COMPLETE: {
          target: 'completed',
          actions: 'onComplete',
        },
      },
    },
  },
});
