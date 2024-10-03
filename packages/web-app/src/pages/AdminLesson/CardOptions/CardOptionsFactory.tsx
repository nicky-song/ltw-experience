import {
  AlignLeftOutlined,
  FileImageOutlined,
  FontColorsOutlined,
  FontSizeOutlined,
  PlayCircleOutlined,
  SoundOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import Text from '@components/Typography/Text';
import {
  ContentBlockTypes,
  TemplateType,
} from '@learn-to-win/common/features/Cards/cardTypes';
import { MenuItemType } from 'antd/es/menu/hooks/useItems';

type DividerItemType = {
  type: 'divider';
  key: string;
};

export class CardOptionsFactory {
  private items: Array<MenuItemType | DividerItemType> = [];
  private template: TemplateType;
  private onClick: (
    type: ContentBlockTypes,
    templateType: TemplateType,
  ) => void;

  public constructor(
    templateType: TemplateType,
    onClick: (type: ContentBlockTypes, templateType: TemplateType) => void,
  ) {
    this.template = templateType;
    this.onClick = onClick;
  }

  private getOptionsTitle(title: string) {
    return {
      type: 'group',
      key: title,
      label: (
        <div className='card-options-container__dropdown-title'>
          <Text>{title}</Text>
        </div>
      ),
    };
  }

  private getDivider(key: string) {
    return {
      key,
      type: 'divider' as const, // Must have
    };
  }

  private getTitleOption() {
    return {
      key: 'title',
      label: (
        <div
          aria-label='Title'
          className='card-options-container__dropdown-label'>
          <FontColorsOutlined />
          <Text>Title</Text>
        </div>
      ),
      onClick: () => this.onClick('title', this.template),
    };
  }

  private getSubtitleOption() {
    return {
      key: 'subtitle',
      label: (
        <div
          aria-label='Subtitle'
          className='card-options-container__dropdown-label'>
          <FontSizeOutlined />
          <Text>Subtitle</Text>
        </div>
      ),
      onClick: () => this.onClick('subtitle', this.template),
    };
  }

  private getBodyOption() {
    return {
      key: 'body',
      label: (
        <div
          aria-label='Body'
          className='card-options-container__dropdown-label'>
          <AlignLeftOutlined />
          <Text>Body</Text>
        </div>
      ),
      onClick: () => this.onClick('body', this.template),
    };
  }

  private getImageOption() {
    return {
      key: 'image',
      label: (
        <div
          aria-label='Image'
          className='card-options-container__dropdown-label'>
          <FileImageOutlined />
          <Text>Image</Text>
        </div>
      ),
      onClick: () => this.onClick('image', this.template),
    };
  }

  private getVideoOption() {
    return {
      key: 'video',
      label: (
        <div
          aria-label='Video'
          className='card-options-container__dropdown-label'>
          <PlayCircleOutlined />
          <Text>Video</Text>
        </div>
      ),
      onClick: () => this.onClick('video', this.template),
    };
  }

  private getAudioOption() {
    return {
      key: 'audio',
      label: (
        <div
          aria-label='Audio'
          className='card-options-container__dropdown-label'>
          <SoundOutlined />
          <Text>Audio</Text>
        </div>
      ),
      onClick: () => this.onClick('audio', this.template),
    };
  }

  private getExpandableListOption() {
    return [
      this.getDivider('expandableList-divider'),
      {
        key: 'expandableList',
        label: (
          <div
            aria-label='Expandable List'
            className='card-options-container__dropdown-label'>
            <UnorderedListOutlined />
            <Text>Expandable List</Text>
          </div>
        ),
        onClick: () => this.onClick('expandableList', this.template),
      },
    ];
  }

  private getMediaOptions() {
    return [
      this.getDivider('media-divider'),
      this.getImageOption(),
      this.getVideoOption(),
      this.getAudioOption(),
    ];
  }

  private getTextOptions() {
    return [
      this.getDivider('text-divider'),
      this.getTitleOption(),
      this.getSubtitleOption(),
      this.getBodyOption(),
    ];
  }

  public getOptionsByTemplate() {
    switch (this.template) {
      case 'trueFalse':
      case 'multipleChoice':
        this.items.push(
          this.getOptionsTitle('Media Block'),
          ...this.getMediaOptions(),
        );
        break;
      default:
        this.items.push(
          this.getOptionsTitle('Content Block'),
          ...this.getTextOptions(),
          ...this.getMediaOptions(),
          ...this.getExpandableListOption(),
        );
    }
    return this.items;
  }

  public removeOptions(templateTypes: Array<string | number>) {
    this.items = this.items.filter((e) => {
      return !(
        templateTypes.includes(e.key) ||
        templateTypes.includes(`${e.key}-divider`)
      );
    });
  }

  public getItems() {
    return this.items;
  }
}
