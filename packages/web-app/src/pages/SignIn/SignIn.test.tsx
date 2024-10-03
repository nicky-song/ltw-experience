import { fireEvent, render, screen, waitFor } from '@tests/testing';
import { useAppSelector } from '@hooks/reduxHooks';
import SignIn from '.';
import { RootState } from '@/redux/store';

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockedNavigate,
}));

jest.mock('@hooks/reduxHooks', () => ({
  useAppSelector: jest.fn(),
  useAppDispatch: jest.fn(),
}));

type UseSelectorMock = jest.Mock<
  ReturnType<typeof useAppSelector>,
  [selector: (state: RootState) => ReturnType<typeof useAppSelector>]
>;

describe('SignIn Component', () => {
  const initialState = {
    auth: {
      shouldChangePassword: false,
      loading: false,
      error: null,
      isAuthenticated: false,
      isInitialAuthLoading: false,
      userRoles: [],
      user: {},
      userId: '',
      tempCognitoUser: null,
    },
    course: {
      loading: false,
      error: null,
      courseList: [],
      courseDetails: {
        id: '',
        title: '',
        description: '',
      },
      enrolledCourseList: [],
    },
    user: {
      loading: false,
      error: null,
      userCreated: false,
    },
    learningItem: {
      learningItemList: [],
      learningItemDetails: null,
      loading: false,
      error: null,
    },
    enrollment: {
      enrollments: [],
      cardEnrollments: [],
      learningItemEnrollments: [],
      courseEnrollment: [],
      loading: true,
      error: null,
    },
    card: {
      cards: [],
      selectedCardId: null,
      loading: true,
      error: null,
    },
  };

  it('renders', () => {
    const useSelectorMock = useAppSelector as UseSelectorMock;
    useSelectorMock.mockImplementation(
      (cb) =>
        cb({
          ...initialState,
        }) as ReturnType<typeof cb>,
    );
    render(<SignIn />);
    const signInText = screen.getByTestId('signInText');
    expect(signInText).toBeInTheDocument();
  });

  it('should have an href of /forgot-password', () => {
    render(<SignIn />);
    const link = screen.getByText('Forgot Password');
    expect(link).toHaveAttribute('href', '/forgot-password');
  });
  it('should have Sign In button and error message on login details in the document', async () => {
    render(<SignIn />);
    const signInButton = screen.getByTestId('signInButton');
    expect(signInButton).toBeInTheDocument();
    fireEvent.click(signInButton);
    await waitFor(() => {
      expect(
        screen.getByText('Missing login details. Please try again.'),
      ).toBeInTheDocument();
    });
  });
  it('should have show error message for invalid email', async () => {
    render(<SignIn />);
    const emailInput = screen.getByPlaceholderText('Email');
    fireEvent.change(emailInput, { target: { value: 'test' } });
    const signInButton = screen.getByTestId('signInButton');
    fireEvent.click(signInButton);
    await waitFor(() => {
      expect(
        screen.getByText('Invalid email. Please try again.'),
      ).toBeInTheDocument();
    });
  });
  it('should have show error message for missing password', async () => {
    render(<SignIn />);
    const emailInput = screen.getByPlaceholderText('Email');
    fireEvent.change(emailInput, { target: { value: 'test@gmail.com' } });
    const signInButton = screen.getByTestId('signInButton');
    fireEvent.click(signInButton);
    await waitFor(() => {
      expect(
        screen.getByText('Password is missing. Please try again.'),
      ).toBeInTheDocument();
    });
  });
  it('should have show error message for missing email', async () => {
    render(<SignIn />);
    const passwordInput = screen.getByPlaceholderText('Password');
    fireEvent.change(passwordInput, { target: { value: 'test' } });
    const signInButton = screen.getByTestId('signInButton');
    fireEvent.click(signInButton);
    await waitFor(() => {
      expect(
        screen.getByText('Email is missing. Please try again.'),
      ).toBeInTheDocument();
    });
  });
  it('should have show log in the use with login details', async () => {
    const useSelectorMock = useAppSelector as UseSelectorMock;
    useSelectorMock.mockImplementation(
      (cb) =>
        cb({
          ...initialState,
          auth: {
            ...initialState.auth,
            isAuthenticated: true,
          },
        }) as ReturnType<typeof cb>,
    );
    render(<SignIn />);
    const emailInput = screen.getByPlaceholderText('Email');
    fireEvent.change(emailInput, { target: { value: 'test@gmail.com' } });
    const passwordInput = screen.getByPlaceholderText('Password');
    fireEvent.change(passwordInput, { target: { value: 'test' } });
    const signInButton = screen.getByTestId('signInButton');
    fireEvent.click(signInButton);
    expect(mockedNavigate).toBeCalledWith('/admin/dashboard');
  });

  it('should navigate to change password page when shouldChangePassword=true', () => {
    const useSelectorMock = useAppSelector as UseSelectorMock;
    useSelectorMock.mockImplementation(
      (cb) =>
        cb({
          ...initialState,
          auth: {
            ...initialState.auth,
            shouldChangePassword: true,
          },
        }) as ReturnType<typeof cb>,
    );
    render(<SignIn />);
    expect(mockedNavigate).toBeCalledWith('/change-password');
  });
});
