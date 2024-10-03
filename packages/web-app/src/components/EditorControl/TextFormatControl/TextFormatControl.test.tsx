import { render, screen, cleanup } from '@tests/testing';
import TextFormatControl from './index';

afterEach(cleanup);

describe('Text Format Control', () => {
  it('should have all buttons', () => {
    render(<TextFormatControl />);
    const strongButton: HTMLElement = screen.getByTestId(
      'text-format-control-strong-button',
    );
    const italicButton: HTMLElement = screen.getByTestId(
      'text-format-control-italic-button',
    );
    const underlineButton: HTMLElement = screen.getByTestId(
      'text-format-control-underline-button',
    );
    expect(strongButton).toBeInTheDocument();
    expect(italicButton).toBeInTheDocument();
    expect(underlineButton).toBeInTheDocument();
  });
});
