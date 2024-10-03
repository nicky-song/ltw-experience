import { render, screen, fireEvent } from '../../../../test/testing';
import ConfidenceCard from './ConfidenceCard';

describe('Confidence check card', () => {
  it('should render the confidence check card', () => {
    render(<ConfidenceCard confidence={null} onCheck={() => {}} onClose={() => {}} />);
    expect(
      screen.getByText(/Select how confident you are with this answer/),
    ).toBeTruthy();
    const checkButton = screen.getByRole('button', { name: 'Check' });
    expect(checkButton).toBeTruthy();
    expect(checkButton).toBeDisabled();

    expect(screen.getByTestId('confidence-level-0')).toBeTruthy();
    expect(screen.getByTestId('confidence-level-25')).toBeTruthy();
    expect(screen.getByTestId('confidence-level-50')).toBeTruthy();
    expect(screen.getByTestId('confidence-level-75')).toBeTruthy();
    expect(screen.getByTestId('confidence-level-100')).toBeTruthy();

    fireEvent.press(screen.getByTestId('confidence-level-100'));
    expect(checkButton).toBeEnabled();
  });
});
