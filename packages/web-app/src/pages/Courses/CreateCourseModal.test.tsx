import { render, screen } from '@tests/testing';
import { CreateCourseModal } from './CreateCourseModal';

describe('CreateCourseModal Component', () => {
  it('render properly', () => {
    const setIsOpen = jest.fn();
    render(
      <CreateCourseModal
        isOpen={true}
        setIsOpen={setIsOpen}></CreateCourseModal>,
    );
    expect(screen.getByText('Create')).toBeInTheDocument();
  });
});
