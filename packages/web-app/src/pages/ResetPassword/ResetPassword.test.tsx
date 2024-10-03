import { render, screen, fireEvent, waitFor } from '@tests/testing';
import ResetPassword from '.';

const mockedUsedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

describe('Reset Password Component', () => {
  it('should show an error message with an invalid password requirements', async () => {
    render(<ResetPassword />);
    const input = screen.getByPlaceholderText('New Password');
    const submitButton = screen.getByTestId('form-button');
    fireEvent.change(input, { target: { value: '123' } });
    await waitFor(() => {
      expect(submitButton).toBeDisabled();
    });
  });

  it('should show an success alert with an valid passwords', async () => {
    render(<ResetPassword />);
    const input = screen.getByPlaceholderText('New Password');
    const input1 = screen.getByPlaceholderText('Confirm Password');
    const submitButton = screen.getByTestId('form-button');
    fireEvent.change(input, { target: { value: 'Password1!' } });
    fireEvent.change(input1, { target: { value: 'Password1!' } });
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(submitButton).toBeEnabled();
    });
  });

  it('should show an error message with an password does not match', async () => {
    render(<ResetPassword />);
    const input = screen.getByPlaceholderText('New Password');
    const input1 = screen.getByPlaceholderText('Confirm Password');
    const submitButton = screen.getByTestId('form-button');
    fireEvent.change(input, { target: { value: 'Password1!' } });
    fireEvent.change(input1, { target: { value: 'Password' } });
    await waitFor(() => {
      expect(submitButton).toBeDisabled();
    });
  });
});
