import App from './App';
import { render, screen } from '@testing-library/react-native';

// mock SplashScreen (for some reason it doesn't clear in jest)
jest.mock('./providers/LoadingSplashScreen', () => ({
  LoadingSplashScreen: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

describe('App', () => {
  it('renders', async () => {
    render(<App />);
    expect(await screen.findByText('Welcome to Learn To Win')).toBeTruthy();
  });
});
