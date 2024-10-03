import { MobilePaths, useMobileRedirect } from '@hooks/useMobileRedirect';

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useEffect: jest.fn((callback) => callback()),
}));

const reloadMock = jest.fn();

jest.mock('ua-parser-js', () => ({
  default: jest.fn(() => ({
    os: {
      name: 'iOS',
    },
  })),
}));

jest.useFakeTimers();

describe('useMobileRedirect', () => {
  it('should redirect to the mobile app', async () => {
    jest.spyOn(global as any, 'window', 'get').mockImplementation(() => ({
      location: {
        reload: reloadMock,
        search: '?foo=bar',
        href: 'https://www.learntowin.us',
      },
      navigator: {
        userAgent: 'test',
      },
    }));

    useMobileRedirect(MobilePaths.ResetPassword);

    jest.runAllTimers();

    expect(reloadMock).toHaveBeenCalled();
  });
});
