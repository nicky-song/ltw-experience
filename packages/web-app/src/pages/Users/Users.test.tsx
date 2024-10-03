import { render, screen, fireEvent, waitFor } from '@/tests/testing';
import Users from '.';

const mockedUsedNavigate = jest.fn();

jest.mock('@hooks/reduxHooks', () => ({
  useAppSelector: () => ({
    users: [
      {
        id: '1',
        firstName: 'firstName',
        lastName: 'lastName1',
        email: 'email1',
        phoneNumber: '1234567890',
        roles: ['user'],
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
  useNavigate: () => mockedUsedNavigate,
  useLocation: () => ({
    pathname: 'path',
  }),
}));

describe('AdminUsers Component', () => {
  it('should render the AdminUsers component', async () => {
    render(<Users></Users>);
    expect(screen.getByText(/Create User/i)).toBeInTheDocument();
  });

  it('should render the Create User modal', async () => {
    render(<Users></Users>);
    const createUserBtn = screen.getByText('Create User');
    fireEvent.click(createUserBtn);
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  it('should show an error message with invalid email and phone number', async () => {
    render(<Users></Users>);
    const userBtn = screen.getByText('Create User');
    fireEvent.click(userBtn);
    const emailInput = screen.getByPlaceholderText('Email');
    const phoneInput = screen.getByPlaceholderText('Phone Number');
    fireEvent.change(emailInput, { target: { value: 'hello' } });
    fireEvent.change(phoneInput, { target: { value: 'hello' } });
    await waitFor(() => {
      expect(
        screen.getByText('Please input a valid email.'),
      ).toBeInTheDocument();
      expect(
        screen.getByText('Please input a valid Phone Number.'),
      ).toBeInTheDocument();
    });
  });

  it('should close the modal on cancel', async () => {
    render(<Users />);
    const userBtn = screen.getByText('Create User');
    fireEvent.click(userBtn);
    const cancelBtn = screen.getByText('Cancel');
    fireEvent.click(cancelBtn);
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('download Learner Activity Report', async () => {
    render(<Users />);
    const detailsBtn = screen.getByText('...');
    fireEvent.mouseOver(detailsBtn);
    await waitFor(() => {
      const downloadBtn = screen.getByText('Download Learner Activity');
      expect(screen.getByText('Download Learner Activity')).toBeInTheDocument();
      fireEvent.click(downloadBtn);
    });
  });
});
