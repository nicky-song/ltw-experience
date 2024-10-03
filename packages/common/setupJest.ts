// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// mock the singleton restClient and other utils
jest.mock('./utils/restClient', () => ({
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

global.structuredClone = (v: object) => JSON.parse(JSON.stringify(v));
