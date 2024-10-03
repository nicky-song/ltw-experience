export {};

declare global {
  interface Window {
    __RUNTIME_CONFIG__: {
      AUTH_URL: string;
      REACT_APP_AUTH_REGION: string;
      REACT_APP_AUTH_USER_POOL_ID: string;
      REACT_APP_AUTH_USER_POOL_WEB_CLIENT_ID: string;
    };
  }
}
