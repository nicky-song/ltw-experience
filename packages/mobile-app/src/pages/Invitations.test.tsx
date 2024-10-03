import { render, screen } from '../test/testing';
import { Invitations } from './Invitations';

describe('Invitations', () => {
  it('renders', () => {
    render(<Invitations navigation={() => null} />);
    expect(screen.getByText('Invitations:')).toBeTruthy();
  });
});
