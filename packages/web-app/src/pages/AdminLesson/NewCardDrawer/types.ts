import { FontSizeOutlined } from '@ant-design/icons';
import { TemplateType } from '@learn-to-win/common/features/Cards/cardTypes';

export type CardTemplateTypes = {
  title: string;
  description: string;
  color1: string;
  color2: string;
  icon: typeof FontSizeOutlined;
  type: TemplateType;
};
export type CardTemplateOption = CardTemplateTypes & {
  onClick: (type: TemplateType) => unknown;
};
