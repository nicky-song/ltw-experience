import { render, screen, fireEvent, waitFor } from '@tests/testing';
import ChangePassword from '.';

const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));
jest.mock('react-query', () => ({
  ...jest.requireActual('react-query'),
  useMutation: jest.fn(({ onSuccess }) => ({
    mutate: jest.fn(() => {
      onSuccess();
    }),
    isError: false,
    isSuccess: false,
  })),
}));
jest.mock('@hooks/reduxHooks', () => ({
  useAppSelector: () => ({
    auth: {
      user: {},
    },
  }),
  useAppDispatch: () =>
    function () {
      return null;
    },
}));

describe('ChangePassword Component', () => {
  const setUp = () => {
    render(<ChangePassword />);
    const title = screen.getByText('Change Temporary Password');
    const passwordInput = screen.getByPlaceholderText('New Password');
    const confirmPasswordInput =
      screen.getByPlaceholderText('Confirm Password');
    const button = screen.getByRole('button', { name: /update password/i });

    return { title, passwordInput, confirmPasswordInput, button };
  };

  it('renders', () => {
    const { title, passwordInput, confirmPasswordInput, button } = setUp();
    expect(title).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(confirmPasswordInput).toBeInTheDocument();
    expect(button).toBeInTheDocument();
  });

  it('should route the user to the dashboard on successful password change', async () => {
    const { passwordInput, confirmPasswordInput, button } = setUp();
    fireEvent.change(passwordInput, { target: { value: 'Welcome1!' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'Welcome1!' } });
    button.click();
    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith('/admin/dashboard');
    });
  });
});
