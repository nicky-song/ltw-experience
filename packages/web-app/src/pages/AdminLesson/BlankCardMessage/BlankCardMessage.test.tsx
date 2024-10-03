import { render, waitFor, screen } from '@tests/testing';
import { BlankCardMessage } from './BlankCardMessage';

test('renders blank card', async () => {
  render(<BlankCardMessage />);

  await waitFor(() => {
    expect(
      screen.getByText(
        'From text and images to video and more, the choice is yours! Explore',
      ),
    ).toBeInTheDocument();
  });
});
