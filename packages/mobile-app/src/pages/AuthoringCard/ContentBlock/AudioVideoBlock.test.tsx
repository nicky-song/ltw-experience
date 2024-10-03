import { AudioVideoBlock } from './AudioVideoBlock';
import { render, screen } from '../../../test/testing';
import { Video } from 'expo-av';
import { View } from 'react-native';
// mock useMediaURL
jest.mock('@learn-to-win/common/utils/useMediaURL', () => ({
  useMediaURL: () => ({
    mediaURL:
      'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    isLoading: false,
  }),
}));

// mock expo-av
jest.mock('expo-av', () => ({
  ...jest.requireActual('expo-av'),
  Video: jest.fn(() => <></>),
}));
// Video as jest.Mock;

describe('AudioVideoBlockEditor', () => {
  it('should render the component', async () => {
    Video.mockImplementation((props) => {
      // call event handlers to trigger setMediaAsViewed
      props.onError();
      props.onPlaybackStatusUpdate({ isLoaded: true, didJustFinish: true });
      return <View testID='audio-video-block'></View>;
    });
    render(
      <AudioVideoBlock
        contentBlock={{
          id: '97ba65e3-d6f2-4519-b4d9-f9d5547f6139',
          type: 'audio',
          url: 'https://api-dev.apps.learntowin.com/v1/media/1ee4eb38-9712-6566-ae33-259550be3b06',
          name: 'Schitts Creek.mp4',
        }}
      />,
    );

    expect(await screen.getByTestId('audio-video-block')).toBeTruthy();
  });
});
