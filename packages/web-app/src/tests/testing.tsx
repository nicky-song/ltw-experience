import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { EnhancedStore } from '@reduxjs/toolkit';
import type { PreloadedState } from '@reduxjs/toolkit';
import { QueryClient, QueryClientProvider } from 'react-query';
import { RootState, setupStore } from '@/redux/store';

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
      <QueryClientProvider client={mockedQueryClient}>
        <Provider store={store}>{children}</Provider>
      </QueryClientProvider>
    );
  }
  return { store, ...render(ui, { wrapper: AllTheProviders, ...options }) };
};
// re-export everything
export * from '@testing-library/react';
// override render method
export { renderWithProviders as render };
