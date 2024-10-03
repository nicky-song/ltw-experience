import { fireEvent, render, screen } from '../../test/testing';
import { ForgotPassword } from './';

describe('Forgot Password', () => {
  it('Works for basic tests', async () => {
    render(<ForgotPassword />);

    fireEvent.changeText(screen.getByPlaceholderText('Email'), 'test@test.com');
    fireEvent.press(screen.getByRole('button', { name: 'Send Instructions' }));

    expect(await screen.findByText('Check Your Email')).toBeTruthy();
  });

  it('Invalid email message', () => {
    render(<ForgotPassword />);

    fireEvent.press(screen.getByRole('button', { name: 'Send Instructions' }));

    expect(screen.getByText(/Email is missing/i)).toBeTruthy();

    fireEvent.changeText(screen.getByPlaceholderText('Email'), 'testemail.com');
    fireEvent.press(screen.getByRole('button', { name: 'Send Instructions' }));

    expect(screen.getByText(/invalid email/i)).toBeTruthy();
  });
});
