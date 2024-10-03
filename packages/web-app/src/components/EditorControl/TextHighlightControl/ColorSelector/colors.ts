import { ColorsType } from './types';
import * as tokens from '@/tokens/figma-tokens.json';

const colors: ColorsType = {
  textColor: [
    {
      colorName: 'transparent',
      colorHex: 'transparent',
      disabled: true,
    },
    {
      colorName: 'black',
      colorHex: tokens.colorPrimary.value,
    },
    {
      colorName: 'white',
      colorHex: tokens.colorBgBase.value,
    },
    {
      colorName: 'hover-green',
      colorHex: tokens.colorPrimaryHover.value,
    },
    {
      colorName: 'red',
      colorHex: tokens.red[6].value,
    },
    {
      colorName: 'yellow',
      colorHex: tokens.yellow[6].value,
    },
    {
      colorName: 'cyan',
      colorHex: tokens.cyan[6].value,
    },
    {
      colorName: 'blue',
      colorHex: tokens.blue[6].value,
    },
    {
      colorName: 'purple',
      colorHex: tokens.purple[6].value,
    },
    {
      colorName: 'orange',
      colorHex: tokens.orange[6].value,
    },
    {
      colorName: 'green',
      colorHex: tokens.green[6].value,
    },
    {
      colorName: 'brown',
      colorHex: tokens.orange[8].value,
    },
  ],
  backgroundColor: [
    {
      colorName: 'transparent',
      colorHex: 'transparent',
    },
    {
      colorName: 'black',
      colorHex: tokens.colorPrimary.value,
    },
    {
      colorName: 'white',
      colorHex: tokens.colorBgBase.value,
    },
    {
      colorName: 'hover-green',
      colorHex: tokens.colorPrimaryHover.value,
    },
    {
      colorName: 'red',
      colorHex: tokens.red[3].value,
    },
    {
      colorName: 'yellow',
      colorHex: tokens.yellow[3].value,
    },
    {
      colorName: 'cyan',
      colorHex: tokens.cyan[3].value,
    },
    {
      colorName: 'blue',
      colorHex: tokens.blue[3].value,
    },
    {
      colorName: 'purple',
      colorHex: tokens.purple[3].value,
    },
    {
      colorName: 'orange',
      colorHex: tokens.orange[3].value,
    },
    {
      colorName: 'green',
      colorHex: tokens.green[3].value,
    },
    {
      colorName: 'gold',
      colorHex: tokens.gold[6].value,
    },
  ],
};

export default colors;
