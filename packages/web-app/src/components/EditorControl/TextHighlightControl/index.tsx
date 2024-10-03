import React, { useState, useRef, useEffect } from 'react';
import { Button, Input, InputRef, Form, Tooltip } from 'antd';
import Icon from '@ant-design/icons';
import { ReactEditor, useSlate } from 'slate-react';
import { ReactComponent as InsertLinkIcon } from '@/assets/insertLinkIcon.svg';
import { ReactComponent as InsertLinkSelectedIcon } from '@/assets/insertLinkSelectedIcon.svg';
import { ReactComponent as TextColorIcon } from '@/assets/textColorIcon.svg';
import { ReactComponent as TextColorSelectedIcon } from '@/assets/textColorSelectedIcon.svg';
import { ReactComponent as BackgroundColorIcon } from '@/assets/backgroundColorIcon.svg';
import { ReactComponent as BackgroundColorSelectedIcon } from '@/assets/backgroundColorSelectedIcon.svg';
import { commonProps } from '../utils';
import { ColorSelector } from './ColorSelector';
import { removeMark } from '@components/RichText/helpers';
import './index.scss';

interface TextHighlightControlProps {
  setIsEditorOpen?: (isEditorOpen: boolean) => void;
  isLinkActive: boolean;
  insertLink: (url: string) => void;
  removeLink: () => void;
  getLinkValue: () => string;
  setTextColor?: (color: string) => void;
  getTextColor?: () => string;
  toggleTextColor?: () => void;
  setTextBackgroundColor?: (color: string) => void;
  getTextBackgroundColor?: () => string;
}

const TextHighlightControl: React.FC<TextHighlightControlProps> = (
  props: TextHighlightControlProps,
) => {
  const {
    isLinkActive,
    insertLink,
    removeLink,
    getLinkValue,
    setIsEditorOpen,
  } = props;
  const [showInsertLink, setShowInsertLink] = useState(false);
  const [showTextColorPicker, setShowTextColorPicker] = useState(false);
  const [showTextHighlightColorPicker, setShowTextHighlightColorPicker] =
    useState(false);
  const [form] = Form.useForm();
  const url = Form.useWatch('url', form);
  const linkRef = useRef<InputRef>(null);

  const editor = useSlate();

  useEffect(() => {
    form.setFieldValue('url', isLinkActive ? getLinkValue() : '');
  }, [form, getLinkValue, isLinkActive]);

  const handleInsertLink = () => {
    let { url } = form.getFieldsValue();
    if (!url.match(/^https?:\/\//)) {
      url = `http://${url}`;
    }
    insertLink(url);
    ReactEditor.focus(editor);
  };
  const handleRemoveLink = () => {
    removeLink();
    ReactEditor.focus(editor);
  };

  return (
    <>
      <div className='format-button-group'>
        <Tooltip title='Insert Link'>
          <Button
            {...commonProps}
            data-testid='text-control-hyperlink'
            type='text'
            onClick={() => {
              setShowInsertLink(!showInsertLink);
              setShowTextColorPicker(false);
              setShowTextHighlightColorPicker(false);
            }}
            icon={
              <Icon
                className='custom-icon'
                component={
                  showInsertLink ? InsertLinkSelectedIcon : InsertLinkIcon
                }
              />
            }></Button>
        </Tooltip>
        <Tooltip title='Text Color'>
          <Button
            {...commonProps}
            data-testid='text-control-color'
            type='text'
            onClick={() => {
              setShowTextColorPicker(!showTextColorPicker);
              setShowInsertLink(false);
              setShowTextHighlightColorPicker(false);
            }}
            icon={
              <Icon
                className='custom-icon'
                component={
                  showTextColorPicker ? TextColorSelectedIcon : TextColorIcon
                }
              />
            }></Button>
        </Tooltip>
        <Tooltip title='Highlight Color'>
          <Button
            {...commonProps}
            data-testid='text-control-highlight'
            type='text'
            onClick={() => {
              setShowTextHighlightColorPicker(!showTextHighlightColorPicker);
              setShowTextColorPicker(false);
              setShowInsertLink(false);
            }}
            icon={
              <Icon
                className='custom-icon'
                component={
                  showTextHighlightColorPicker
                    ? BackgroundColorSelectedIcon
                    : BackgroundColorIcon
                }
              />
            }></Button>
        </Tooltip>
      </div>

      {showInsertLink && (
        <>
          <div className='edit-control-format-align-divider'></div>
          <div className='edit-control__url-form'>
            <Form form={form} layout='vertical' onFinish={handleInsertLink}>
              <Form.Item
                label='Link URL'
                name='url'
                className='edit-control__url-form__label'
                initialValue={getLinkValue()}>
                <Input
                  placeholder='Type or paste url'
                  ref={linkRef}
                  className='edit-control__url-form__input'
                  onClick={() => {
                    linkRef.current?.focus();
                  }}
                  onBlur={(e) => {
                    removeMark(editor, 'fakeSelection');
                    if (!e.relatedTarget?.hasAttribute('data-slate-editor')) {
                      setIsEditorOpen?.(false);
                    }
                  }}></Input>
              </Form.Item>
              <div className='edit-control__url-form__buttons'>
                <Button
                  type='text'
                  disabled={!isLinkActive}
                  danger
                  onClick={handleRemoveLink}>
                  Remove
                </Button>
                <Button type='text' disabled={!url} htmlType='submit'>
                  Apply
                </Button>
              </div>
            </Form>
          </div>
        </>
      )}
      {showTextColorPicker && (
        <>
          <div className='edit-control-format-align-divider'></div>
          <ColorSelector
            theme='textColor'
            selectedColorHex={props.getTextColor?.()}
            onColorSelect={(colorHex) => {
              props.setTextColor?.(colorHex);
            }}
          />
        </>
      )}
      {showTextHighlightColorPicker && (
        <>
          <div className='edit-control-format-align-divider'></div>
          <ColorSelector
            theme='backgroundColor'
            selectedColorHex={props.getTextBackgroundColor?.()}
            onColorSelect={(colorHex) => {
              props.setTextBackgroundColor?.(colorHex);
            }}
          />
        </>
      )}
    </>
  );
};

export default TextHighlightControl;
