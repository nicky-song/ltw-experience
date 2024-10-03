import {
  getAudioBlock,
  getContentBlockByTemplateType,
  getSubtitleBlock,
  getVideoBlock,
} from './cardTemplates';
import { TemplateType } from './cardTypes';

// Mock uuidv4 so tests are deterministic
jest.mock('uuid', () => ({
  v4: () => 'mocked-id',
}));

describe('Card Templates', () => {
  it('should return the correct content block for all types', () => {
    const contentBlockTypes: TemplateType[] = [
      'blank',
      'text',
      'media',
      'slideshow',
      'expandableList',
    ];
    contentBlockTypes.forEach((type) => {
      expect(getContentBlockByTemplateType(type)).toMatchSnapshot(type);
    });

    expect(getSubtitleBlock('test', 'Subtitle Name')).toMatchSnapshot(
      'subtitle',
    );
    expect(getVideoBlock('test', 'video://url', 'Video Name')).toMatchSnapshot(
      'video',
    );
    expect(getAudioBlock('test', 'audio://url', 'Audio Name')).toMatchSnapshot(
      'audio',
    );
  });
});
