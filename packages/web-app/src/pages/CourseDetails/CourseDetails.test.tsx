import { render, screen } from '@tests/testing';
import AdminCourseLearningItems from '.';

jest.mock('@hooks/reduxHooks', () => ({
  useAppSelector: () => ({
    learningItemList: [
      { id: '1', name: 'testTitle', description: 'testDesc', cards: [1, 2, 3] },
      {
        id: '2',
        name: 'testTitle2',
        description: 'testDesc2',
        cards: [1, 2, 3, 4],
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
    courseId: '1',
  }),
}));

describe('admin course learning items', () => {
  it('should show a list of learning items for a course', () => {
    render(<AdminCourseLearningItems></AdminCourseLearningItems>);

    expect(screen.getByText('testTitle')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('testDesc')).toBeInTheDocument();
    expect(screen.getByText('testTitle2')).toBeInTheDocument();
    expect(screen.getByText('testDesc2')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
  });
});
