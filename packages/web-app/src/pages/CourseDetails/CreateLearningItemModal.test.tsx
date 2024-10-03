import { fireEvent, render, screen, waitFor } from '@tests/testing';
import { CreateLearningItemModal } from './CreateLearningItemModal';
import '@learn-to-win/common/features/LearningItems/learningItemService';

const mockCourseId = '7a6196a0-58e0-458b-8080-26c9764f3c70';
jest.mock('@hooks/reduxHooks', () => ({
  useAppSelector: () => ({
    learningItemList: [
      { id: '1', name: 'testTitle', description: 'testDesc', cards: [1, 2, 3] },
      {
        id: '2',
        name: 'testTitle2',
        description: 'testDesc2',
        cards: [1, 2, 3, 4],
      },
    ],
  }),
  useAppDispatch: () =>
    function () {
      return null;
    },
}));
const navigate = jest.fn();
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: () => navigate,
  useLocation: () => ({
    pathname: `/admin/courses/${mockCourseId}/details`,
  }),
  useParams: () => ({
    courseId: mockCourseId,
  }),
}));

jest.mock(
  '@learn-to-win/common/features/LearningItems/learningItemService',
  () => ({
    createLearningItem: jest.fn(() => ({
      id: '1',
      name: 'test name',
      description: 'test description',
      type: 'lesson',
      state: 'draft',
      course: mockCourseId,
    })),
  }),
);

describe('Create Learning Item Modal', () => {
  it('should render the Create Learning Item Modal', async () => {
    render(
      <CreateLearningItemModal
        isOpen={true}
        setIsOpen={jest.fn()}></CreateLearningItemModal>,
    );
    expect(screen.getByText('Lesson')).toBeInTheDocument();
    expect(screen.getByText('Quiz')).toBeInTheDocument();
    expect(
      await screen.findByRole('button', { name: 'Create' }),
    ).toBeDisabled();
  });

  it('should show lesson form when clicking lesson card', async () => {
    render(
      <CreateLearningItemModal
        isOpen={true}
        setIsOpen={jest.fn()}></CreateLearningItemModal>,
    );
    const button = screen.getByText('Lesson');
    button.click();

    expect(
      await screen.findByPlaceholderText('Lesson Name'),
    ).toBeInTheDocument();
    expect(
      await screen.findByPlaceholderText(/This is your lesson description/),
    ).toBeInTheDocument();
    expect(
      await screen.findByRole('button', { name: 'Create' }),
    ).toBeDisabled();
  });

  it('should create lesson when clicking create for lesson', async () => {
    render(
      <CreateLearningItemModal
        isOpen={true}
        setIsOpen={jest.fn()}></CreateLearningItemModal>,
    );
    const button = screen.getByText('Lesson');
    button.click();

    const nameInput = await screen.findByPlaceholderText('Lesson Name');
    const descriptionInput = await screen.findByPlaceholderText(
      /This is your lesson description/,
    );
    const createButton = await screen.findByRole('button', { name: 'Create' });

    expect(createButton).toBeDisabled();
    fireEvent.change(nameInput, { target: { value: 'test name' } });
    fireEvent.change(descriptionInput, {
      target: { value: 'test description' },
    });

    expect(createButton).not.toBeDisabled();
    createButton.click();
    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith('/learning_item/1');
    });
  });

  it('should show quiz form when clicking quiz card', async () => {
    render(
      <CreateLearningItemModal
        isOpen={true}
        setIsOpen={jest.fn()}></CreateLearningItemModal>,
    );
    const button = screen.getByText('Quiz');
    button.click();

    expect(await screen.findByPlaceholderText('Quiz Name')).toBeInTheDocument();
    expect(
      await screen.findByPlaceholderText(/This is your quiz description/),
    ).toBeInTheDocument();
    expect(
      await screen.findByRole('button', { name: 'Create' }),
    ).toBeDisabled();
  });
});
