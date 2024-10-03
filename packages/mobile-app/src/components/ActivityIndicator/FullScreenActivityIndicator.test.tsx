import { render, screen } from '../../test/testing';
import { FullScreenActivityIndicator } from './FullScreenActivityIndicator';
import renderer from 'react-test-renderer';

describe('FullScreenActivityIndicator Component', () => {
  it('renders', () => {
    render(<FullScreenActivityIndicator />);
    expect(screen.getByTestId('activity-indicator')).toBeTruthy();
  });
  it('renders with text', () => {
    render(<FullScreenActivityIndicator text={'test'} />);
    expect(screen.getByText('test')).toBeTruthy();
  });

  it('matches snapshot', () => {
    const activityIndicator1 = renderer.create(<FullScreenActivityIndicator />);
    expect(activityIndicator1).toMatchSnapshot();

    const activityIndicator2 = renderer.create(
      <FullScreenActivityIndicator text={'test'} />,
    );

    expect(activityIndicator2).toMatchSnapshot();
  });
});
