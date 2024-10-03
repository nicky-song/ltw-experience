import { fireEvent, render, screen } from '@testing-library/react';
import UploadMedia from '.';
import { putTemporaryUrl } from '@learn-to-win/common/features/Media/mediaService';
import { QueryClient, QueryClientProvider } from 'react-query';
import { act } from 'react-dom/test-utils';

jest.mock('@learn-to-win/common/features/Media/mediaService');
const queryClient = new QueryClient();
describe('upload media component', () => {
  const commonProps = {
    updateS3Url: jest.fn(),
    removeS3Url: jest.fn(),
  };
  beforeEach(() => {
    (putTemporaryUrl as jest.Mock).mockImplementationOnce(async () => {
      return Promise.reject();
    });
  });
  it('should render the image', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <UploadMedia
          {...commonProps}
          contentType={'image'}
          mediaName='rectangle.png'
        />
      </QueryClientProvider>,
    );
    expect(
      await screen.findByTestId('media-upload-button'),
    ).toBeInTheDocument();
    expect(await screen.findByText(/rectangle\.png/)).toBeInTheDocument();
  });

  it('should show empty state if there is no image', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <UploadMedia {...commonProps} contentType={'image'} />
      </QueryClientProvider>,
    );
    expect(
      screen.getByText(/No image yet, try uploading one!/),
    ).toBeInTheDocument();
    expect(
      await screen.findByTestId('media-upload-empty-icon'),
    ).toBeInTheDocument();
  });
  const uploadFileTestHelper = async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <UploadMedia {...commonProps} contentType={'image'} />
      </QueryClientProvider>,
    );
    const uploader = await screen.findByTestId('media-upload-button');
    expect(uploader).toBeInTheDocument();

    fireEvent.click(uploader);
    const uploadInput = screen.getByTestId('media-upload-button')
      .previousElementSibling as Element;
    const file = new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/png' });
    await act(() =>
      fireEvent.change(uploadInput, {
        target: { files: [file] },
      }),
    );
  };

  it('should show an error if there is an error', async () => {
    await uploadFileTestHelper();
    expect(commonProps.updateS3Url).not.toBeCalled();
    expect(
      await screen.findByText(/Image failed to upload\. Try again\./),
    ).toBeInTheDocument();
  });
});
