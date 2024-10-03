import renderer from 'react-test-renderer';
import { NotFound } from './NotFound';

describe('NotFound Component', () => {
  it('matches snapshot', () => {
    const activityIndicator1 = renderer.create(<NotFound />);
    expect(activityIndicator1).toMatchSnapshot();
  });
});
