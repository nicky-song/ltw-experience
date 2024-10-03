import { ChangeTempPassword } from './ChangeTempPassword';
import { render, screen, fireEvent } from '../../test/testing';
import { changePassword, resetPassword } from '../../features/Auth/authService';
import { loginSuccess } from '@learn-to-win/common/features/Auth/authSlice';
import { waitFor } from '@testing-library/react-native';
import { ResetPassword } from './index';

jest.mock('../../features/Auth/authService', () => ({
  changePassword: jest.fn(),
  getAllUserInfo: jest.fn(() => ({
    id: '123',
  })),
  resetPassword: jest.fn(),
}));

const mockDispatch = jest.fn();

jest.useFakeTimers();

jest.mock('../../hooks/reduxHooks', () => ({
  useAppDispatch: jest.fn(() => mockDispatch),
  useAppSelector: jest.fn(() => ({
    tempCognitoUser: null,
  })),
}));

// mock react-navigation
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    goBack: jest.fn(),
  }),
  useRoute: () => ({
    params: {
      id: '123',
      code: '123',
    },
  }),
}));

describe('Reset Password Flows', () => {
  it('ChangeTempPassword', async () => {
    render(<ChangeTempPassword />);

    expect(screen.getByText('Change Temp Password')).toBeTruthy();

    // type in password
    fireEvent.changeText(
      screen.getByPlaceholderText('New Password'),
      'Password1!',
    );
    fireEvent.changeText(
      screen.getByPlaceholderText('Confirm Password'),
      'Password1!',
    );
    fireEvent.press(screen.getByTestId('new-password-button'));

    await waitFor(() => expect(changePassword).toHaveBeenCalled());
    jest.runAllTimers();

    await waitFor(() =>
      expect(mockDispatch).toHaveBeenCalledWith(loginSuccess({ id: '123' })),
    );
  });

  it('ResetPassword', async () => {
    render(<ResetPassword />);

    expect(screen.getByText('Reset Your Password')).toBeTruthy();

    // type in password
    fireEvent.changeText(
      screen.getByPlaceholderText('New Password'),
      'Password1!',
    );
    fireEvent.changeText(
      screen.getByPlaceholderText('Confirm Password'),
      'Password1!',
    );
    fireEvent.press(screen.getByTestId('new-password-button'));

    await waitFor(() => expect(resetPassword).toHaveBeenCalled());
  });
});
