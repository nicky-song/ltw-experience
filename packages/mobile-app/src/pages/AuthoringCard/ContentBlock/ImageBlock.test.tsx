import { render, screen } from '../../../test/testing';
import { ImageBlockType } from '@learn-to-win/common/features/Cards/cardTypes';
import { ImageBlock } from './ImageBlock';
import { ImageModalFullScreen } from './ImageModalFullScreen';
import { fireEvent } from '@testing-library/react-native';
import { Image } from 'react-native';

jest.mock('react-query', () => {
  return {
    ...jest.requireActual('react-query'),
    useQuery: () => '',
    useMutation: () => ({ mutate: jest.fn() }),
  };
});

jest.mock('@learn-to-win/common/utils/useMediaURL', () => ({
  useMediaURL: () => ({
    mediaURL: '/testImage.png',
    isLoading: false,
  }),
}));

// mock react-router navigate
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: mockNavigate,
    }),
  };
});

Image.getSize = jest.fn((url, callback) => {
  callback(100, 100);
});

const contentBlock = {
  id: '1',
  type: 'image',
  url: '/testImage.png',
  name: 'Rectangle',
} as ImageBlockType;

describe('ImageBlock', () => {
  it('should render a media block', () => {
    render(<ImageBlock contentBlock={contentBlock} />);

    expect(screen.getByTestId('content-media-block')).toBeTruthy();
  });

  it('should click fullscreen on image', () => {
    render(<ImageBlock contentBlock={contentBlock} />);

    fireEvent.press(screen.getByTestId('media-block-fullscreen-button'));

    expect(mockNavigate).toHaveBeenCalledWith('ImageModal', {
      mediaUrl: '/testImage.png',
    });
  });
});

describe('ImageModalFullScreen', () => {
  it('should render a fullscreen image', () => {
    render(
      <ImageModalFullScreen
        route={{
          params: {
            contentBlock: contentBlock,
          },
        }}
        navigation
      />,
    );

    expect(screen.getByTestId('media-block-collapse-button')).toBeTruthy();
  });
});
