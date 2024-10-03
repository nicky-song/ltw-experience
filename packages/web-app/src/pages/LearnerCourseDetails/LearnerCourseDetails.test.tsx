import LearnerCourseDetails from '.';
import { render, screen } from '@tests/testing';

jest.mock('@hooks/reduxHooks', () => ({
  useAppSelector: () => ({
    learningItemList: [
      {
        id: '1',
        name: 'lesson title 1',
        description: 'lesson description 1',
        cards: [1, 2, 3],
      },
      {
        id: '2',
        name: 'lesson title 2',
        description: 'lesson description 2',
        cards: [1, 2, 3, 4],
      },
    ],
    courseDetails: {
      id: '1',
      title: 'course title 1',
      description: 'lesson description 1',
    },

    learningItemEnrollments: [
      {
        id: '1',
        courseEnrollment: 'lesson title 1',
        learningItemId: '1',
        progress: 0,
      },
      {
        id: '2',
        courseEnrollment: 'lesson title 2',
        learningItemId: '2',
        progress: 0,
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
    invitationId: '1',
  }),
}));

describe('LearnerCourseDetails', () => {
  it('should render list of learning items', async () => {
    render(<LearnerCourseDetails></LearnerCourseDetails>);
    expect(screen.getByText('course title 1')).toBeInTheDocument();
    expect(screen.getByText('lesson title 1')).toBeInTheDocument();
    expect(screen.getByText('lesson description 1')).toBeInTheDocument();
    expect(screen.getByText('lesson title 2')).toBeInTheDocument();
    expect(screen.getByText('lesson description 2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /start/i })).toHaveLength(2);
  });
});
