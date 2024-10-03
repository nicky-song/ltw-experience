import { render, screen, cleanup } from '@tests/testing';
import TextAlignmentControl from './index';

afterEach(cleanup);

describe('Text Alignment Control', () => {
  it('should have all buttons', () => {
    render(
      <TextAlignmentControl
        isLeftAligned={true}
        isFullJustified={true}
        isCenterJustified={true}
        isRightAligned={true}
      />,
    );
    const leftAlignedButton: HTMLElement = screen.getByTestId(
      'text-alignment-control-left-align-button',
    );
    const fullJustifiedButton: HTMLElement = screen.getByTestId(
      'text-alignment-control-full-justified-button',
    );
    const centerJustifiedButton: HTMLElement = screen.getByTestId(
      'text-alignment-control-center-justified-button',
    );
    const rightAlignedButton: HTMLElement = screen.getByTestId(
      'text-alignment-control-right-align-button',
    );

    expect(leftAlignedButton).toBeInTheDocument();
    expect(fullJustifiedButton).toBeInTheDocument();
    expect(centerJustifiedButton).toBeInTheDocument();
    expect(rightAlignedButton).toBeInTheDocument();
  });
});
