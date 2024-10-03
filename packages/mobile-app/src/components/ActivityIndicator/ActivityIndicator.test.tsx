import { ActivityIndicator } from './ActivityIndicator';
import renderer from 'react-test-renderer';

describe('ActivityIndicator', () => {
  it('should render', () => {
    const activityIndicator = renderer.create(<ActivityIndicator />);
    expect(activityIndicator).toMatchSnapshot();
  });

  it('renders Small', () => {
    const activityIndicator = renderer.create(
      <ActivityIndicator size='small' />,
    );
    expect(activityIndicator).toMatchSnapshot();
  });
});
