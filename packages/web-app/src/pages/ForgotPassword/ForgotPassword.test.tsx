import { render, screen, fireEvent, waitFor } from '@tests/testing';
import ForgotPassword from '.';

jest.mock('@features/Auth/authService', () => ({
  forgotPassword: async () => Promise.resolve(),
}));

describe('Forgot Password Component', () => {
  it('should show an error message with no email input', async () => {
    render(<ForgotPassword />);
    const submitButton = screen.getByTestId('form-button');
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(
        screen.getByText('Email is missing. Please try again'),
      ).toBeInTheDocument();
    });
  });

  it('should show an error message with an invalid email', async () => {
    render(<ForgotPassword />);
    const input = screen.getByPlaceholderText('Email');
    const submitButton = screen.getByTestId('form-button');
    fireEvent.change(input, { target: { value: '123' } });
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(
        screen.getByText('Invalid email. Please try again'),
      ).toBeInTheDocument();
    });
  });

  it('should submit a reset password request with a valid email', async () => {
    render(<ForgotPassword />);
    const input = screen.getByPlaceholderText('Email');
    const submitButton = screen.getByTestId('form-button');
    fireEvent.change(input, { target: { value: 'hello@gmail.com' } });
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(screen.getByText('Check Your Email')).toBeInTheDocument();
      const backButton = screen.getByTestId('form-button');
      expect(backButton).toHaveAttribute('href', '/login');
    });
  });

  it('should have an href of /login', async () => {
    render(<ForgotPassword />);
    const link = screen.getByText('Back to Log In');
    expect(link).toHaveAttribute('href', '/login');
  });
});
