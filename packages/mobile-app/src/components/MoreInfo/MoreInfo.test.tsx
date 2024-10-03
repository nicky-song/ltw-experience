import MoreInfo from './MoreInfo';
import { render, screen, waitFor, act, fireEvent } from '../../test/testing';

const longText =
  'This is some long text that should hopefully get truncated. This is some long text that should hopefully get truncated. This is some long text that should hopefully get truncated. This is some long text that should hopefully get truncated. This is some long text that should hopefully get truncated.';
describe('MoreInfo', () => {
  it('renders', async () => {
    render(<MoreInfo linesToTruncate={2} text={longText} />);

    fireEvent(screen.getByText(longText), 'textLayout', {
      nativeEvent: {
        lines: [
          {
            text: 'Some text that is longer than the 16 char ',
          },
          {
            text: 'some more text',
          },
        ],
      },
    });

    await waitFor(() => expect(screen.getByText('more')).toBeTruthy());
  });
});
