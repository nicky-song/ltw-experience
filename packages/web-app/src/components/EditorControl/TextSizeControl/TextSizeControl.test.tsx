import { render, screen, fireEvent } from '@tests/testing';
import TextSizeControl from './index';

describe('Text Size Control', () => {
  it('should have all buttons', () => {
    render(<TextSizeControl />);
    const largeButton: HTMLElement = screen.getByTestId(
      'text-size-control-large-button',
    );
    const mediumButton: HTMLElement = screen.getByTestId(
      'text-size-control-medium-button',
    );
    const smallButton: HTMLElement = screen.getByTestId(
      'text-size-control-small-button',
    );
    expect(largeButton).toBeInTheDocument();
    expect(mediumButton).toBeInTheDocument();
    expect(smallButton).toBeInTheDocument();
  });
  it('should invoke callback prop when large button is selected', () => {
    const mockToggleIsTextLarge = jest.fn();
    render(
      <TextSizeControl
        isTextLarge={true}
        toggleIsTextLarge={mockToggleIsTextLarge}
      />,
    );
    const largeButton: HTMLElement = screen.getByTestId(
      'text-size-control-large-button',
    );
    fireEvent.click(largeButton);
    expect(mockToggleIsTextLarge).toHaveBeenCalled();
  });
});
