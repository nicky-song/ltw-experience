import Invitations from '.';
import { waitFor, render, screen } from '@tests/testing';

jest.mock('@hooks/reduxHooks', () => ({
  useAppDispatch: () =>
    function () {
      return null;
    },
  useAppSelector: () => ({
    userId: '1',
    error: '',
    loading: false,
    enrollments: [
      { id: '1', userId: '1', progress: 0, courseId: '1' },
      { id: '2', userId: '1', progress: 50, courseId: '2' },
      { id: '3', userId: '1', progress: 100, courseId: '3' },
    ],
    enrolledCourseList: [
      { id: '1', name: 'testCourse', status: 'Not Started' },
      { id: '2', name: 'test2', status: 'Completed' },
      { id: '3', name: 'test3', status: 'In Progress' },
    ],
  }),
}));
jest.mock('react-router', () => ({
  useNavigate: jest.fn(),
  useLocation: () => ({
    pathname: '',
  }),
}));
describe('Invitations', () => {
  beforeEach(async () => {
    await waitFor(() => {
      render(<Invitations></Invitations>);
    });
  });
  it('should show a list of enrollments with a status', () => {
    expect(screen.getByText('Not Started')).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
    expect(screen.getByText('testCourse')).toBeInTheDocument();
  });
});
