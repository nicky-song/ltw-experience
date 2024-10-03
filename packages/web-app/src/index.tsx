import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Amplify } from 'aws-amplify';
import 'antd/dist/reset.css';

import './index.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { setupStore } from './redux/store';
import { Provider } from 'react-redux';
import { ConfigProvider } from 'antd';
import { QueryClient, QueryClientProvider } from 'react-query';
import {
  AUTH_REGION,
  AUTH_USER_POOL_ID,
  AUTH_USER_POOL_WEB_CLIENT_ID,
} from './constants/envVariables';
import tokens from './tokens/figma-tokens.json';
import { ErrorBoundary } from '@components/ErrorBoundary';

Amplify.configure({
  aws_cognito_region: AUTH_REGION,
  aws_user_pools_id: AUTH_USER_POOL_ID,
  aws_user_pools_web_client_id: AUTH_USER_POOL_WEB_CLIENT_ID,
});

const theme = {
  token: {
    colorPrimary: tokens.colorPrimary.value,
    colorPrimaryHover: tokens.colorPrimaryHover.value,
    // the below color is specific to antd. Normally antd would pick this
    // color based on colorPrimary. The color it picks is #000 and that
    // doesn't look good so I've manually overridden in here.
    colorPrimaryBg: 'rgba(0, 0, 0, 0.05)',
    colorBgTextHover: tokens.colorSuccessBg.value,
  },
};

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={setupStore()}>
        <QueryClientProvider client={queryClient}>
          <ConfigProvider theme={theme}>
            <ErrorBoundary>
              <App />
            </ErrorBoundary>
          </ConfigProvider>
        </QueryClientProvider>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
