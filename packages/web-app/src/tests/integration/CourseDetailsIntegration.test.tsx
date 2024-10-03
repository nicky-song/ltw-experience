import { render, screen, fireEvent, waitFor } from '@tests/testing';
import { MemoryRouter } from 'react-router-dom';
import CourseDetails from '../../pages/CourseDetails';
import { getCourseDetails } from '@learn-to-win/common/features/Courses/coursesService';
import {
  getLearningItemsAPI,
  createLearningItem,
} from '@learn-to-win/common/features/LearningItems/learningItemService';

jest.mock('@learn-to-win/common/features/Courses/coursesService');
jest.mock('@learn-to-win/common/features/LearningItems/learningItemService');

const navigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    courseId: '12345',
  }),
  useNavigate: () => navigate,
}));

describe('Integration tests for Admin Course Details page', () => {
  const setup = () => {
    (getCourseDetails as jest.Mock).mockResolvedValue({
      id: '1',
      title: 'Course 1',
      description: 'Course Description 1',
    });
    (getLearningItemsAPI as jest.Mock).mockResolvedValue([
      {
        id: '1',
        name: 'Lesson 1',
        description: 'Description 1',
        cards: [1, 2, 3],
      },
      {
        id: '2',
        name: 'Lesson 2',
        description: 'Description 2',
        cards: [1, 2, 3],
      },
    ]);
    (createLearningItem as jest.Mock).mockResolvedValue({
      id: '3',
      name: 'Lesson 3',
      description:
        "This is your lesson description. Give your learners an idea of what they're about to learn!",
      cards: [1, 2],
    });
    render(
      <MemoryRouter>
        <CourseDetails />
      </MemoryRouter>,
    );
  };
  it('should render course details page', async () => {
    setup();
    expect(
      await screen.findByRole('button', { name: 'Create' }),
    ).toBeInTheDocument();
    expect(await screen.findByText('Course 1')).toBeInTheDocument();
    expect(await screen.findByText('Lesson 1')).toBeInTheDocument();
    expect(await screen.findByText('Lesson 2')).toBeInTheDocument();
    expect(await screen.findByText('Description 1')).toBeInTheDocument();
    expect(await screen.findByText('Description 2')).toBeInTheDocument();
  });
  it('should navigate to lesson details page', async () => {
    setup();
    fireEvent.click(await screen.findByText('Lesson 1'));
    waitFor(() => {
      expect(navigate).toHaveBeenCalledWith('/learning_item/1');
      expect(screen.queryByText('Course 1')).not.toBeInTheDocument();
    });
  });
  it('should open create learning item modal', async () => {
    setup();
    fireEvent.click(await screen.findByRole('button', { name: 'Create' }));
    expect(
      await screen.findByRole('dialog', { name: 'Add New' }),
    ).toBeInTheDocument();
    expect(
      await screen.findByRole('heading', { name: 'Lesson' }),
    ).toBeInTheDocument();
    expect(
      await screen.findByRole('heading', { name: 'Quiz' }),
    ).toBeInTheDocument();
    expect(await screen.findByTestId('create-learning-item')).toBeDisabled();

    // Click on down arrow to open lesson form
    fireEvent.click(await screen.findByTestId('open-lesson-form'));
    expect(
      await screen.findByPlaceholderText('Lesson Name'),
    ).toBeInTheDocument();
    expect(
      await screen.findByPlaceholderText(/This is your lesson description/),
    ).toBeInTheDocument();

    // Click on down arrow to open quiz form
    fireEvent.click(await screen.findByTestId('open-quiz-form'));
    expect(
      await screen.queryByPlaceholderText('Lesson Name'),
    ).not.toBeInTheDocument();
    expect(
      await screen.queryByPlaceholderText(/This is your lesson description/),
    ).not.toBeInTheDocument();
    expect(await screen.findByPlaceholderText('Quiz Name')).toBeInTheDocument();
    expect(
      await screen.findByPlaceholderText(/This is your quiz description/),
    ).toBeInTheDocument();
  });

  it('should create a lesson', async () => {
    setup();
    fireEvent.click(await screen.findByRole('button', { name: 'Create' }));
    expect(
      await screen.findByRole('dialog', { name: 'Add New' }),
    ).toBeInTheDocument();
    // Open lesson form
    fireEvent.click(await screen.findByTestId('open-lesson-form'));
    fireEvent.change(await screen.findByPlaceholderText('Lesson Name'), {
      target: { value: 'Lesson 3' },
    });
    const createLessonButton = await screen.findByTestId(
      'create-learning-item',
    );
    expect(createLessonButton).toBeEnabled();
    fireEvent.click(createLessonButton);
    waitFor(() => {
      expect(navigate).toHaveBeenCalledWith('/learning_item/3');
      expect(
        screen.findByRole('dialog', { name: 'Add New' }),
      ).not.toBeInTheDocument();
      screen.debug();
    });
  });
});
