import React from 'react';
import { Drawer, Menu, MenuProps } from 'antd';
import CustomButton from '@components/Button';
import { CloseOutlined, SoundOutlined } from '@ant-design/icons';
import './index.scss';
import {
  AudioBlockType,
  ImageBlockType,
  VideoBlockType,
} from '@learn-to-win/common/features/Cards/cardTypes';
import { getApiGatewayUrl } from '@learn-to-win/common/utils/restClient';
import UploadMedia from '@components/UploadMedia';

interface MediaDrawerProps {
  open: boolean;
  media: ImageBlockType | VideoBlockType | AudioBlockType;
  removeMediaUrl: () => void;
  addMediaUrl: (url: string, name: string) => void;
  toggleDrawer: (shouldOpen: boolean) => void;
  type: 'video' | 'image' | 'audio';
  mediaUrl?: string;
}

const items: MenuProps['items'] = [
  {
    label: 'Library',
    key: 'library',
  },
];

const MediaDrawer: React.FC<MediaDrawerProps> = ({
  toggleDrawer,
  open,
  removeMediaUrl,
  addMediaUrl,
  mediaUrl,
  media,
  type,
}) => {
  return (
    <Drawer
      open={open}
      width={440}
      onClose={() => {
        toggleDrawer(false);
      }}
      closeIcon={
        <CustomButton
          htmlType='button'
          size='large'
          type='ghost'
          icon={<CloseOutlined />}
        />
      }
      headerStyle={{ borderBottom: 'none' }}
      bodyStyle={{ paddingTop: '0px' }}
      title={
        <Menu
          items={items}
          mode={'horizontal'}
          className='media-drawer__menu-nav'
          defaultSelectedKeys={['library']}></Menu>
      }>
      <UploadMedia
        mediaUrl={mediaUrl}
        mediaName={media.name}
        removeS3Url={removeMediaUrl}
        updateS3Url={(id, fileName) => {
          addMediaUrl(`${getApiGatewayUrl()}media/${id}`, fileName);
        }}
        contentType={type}
      />
    </Drawer>
  );
};

interface MediaProps {
  type: 'video' | 'image' | 'audio';
  altText?: string;
  mediaUrl?: string;
}
export const Media: React.FC<MediaProps> = ({
  type,
  altText,
  mediaUrl,
}: MediaProps) => {
  switch (type) {
    case 'image':
      return (
        <img className='media-drawer__preview' src={mediaUrl} alt={altText} />
      );
    case 'video':
      return (
        <video className='media-drawer__preview'>
          <source src={mediaUrl}></source>
        </video>
      );
    case 'audio':
      return (
        <div className='media-drawer__sound-icon'>
          <SoundOutlined />
        </div>
      );
    default:
      return null;
  }
};

export default MediaDrawer;
