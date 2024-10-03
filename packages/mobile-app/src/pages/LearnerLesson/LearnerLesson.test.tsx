import { render, waitFor, screen, fireEvent } from '../../test/testing';
import { LearnerLesson } from '.';

jest.mock('@learn-to-win/common/hooks/useLearningItem', () => ({
  useLearningItem: () => ({
    learningItemLoading: false,
    learningItemError: '',
    learningItemData: {},
  }),
}));

jest.mock('../../hooks/reduxHooks', () => ({
  useAppSelector: () => ({
    error: '',
    loading: false,
    cards: [
      {
        id: '1',
        title: 'card title 1',
        json: {
          version: '1.0',
          description: 'card description 1',
          contentBlocks: [],
        },
        type: 'title',
      },
      {
        id: '2',
        title: 'card title 2',
        json: {
          version: '1.0',
          description: 'card description 2',
          contentBlocks: [],
        },
        type: 'lesson',
      },
      {
        id: '3',
        title: 'card title 3',
        json: {
          version: '1.0',
          description: 'card description 3',
          contentBlocks: [],
        },
        type: 'end',
      },
    ],
    selectedCardId: '2',
    cardEnrollments: [
      {
        cardId: '2',
        completedAt: '2021-08-10',
      },
    ],
    learningItemEnrollments: [],
  }),
  useAppDispatch: () =>
    function () {
      return null;
    },
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

jest.mock('../AuthoringCard/useNextLearningItem', () => ({
  useNextLearningItem: () => ({
    navigateToNextLesson: jest.fn(),
    nextLesson: {},
    isLoading: false,
  }),
}));

describe('Learning Card Component', () => {
  it('should render the title slide', async () => {
    await waitFor(() => {
      render(
        <LearnerLesson
          navigation={{}}
          route={{
            params: { invitationId: '123', learningItemEnrollmentId: '234' },
          }}></LearnerLesson>,
      );
    });
    expect(screen.getByText(/Get Started/i)).toBeTruthy();
  });
  it('should render a learner slide', async () => {
    await waitFor(() => {
      render(
        <LearnerLesson
          navigation={{}}
          route={{
            params: { invitationId: '123', learningItemEnrollmentId: '234' },
          }}></LearnerLesson>,
      );
    });
    fireEvent.press(screen.getByTestId('lesson-next-button'));
    expect(screen.getByText(/Continue/i)).toBeTruthy();
    fireEvent.press(screen.getByTestId('lesson-prev-button'));
    expect(screen.getByText(/Get Started/i)).toBeTruthy();
  });
  it('should render the exit slide', async () => {
    await waitFor(() => {
      render(
        <LearnerLesson
          navigation={{}}
          route={{
            params: { invitationId: '123', learningItemEnrollmentId: '234' },
          }}></LearnerLesson>,
      );
    });
    fireEvent.press(screen.getByTestId('lesson-next-button'));
    fireEvent.press(screen.getByTestId('lesson-next-button'));
    expect(screen.getByText(/Back to Course/i)).toBeTruthy();
  });
});
