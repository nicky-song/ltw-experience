import { render, waitFor, screen, fireEvent } from '@tests/testing';
import LearnerLesson from '.';

jest.mock('@learn-to-win/common/hooks/useLearningItem', () => ({
  useLearningItem: () => ({
    learningItemLoading: false,
    learningItemError: '',
    learningItemData: {},
  }),
}));
jest.mock('@hooks/reduxHooks', () => ({
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
  }),
  useAppDispatch: () =>
    function () {
      return null;
    },
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  useLocation: () => ({
    pathname: '',
  }),
  useParams: () => ({
    learningItemEnrollmentId: '1',
    invitationId: '1',
  }),
}));

describe('Learning Card Component', () => {
  it('should render the title slide', async () => {
    await waitFor(() => {
      render(<LearnerLesson></LearnerLesson>);
    });
    expect(screen.getByText(/Get Started/i)).toBeInTheDocument();
  });

  it('should render a learner slide', async () => {
    await waitFor(() => {
      render(<LearnerLesson></LearnerLesson>);
    });
    fireEvent.click(screen.getByTestId('lesson-next-button'));
    expect(screen.getByText(/Continue/i)).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('lesson-prev-button'));
    expect(screen.getByText(/Get Started/i)).toBeInTheDocument();
  });

  it('should render the exit slide', async () => {
    await waitFor(() => {
      render(<LearnerLesson></LearnerLesson>);
    });
    fireEvent.click(screen.getByTestId('lesson-next-button'));
    fireEvent.click(screen.getByTestId('lesson-next-button'));
    expect(screen.getByText(/Back to Courses/i)).toBeInTheDocument();
  });

  it('should update the progress count', async () => {
    await waitFor(() => {
      render(<LearnerLesson></LearnerLesson>);
    });
    fireEvent.click(screen.getByTestId('lesson-next-button'));
    expect(screen.getByText(/content blocks!/i)).toBeInTheDocument();
  });
  it('should open the card drawer and display items', async () => {
    await waitFor(() => {
      render(<LearnerLesson></LearnerLesson>);
    });

    fireEvent.click(screen.getByTestId('opn-lsn-details'));
    expect(screen.getByText(/Lesson Details/i)).toBeInTheDocument();
    expect(screen.getByText(/card title 2/i)).toBeInTheDocument();
  });
});
