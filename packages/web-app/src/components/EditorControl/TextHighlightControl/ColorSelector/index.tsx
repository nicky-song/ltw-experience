import { Button, Divider, ColorPicker, Tooltip } from 'antd';
import { CheckCircleFilled } from '@ant-design/icons';
import classNames from 'classnames';
import colors from './colors';
import { Color, ColorsType } from './types';
import * as tokens from '@/tokens/figma-tokens.json';
import './index.scss';

interface ColorSelectorProps {
  theme: keyof ColorsType;
  onColorSelect: (color: string) => void;
  selectedColorHex?: string;
}

export const ColorSelector: React.FC<ColorSelectorProps> = (
  props: ColorSelectorProps,
) => {
  let { selectedColorHex } = props;
  if (!selectedColorHex) {
    selectedColorHex =
      props.theme === 'backgroundColor'
        ? 'transparent'
        : tokens.colorPrimary.value;
  }

  return (
    <>
      <div className='color-selector'>
        {colors[props.theme].map((color: Color) => {
          const isColorSelected =
            color.colorHex.toUpperCase() === selectedColorHex?.toUpperCase();
          return (
            <Button
              key={color.colorName}
              className='color-selector__icon'
              disabled={color.disabled}
              data-testid={`color-selector-button-${color.colorName}`}
              onClick={() => {
                props.onColorSelect(color.colorHex);
              }}>
              <div className='color-selector__icon__wrapper'>
                <div
                  className={classNames({
                    'color-selector__icon__color-block': true,
                    'color-selector__icon__color-block--disabled':
                      color.disabled,
                  })}
                  style={{ backgroundColor: color.colorHex }}>
                  {isColorSelected && (
                    <CheckCircleFilled
                      className={classNames({
                        'color-selector__icon__color-block__check': ![
                          'white',
                          'transparent',
                        ].includes(color.colorName),
                      })}
                    />
                  )}
                </div>
              </div>
            </Button>
          );
        })}
      </div>
      <Divider className='edit-control-divider' />
      <div className='custom-color-selector'>
        <ColorPicker
          format='hex'
          value={selectedColorHex}
          placement='topLeft'
          onChangeComplete={(value) => {
            props.onColorSelect(value.toHexString());
          }}>
          <Tooltip title='Custom'>
            <div
              className='color-selector__icon__wrapper'
              data-testid='custom-color-selector-trigger'>
              <div
                className={classNames({
                  'color-selector__icon__color-block': true,
                  'color-selector__icon__color-block__custom': true,
                })}></div>
            </div>
          </Tooltip>
        </ColorPicker>
      </div>
    </>
  );
};
