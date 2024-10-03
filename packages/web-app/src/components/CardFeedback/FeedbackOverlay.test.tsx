import { fireEvent, render, screen } from '@tests/testing';
import FeedbackOverlay from './FeedbackOverlay';
import { FeedBackType } from '@learn-to-win/common/constants/cardFeedbackType';

describe('FeedbackOverlay', () => {
  it('should render the FeedbackOverlay', () => {
    const mockOnClick = jest.fn();
    const props = {
      feedBack: 'correct' as FeedBackType,
      onClick: mockOnClick,
    };
    render(<FeedbackOverlay {...props} />);
    const overlayElement = screen.getByTestId('feedback-overlay');
    expect(overlayElement).toBeInTheDocument();
    expect(overlayElement).toHaveClass('feedback__overlay--enabled');
    fireEvent.click(overlayElement);
    expect(mockOnClick).toHaveBeenCalled();
  });

  it('should NOT render the FeedbackOverlay when feedback is null', () => {
    const mockOnClick = jest.fn();
    const props = {
      feedBack: null,
      onClick: mockOnClick,
    };
    render(<FeedbackOverlay {...props} />);
    const overlayElement = screen.getByTestId('feedback-overlay');
    expect(overlayElement).toBeInTheDocument();
    expect(overlayElement).toHaveClass('feedback__overlay--disabled');
  });

  it('should render the disabled confidence overlay when confidence check is disabled', () => {
    const props = {
      feedBack: 'confidence' as FeedBackType,
      isConfidenceCheckEnabled: false,
    };
    render(<FeedbackOverlay {...props} />);
    expect(screen.getByText(/Confidence Check Hidden/)).toBeInTheDocument();
  });
});
