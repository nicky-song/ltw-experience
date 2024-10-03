// Tests for ContentBlockEditor
import * as React from 'react';
import { render, screen } from '../../../test/testing';
import { ContentBlock } from './ContentBlock';
import {
  getAudioBlock,
  getBodyBlock,
  getExpandableListBlock,
  getImageBlock,
  getTitleBlock,
} from '@learn-to-win/common/features/Cards/cardTemplates';
import { Image } from 'react-native';

jest.mock('@learn-to-win/common/utils/useMediaURL', () => ({
  useMediaURL: () => ({
    mediaURL:
      'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    isLoading: false,
  }),
}));

Image.getSize = jest.fn((url, callback) => {
  callback(100, 100);
});

describe('ContentBlockEditor', () => {
  it('should render the TitleBlock component', () => {
    render(
      <ContentBlock
        key={1}
        contentBlock={getTitleBlock('123', 'Test title')}
      />,
    );

    expect(screen.getByText('Test title')).toBeTruthy();
  });
  it('should render all facets of the body component', () => {
    const bodyBlock = getBodyBlock('123', 'Test body');
    bodyBlock['json'][0].children = [
      {
        bold: true,
        text: 'bold',
      },
      {
        text: ' ',
      },
      {
        text: 'italic',
        italic: true,
      },
      {
        text: ' ',
      },
      {
        text: 'underline',
        underline: true,
      },
      {
        text: ' ',
      },
      {
        text: 'strikethrough',
        strikethrough: true,
      },
    ];
    render(<ContentBlock key={1} contentBlock={bodyBlock} />);

    expect(screen.getByText('bold')).toBeTruthy();
    expect(screen.getByText('italic')).toBeTruthy();
    expect(screen.getByText('underline')).toBeTruthy();
    expect(screen.getByText('strikethrough')).toBeTruthy();
  });
  it('should render the ImageBlock component', () => {
    render(
      <ContentBlock
        key={1}
        contentBlock={getImageBlock(
          '123',
          'https://via.placeholder.com/150',
          'testImage.png',
        )}
      />,
    );

    expect(screen.getByTestId('content-media-block')).toBeTruthy();
  });

  it('should render the AudioVideoBlock component', () => {
    render(
      <ContentBlock
        key={1}
        contentBlock={getAudioBlock(
          '203',
          'https://api-dev.apps.learntowin.com/v1/media/1ee4eb38-9712-6566-ae33-259550be3b06',
          'Schitts Creek.mp4',
        )}
      />,
    );

    expect(screen.getByTestId('audio-video-block')).toBeTruthy();
  });
  it('should render the ExpandableListBlock component', () => {
    render(
      <ContentBlock key={1} contentBlock={getExpandableListBlock('123')} />,
    );

    expect(
      screen.getByText(/Let's enhance the way users comprehend/),
    ).toBeTruthy();
  });
});
