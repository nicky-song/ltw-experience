import { ImageBlockType } from '@learn-to-win/common/features/Cards/cardTypes';
import MediaDrawer from '.';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { putTemporaryUrl } from '@learn-to-win/common/features/Media/mediaService';
const queryClient = new QueryClient();

jest.mock('@learn-to-win/common/features/Media/mediaService');
describe('Media Drawer', () => {
  const props = {
    open: true,
    media: { name: 'Rectangle' } as ImageBlockType,
    removeMediaUrl: () => null,
    addMediaUrl: () => null,
    toggleDrawer: () => null,
    mediaUrl: '',
    type: 'image' as const,
  };
  beforeEach(() => {
    (putTemporaryUrl as jest.Mock).mockImplementationOnce(() => {
      return Promise.reject();
    });
  });
  it('should render the component', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MediaDrawer {...props} />
      </QueryClientProvider>,
    );
    expect(
      await screen.findByTestId('media-upload-button'),
    ).toBeInTheDocument();
    expect(await screen.findByText(/Rectangle/)).toBeInTheDocument();
  });
});
