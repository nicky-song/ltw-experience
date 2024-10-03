import { render, screen } from '@tests/testing';
import Courses from '.';

jest.mock('@hooks/reduxHooks', () => ({
  useAppSelector: () => ({
    courseList: [
      { id: '1', title: 'testTitle', description: 'testDesc' },
      { id: '2', title: 'testTitle2', description: 'testDesc2' },
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
    pathname: 'path',
  }),
}));

jest.mock('@/constants/envVariables', () => ({
  ORG_SERVICE_URL: '',
}));

describe('AdminCourses Component', () => {
  it('should render a list of courses in a dashboard', () => {
    render(<Courses></Courses>);
    expect(screen.getByText('testTitle')).toBeInTheDocument();
    expect(screen.getByText('testTitle2')).toBeInTheDocument();
  });
});
