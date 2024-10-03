import { render, screen, fireEvent, waitFor } from '@tests/testing';
import { UploaderPoc } from './Uploader.poc';
import {} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AICourseCreatePoc } from './AICourseCreate.poc';

const localFetch = jest.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve({
        uuid: 100,
        slides: [
          { title: 'title', content: 'content' },
          // { title: 'title', content: 'content' },
        ],
      } as any),
  }),
);
global.fetch = localFetch as jest.Mock;

describe('UploaderPoc', () => {
  it('Should render', () => {
    const callback = jest.fn();

    render(<UploaderPoc onUploadSuccess={callback} url={'/'} />);

    expect(
      screen.getByText('Click or drag file to this area to upload'),
    ).toBeInTheDocument();
  });

  it('should upload a file', async () => {
    const callback = jest.fn();
    const file = new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/png' });

    render(<UploaderPoc onUploadSuccess={callback} url={'/'} />);

    // get the upload button
    const uploader = screen.getByTestId('file-uploader');

    // simulate ulpoad event and wait until finish
    await waitFor(() =>
      fireEvent.change(uploader, {
        target: { files: [file] },
      }),
    );
    const uploadButton = screen.getByText('Start Upload');
    // expect the button to not be disabled
    expect(uploadButton).not.toBeDisabled();
    fireEvent.click(uploadButton);

    await waitFor(() => {
      expect(callback).toHaveBeenCalled();
      expect(localFetch).toHaveBeenCalled();
    });
  });
});

// mock react-router navigate
const navigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => navigate,
  useParams: () => ({ courseId: 1 }),
}));

// Mock Services
jest.mock(
  '@learn-to-win/common/features/LearningItems/learningItemService',
  () => ({
    createLearningItem: () => Promise.resolve({ id: 1 }),
  }),
);
// mock card service
jest.mock('@learn-to-win/common/features/Cards/cardService', () => ({
  createCard: () => Promise.resolve({ id: 1 }),
}));

describe('AI Course Create', () => {
  it('Should render', () => {
    render(
      <MemoryRouter>
        <AICourseCreatePoc />
      </MemoryRouter>,
    );

    expect(
      screen.getByText('Click or drag file to this area to upload'),
    ).toBeInTheDocument();
  });

  it('Should upload and create course', async () => {
    render(
      <MemoryRouter>
        <AICourseCreatePoc />
      </MemoryRouter>,
    );

    const file = new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/png' });

    // localFetch.mockImplementationOnce(() => {
    //   return Promise.resolve({
    //     json: () =>
    //       Promise.resolve({
    //         slides: [
    //           { title: 'title', content: 'content' },
    //           { title: 'title2', content: 'content2' },
    //         ],
    //       }),
    //   });
    // });

    // get the upload button
    const uploader = screen.getByTestId('file-uploader');

    // simulate upload event and wait until finish
    await waitFor(() =>
      fireEvent.change(uploader, {
        target: { files: [file] },
      }),
    );
    const uploadButton = screen.getByText('Start Upload');
    // expect the button to not be disabled
    expect(uploadButton).not.toBeDisabled();
    fireEvent.click(uploadButton);

    await waitFor(() => {
      expect(localFetch).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith('/learning_item/1');
    });
  });
});
