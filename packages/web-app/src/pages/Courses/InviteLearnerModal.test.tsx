import InviteLearnerModal from './InviteLearnerModal';
import { render, screen, waitFor, fireEvent } from '@tests/testing';
jest.mock('@hooks/reduxHooks', () => ({
  useAppSelector: () => ({
    users: [
      {
        id: '1',
        role: 'user',
        firstName: '',
        lastName: '',
        email: 'hi@gmail.com',
      },
    ],
  }),
  useAppDispatch: () =>
    function () {
      return null;
    },
}));
describe('Invite Learner Modal', () => {
  const props = {
    adminId: '13',
    courseId: '12',
    isOpen: true,
    setIsOpen: jest.fn(),
  };
  it('should render a list of users', async () => {
    render(<InviteLearnerModal {...props} />);
    expect(screen.getByText('Invite')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText('hi@gmail.com')).toBeInTheDocument();
    });
  });

  it('request invitations when submitting', async () => {
    render(<InviteLearnerModal {...props} />);
    fireEvent.click(screen.getByText('Invite'));
    await waitFor(() => {
      expect(
        screen.getByText('Successfully Invited User(s)'),
      ).toBeInTheDocument();
    });
  });
});
