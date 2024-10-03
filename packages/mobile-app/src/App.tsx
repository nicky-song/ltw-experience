import 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import { setupStore } from './redux/store';
import { ReactQueryProvider } from './providers/ReactQueryProvider';
import { AntProvider } from './providers/AntProvider';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AppNavigation } from './AppNavigation';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LoadingSplashScreen } from './providers/LoadingSplashScreen';

const queryClient = new QueryClient();
const store = setupStore();

export default function App() {
  return (
    <ReactQueryProvider>
      <AntProvider>
        <Provider store={store}>
          <SafeAreaProvider>
            <QueryClientProvider client={queryClient}>
              <LoadingSplashScreen>
                <AppNavigation />
              </LoadingSplashScreen>
            </QueryClientProvider>
          </SafeAreaProvider>
        </Provider>
      </AntProvider>
    </ReactQueryProvider>
  );
}
