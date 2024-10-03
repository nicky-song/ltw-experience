import { render, screen } from '../test/testing';
import { CourseDetails } from './CourseDetails';

describe('Course Details', () => {
  it('renders', () => {
    render(
      <CourseDetails
        navigation={() => null}
        route={{ params: { invitationId: '123' } }}
      />,
    );
    expect(screen.getByText('Learning Items:')).toBeTruthy();
  });
  it('renders an error without params', () => {
    render(<CourseDetails navigation={() => null} route={{ params: {} }} />);
    expect(screen.getByText('Invitation ID required')).toBeTruthy();
  });
});
