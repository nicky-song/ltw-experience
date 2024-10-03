import { render, waitFor, screen } from '../../test/testing';
import { LessonDetails } from '.';

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
      },
      {
        id: '2',
        title: 'card title 2',
        json: {
          version: '1.0',
          description: 'card description 2',
          contentBlocks: [],
        },
      },
      {
        id: '3',
        title: 'card title 3',
        json: {
          version: '1.0',
          description: 'card description 3',
          contentBlocks: [],
        },
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
}));

describe('Learning Card Component', () => {
  it('should render the title slide', async () => {
    await waitFor(() => {
      render(
        <LessonDetails
          navigation={{}}
          route={{
            params: {
              invitationId: '123',
              learningItemEnrollmentId: '234',
              currentIndex: 1,
            },
          }}></LessonDetails>,
      );
    });
    expect(screen.getByText(/Lesson Details/i)).toBeTruthy();
  });
});
