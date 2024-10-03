import { fireEvent, render, screen } from '../test/testing';
import { Login } from './Login';

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockedNavigate,
}));

jest.mock('../hooks/reduxHooks', () => ({
  useAppSelector: jest.fn(() => ({
    error: 'Incorrect username or password',
    loading: null,
    isAuthenticated: null,
  })),
  useAppDispatch: jest.fn(),
}));

describe('Login', () => {
  it('requires password', () => {
    render(<Login />);

    fireEvent.changeText(
      screen.getByPlaceholderText('Email'),
      'test@email.com',
    );
    fireEvent.press(screen.getByRole('button', { name: 'Login' }));

    expect(
      screen.getByText('Password is missing. Please try again.'),
    ).toBeTruthy();
  });
  it('requires password and email', () => {
    render(<Login />);

    fireEvent.press(screen.getByRole('button', { name: 'Login' }));

    expect(
      screen.getByText('Missing login details. Please try again.'),
    ).toBeTruthy();
  });
  it('requires valid email', () => {
    render(<Login />);

    fireEvent.changeText(screen.getByPlaceholderText('Email'), 'testemail.com');
    fireEvent.press(screen.getByRole('button', { name: 'Login' }));

    expect(screen.getByText('Invalid email. Please try again.')).toBeTruthy();
  });
  it('requires email', () => {
    render(<Login />);

    fireEvent.changeText(
      screen.getByPlaceholderText('Password'),
      'testpassword',
    );
    fireEvent.press(screen.getByRole('button', { name: 'Login' }));

    expect(
      screen.getByText('Email is missing. Please try again.'),
    ).toBeTruthy();
  });
});
