import { LoadingSplashScreen } from './LoadingSplashScreen';
import { render } from '../test/testing';
import { View } from 'react-native';

describe('LoadingSplashScreen', () => {
  it('should render children when isInitialAuthLoading is false', async () => {
    // Render the LoadingSplashScreen component with children
    const { getByTestId } = render(
      <LoadingSplashScreen>
        <View testID='children' />
      </LoadingSplashScreen>,
      {
        preloadedState: {
          auth: {
            isInitialAuthLoading: false,
          },
        },
      },
    );

    // Assert that the children are rendered
    expect(await getByTestId('children')).toBeTruthy();
  });
});
