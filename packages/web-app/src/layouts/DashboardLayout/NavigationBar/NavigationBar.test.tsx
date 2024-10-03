import {
  fireEvent,
  render,
  screen,
  waitFor,
  act,
} from '@testing-library/react';
import NavigationBar from '.';

const mockedUsedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockedUsedNavigate,
  useLocation: () => ({
    pathname: '/admin-dashboard',
  }),
}));

describe('NavigationBar Component', () => {
  beforeEach(async () => {
    await waitFor(() => {
      render(<NavigationBar></NavigationBar>);
    });
  });
  it('should render the left dropdown', async () => {
    act(() => {
      fireEvent.mouseOver(screen.getByTestId('roleDropdown'));
    });

    await waitFor(() => {
      fireEvent.click(screen.getByText(/^Admin$/));
    });

    await waitFor(() => {
      expect(screen.getByText(/^A$/)).toBeInTheDocument();
    });
  });
  it('should display options when dropdown is clicked', async () => {
    act(() => {
      fireEvent.mouseOver(screen.getByTestId('roleDropdown'));
    });

    await waitFor(() => {
      expect(screen.getByText(/^Super Admin$/i)).toBeInTheDocument();
      expect(screen.getByText(/^Admin$/i)).toBeInTheDocument();
      expect(screen.getByText(/^Learner$/i)).toBeInTheDocument();
    });
  });
  it('should navigate to the correct page when an option is clicked', async () => {
    act(() => {
      fireEvent.mouseOver(screen.getByTestId('roleDropdown'));
    });

    await waitFor(() => {
      fireEvent.click(screen.getByText(/^Super Admin$/i));
      expect(mockedUsedNavigate).toHaveBeenCalledWith(
        '/superadmin/organizations',
      );
    });
  });
  it('should render the correct tabs when an options is clicked', async () => {
    act(() => {
      fireEvent.mouseOver(screen.getByTestId('roleDropdown'));
    });

    await waitFor(() => {
      fireEvent.click(screen.getByText(/^Admin$/));
    });
    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Courses')).toBeInTheDocument();
      expect(screen.getByText('Users')).toBeInTheDocument();
    });
  });
  it('should display the profile icon', async () => {
    await waitFor(() => {
      expect(screen.getByTestId('profileIcon')).toBeInTheDocument();
    });
  });
});
