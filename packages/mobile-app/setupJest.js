import mockSafeAreaContext from 'react-native-safe-area-context/jest/mock';
import 'react-native-gesture-handler/jestSetup';
import { changePassword } from './src/features/Auth/authService';

// https://github.com/expo/expo/issues/21434#issuecomment-1450781966
jest.mock('expo-font');
jest.mock('expo-asset');

jest.mock('amazon-cognito-identity-js'),
    () => ({
        CognitoUserPool: jest.fn(),
    });

jest.mock('@react-native-async-storage/async-storage', () =>
    require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

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

jest.mock('react-native-safe-area-context', () => mockSafeAreaContext);

jest.mock('./src/icons/MenuUnfoldOutlined.svg', () => 'svg');

// Mock aws-amplify
jest.mock('aws-amplify', () => ({
    Amplify: {
        configure: jest.fn(),
    },
    Auth: {
        currentSession: jest.fn(() => {
            const session = {
                accessToken: {
                    jwtToken: '123456',
                },
                idToken: {
                    payload: {
                        email: 'demo@test.com',
                        sub: 'abc123',
                    },
                },
                getAccessToken: jest.fn(() => ({
                    getJwtToken: jest.fn(() => '123456'),
                })),
            };
            return Promise.resolve(session);
        }),
        signOut: jest.fn(),
        signIn: jest.fn(
            (email, pass) =>
                new Promise((resolve, reject) => {
                    const userExists = {
                        'demo@test.com': true,
                    }[email];

                    if (userExists && pass === '12345678') {
                        const signedUser = {
                            username: 'abcdfg123',
                            attributes: {
                                email,
                                name: 'John Rambo',
                                phone: '+460777777777',
                            },
                            signInUserSession: {
                                accessToken: { jwtToken: '123456' },
                            },
                        };
                        return resolve(signedUser);
                    }

                    if (userExists && pass === 'resetTempPassword') {
                        return resolve({
                            // there's more data here, but we don't need it for this test
                            challengeName: 'NEW_PASSWORD_REQUIRED',
                        });
                    }

                    if (userExists) {
                        return reject({
                            code: 'NotAuthorizedException',
                            name: 'NotAuthorizedException',
                            message: 'Incorrect username or password.',
                        });
                    }

                    return reject({
                        code: 'UserNotFoundException',
                        name: 'UserNotFoundException',
                        message: 'User does not exist.',
                    });
                }),
        ),
        signUp: jest.fn(
            ({ username, pass, attributes }) =>
                new Promise((resolve, reject) => {
                    const newUser = {
                        username: 'abcdfg123',
                        email: username,
                        name: attributes.name,
                        signInUserSession: {
                            accessToken: { jwtToken: '123456' },
                        },
                    };
                    return resolve(newUser);
                }),
        ),
        confirmSignUp: jest.fn(
            (email, code) =>
                new Promise((resolve, reject) => {
                    const confirmedUser = {
                        userConfirmed: true,
                        username: 'abcdfg123',
                        user: { username: email },
                    };

                    if (code === '123456') {
                        return resolve(confirmedUser);
                    }

                    return reject({
                        code: 'CodeMismatchException',
                        name: 'CodeMismatchException',
                        message:
                            'Invalid verification code provided, please try again.',
                    });
                }),
        ),
        currentAuthenticatedUser: jest.fn(
            () =>
                new Promise((resolve, reject) => {
                    const currentUser = {
                        username: 'abc123',
                        email: 'demo@test.com',
                        accessToken: '123cvb123',
                        name: 'John Rambo',
                        phone: '+46761022312',
                        phoneVerified: false,
                        attributes: {
                            sub: 'abc123',
                        },
                    };

                    return resolve(currentUser);
                }),
        ),
        updateUserAttributes: jest.fn(),
        currentUserInfo: jest.fn(() => ({
            username: 'demo',
        })),
        forgotPassword: jest.fn(() => Promise.resolve()),
        forgotPasswordSubmit: jest.fn(() => Promise.resolve()),
        completeNewPassword: jest.fn(() => Promise.resolve()),
    },
}));
jest.mock('@heap/react-native-heap', () => ({
    identify: jest.fn(),
    addUserProperties: jest.fn(),
}));

jest.mock('expo-linking', () => ({
    createURL: jest.fn(() => 'https://test.com'),
}));
