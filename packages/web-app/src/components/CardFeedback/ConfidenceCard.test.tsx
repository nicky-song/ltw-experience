import { render, screen } from '@tests/testing';
import ConfidenceCard from './ConfidenceCard';

describe('Confidence check card', () => {
  it('should render the confidence check card', () => {
    render(<ConfidenceCard editing />);
    expect(
      screen.getByText(/Select how confident you are with this answer/),
    ).toBeInTheDocument();
    const checkButton = screen.getByRole('button', { name: 'Check' });
    expect(checkButton).toBeInTheDocument();
    expect(checkButton).toBeDisabled();

    expect(screen.getByTestId('confidence-level-0')).toBeDisabled();
    expect(screen.getByTestId('confidence-level-25')).toBeDisabled();
    expect(screen.getByTestId('confidence-level-50')).toBeDisabled();
    expect(screen.getByTestId('confidence-level-75')).toBeDisabled();
    expect(screen.getByTestId('confidence-level-100')).toBeDisabled();
  });
  it('should render the card with enabled scale for learner', () => {
    render(<ConfidenceCard editing={false} />);
    expect(screen.queryByRole('button', { name: 'Check' })).toBeNull();
    expect(screen.getByTestId('confidence-level-0')).toBeEnabled();
    expect(screen.getByTestId('confidence-level-25')).toBeEnabled();
    expect(screen.getByTestId('confidence-level-50')).toBeEnabled();
    expect(screen.getByTestId('confidence-level-75')).toBeEnabled();
    expect(screen.getByTestId('confidence-level-100')).toBeEnabled();
  });
});
