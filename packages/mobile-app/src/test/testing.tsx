import React, { ReactElement } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AntProvider } from '../providers/AntProvider';
import { ReactQueryProvider } from '../providers/ReactQueryProvider';
import { render, RenderOptions } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { EnhancedStore } from '@reduxjs/toolkit';
import { RootState, setupStore } from '../redux/store';
import type { PreloadedState } from '@reduxjs/toolkit';
import { QueryClient, QueryClientProvider } from 'react-query';
import { PortalProvider } from '@gorhom/portal';

// This type interface extends the default options for render from RTL, as well
// as allows the user to specify other things such as initialState, store.
interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: PreloadedState<RootState>;
  store?: EnhancedStore;
}

const mockedQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const renderWithProviders = (
  ui: ReactElement,
  {
    preloadedState = {},
    // Automatically create a store instance if no store was passed in
    store = setupStore(preloadedState),
    ...options
  }: ExtendedRenderOptions = {},
) => {
  function AllTheProviders({ children }: { children: React.ReactNode }) {
    return (
      <ReactQueryProvider>
        <AntProvider>
          <PortalProvider>
            <NavigationContainer>
              <QueryClientProvider client={mockedQueryClient}>
                <Provider store={store}>{children}</Provider>
              </QueryClientProvider>
            </NavigationContainer>
          </PortalProvider>
        </AntProvider>
      </ReactQueryProvider>
    );
  }
  return { store, ...render(ui, { wrapper: AllTheProviders, ...options }) };
};

export * from '@testing-library/react-native';
export { renderWithProviders as render };
