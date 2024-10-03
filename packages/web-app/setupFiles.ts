// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import { defineWindowMatchMedia } from './src/utils/testUtils';

// mock the singleton restClient and other utils
jest.mock('@learn-to-win/common/utils/restClient', () => ({
  getRestClient: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    patch: jest.fn(),
  })),
  setRestClient: jest.fn(),
  getApiGatewayUrl: jest.fn(() => 'TEST_API_GATEWAY_URL'),
  setApiGatewayUrl: jest.fn(),
  setS3FilePath: jest.fn(),
}));

defineWindowMatchMedia();
// Mocked envVariables for some reason the import.meta.env was causing problems with jest
jest.mock('./src/constants/envVariables', () => ({
  API_GATEWAY_URL: 'API_GATEWAY_URL/',
  ORG_SERVICE_URL: 'ORG_SERVICE_URL/',
}));
jest.mock('lottie-web', () => ({
  default: {
    loadAnimation: jest.fn(),
    destroy: jest.fn(),
  },
}));

jest.mock('@prezly/slate-lists', () => ({
  withLists: () => {
    return (editor: any) => editor;
  },
  onKeyDown: jest.fn(),
}));

const mockIntersectionObserver = jest.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
});
window.IntersectionObserver = mockIntersectionObserver;

global.structuredClone = (v: object) => JSON.parse(JSON.stringify(v));

// Mock Auth and Amplify from aws-amplify
jest.mock('aws-amplify', () => ({
  Auth: {
    signIn: jest.fn(() => ({})),
    confirmSignUp: jest.fn(),
    completeNewPassword: jest.fn(),
    forgotPassword: jest.fn(),
    forgotPasswordSubmit: jest.fn(),
    currentSession: jest.fn(() => ({
      getAccessToken: jest.fn(() => ({
        getJwtToken: jest.fn(() => 'TEST_TOKEN'),
      })),
    })),
    currentUserInfo: jest.fn(() => ({
      username: 'test',
    })),
  },
  Amplify: {
    configure: jest.fn(),
  },
}));

jest.mock('ua-parser-js', () => ({
  default: jest.fn(() => ({
    os: {
      name: 'Mac OS',
    },
  })),
}));
