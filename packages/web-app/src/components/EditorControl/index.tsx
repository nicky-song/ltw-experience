import React, { FC } from 'react';
import './index.scss';
import { Button, Divider, Popover } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useSlate } from 'slate-react';
import { CustomTypes } from 'slate';
import EditControlMove from './EditControlMove';
import TextFormatControl from './TextFormatControl';
import TextAlignmentControl from './TextAlignmentControl';
import TextHighlightControl from './TextHighlightControl';
import CharacterCountControl from './CharacterCountControl';
import TextSizeControl from './TextSizeControl';
import { CustomSize } from '@learn-to-win/common/types/RichTextTypes';
import {
  BlockFormatType,
  isBlockActive,
  isMarkActive,
  toggleBlock,
  toggleMark,
  FormatType,
  isSizeMarkActive,
  toggleSizeMark,
  isLinkActive,
  wrapLink,
  unwrapLink,
  getLink,
  setMark,
  getMark,
  removeMark,
} from '@components/RichText/helpers';
import ListControl from './ListControl';

export enum EditorControlType {
  titleText = 'Title Text',
  subTitleText = 'Subtitle Text',
  bodyText = 'Body Text',
  sectionHeader = 'Section Header',
  sectionText = 'Section Text',
  mediaText = 'Media',
  questionText = 'Question Text',
}

export interface EditorControlProps {
  children: React.ReactNode;
  editorType?: EditorControlType;
  enabled: boolean;
  show: boolean;
  enableMoveControls?: boolean;
  enableSizeControls?: boolean;
  enableFormatControls?: boolean;
  enableAlignControls?: boolean;
  enableListControls?: boolean;
  enableHighlightControls?: boolean;
  enableCharacterCount?: boolean;
  enableDelete?: boolean;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  characterCount?: number;
  delete?: () => void;
  textLength: number;
  setIsEditorOpen?: (isOpen: boolean) => void;
}

const EditorControl: FC<EditorControlProps> = (props: EditorControlProps) => {
  const {
    enableMoveControls = true,
    enableSizeControls = true,
    enableFormatControls = true,
    enableAlignControls = true,
    enableHighlightControls = true,
    enableCharacterCount = true,
    enableDelete = true,
    show,
    enableListControls = false,
  } = props;

  const editor = useSlate();

  const [isLarge, toggleIsLarge] = setupSizeMarkHelpers(editor, 'large');
  const [isMedium, toggleIsMedium] = setupSizeMarkHelpers(editor, 'medium');
  const [isSmall, toggleIsSmall] = setupSizeMarkHelpers(editor, 'small');
  const [isStrong, toggleIsStrong] = setupMarkHelpers(editor, 'bold');
  const [isItalic, toggleIsItalic] = setupMarkHelpers(editor, 'italic');
  const [isUnderlined, toggleIsUnderlined] = setupMarkHelpers(
    editor,
    'underline',
  );
  const [isStrikethrough, toggleIsStrikethrough] = setupMarkHelpers(
    editor,
    'strikethrough',
  );

  const [isLeftAligned, toggleIsLeftAligned] = setupBlockHelpers(
    editor,
    'left',
    'align',
  );

  const [isFullJustified, toggleIsFullJustified] = setupBlockHelpers(
    editor,
    'justify',
    'align',
  );

  const [isCenterJustified, toggleIsCenterJustified] = setupBlockHelpers(
    editor,
    'center',
    'align',
  );

  const [isRightAligned, toggleIsRightAligned] = setupBlockHelpers(
    editor,
    'right',
    'align',
  );

  const [hasNumberedList, toggleNumberedList] = setupBlockHelpers(
    editor,
    'numbered-list',
    'type',
  );

  const [hasBulletedList, toggleBulletedList] = setupBlockHelpers(
    editor,
    'bulleted-list',
    'type',
  );

  const {
    isActive: isLinkActive,
    insertLink,
    removeLink,
    getLinkValue,
  } = setupLinkHelpers(editor);

  const { setTextColor, getTextColor } = setupColorHelpers(editor, 'color');

  const {
    setTextColor: setTextBackgroundColor,
    getTextColor: getTextBackgroundColor,
  } = setupColorHelpers(editor, 'backgroundColor');

  return (
    <Popover
      open={show}
      placement='rightTop'
      arrow={false}
      content={
        <div className='edit-control-popover'>
          <div
            className='edit-control-content'
            // Prevents the interactions from the tooltip to de-select text and close tooltip
            onMouseDown={(e) => e.preventDefault()}>
            {(enableFormatControls || enableAlignControls) && (
              <div className='edit-control-menu-item'>
                <EditControlMove
                  text={props?.editorType ?? ''}
                  enableMoveControls={enableMoveControls}
                  onMoveUp={props.onMoveUp}
                  onMoveDown={props.onMoveDown}
                />
              </div>
            )}
            {(enableSizeControls ||
              enableFormatControls ||
              enableAlignControls ||
              enableListControls ||
              enableHighlightControls) && (
              <>
                <Divider className='edit-control-divider' />
                <div className='edit-control-button-groups'>
                  {enableSizeControls && (
                    <TextSizeControl
                      isTextLarge={isLarge}
                      toggleIsTextLarge={toggleIsLarge}
                      isTextMedium={isMedium}
                      toggleIsTextMedium={toggleIsMedium}
                      isTextSmall={isSmall}
                      toggleIsTextSmall={toggleIsSmall}
                    />
                  )}
                  {enableSizeControls &&
                    (enableFormatControls ||
                      enableAlignControls ||
                      enableListControls ||
                      enableHighlightControls) && (
                      <div className='edit-control-format-align-divider'></div>
                    )}
                  {enableFormatControls && (
                    <TextFormatControl
                      isStrong={isStrong}
                      isStrongChange={toggleIsStrong}
                      isItalic={isItalic}
                      isItalicChange={toggleIsItalic}
                      isUnderlined={isUnderlined}
                      isUnderlinedChange={toggleIsUnderlined}
                      isStrikethrough={isStrikethrough}
                      isStrikethroughChanged={toggleIsStrikethrough}
                    />
                  )}
                  {enableFormatControls &&
                    (enableAlignControls ||
                      enableListControls ||
                      enableHighlightControls) && (
                      <div className='edit-control-format-align-divider'></div>
                    )}
                  {enableAlignControls && (
                    <TextAlignmentControl
                      isLeftAligned={isLeftAligned}
                      isLeftAlignedChange={toggleIsLeftAligned}
                      isFullJustified={isFullJustified}
                      isFullJustifiedChange={toggleIsFullJustified}
                      isCenterJustified={isCenterJustified}
                      isCenterJustifiedChange={toggleIsCenterJustified}
                      isRightAligned={isRightAligned}
                      isRightAlignedChange={toggleIsRightAligned}
                    />
                  )}
                  {enableAlignControls &&
                    (enableListControls || enableHighlightControls) && (
                      <div className='edit-control-format-align-divider'></div>
                    )}
                  {enableListControls && (
                    <ListControl
                      hasNumberedList={hasNumberedList}
                      toggleNumberedList={toggleNumberedList}
                      hasBulletedList={hasBulletedList}
                      toggleBulletedList={toggleBulletedList}
                    />
                  )}
                  {enableListControls && enableHighlightControls && (
                    <div className='edit-control-format-align-divider'></div>
                  )}
                  {enableHighlightControls && (
                    <TextHighlightControl
                      setIsEditorOpen={props.setIsEditorOpen}
                      isLinkActive={isLinkActive}
                      insertLink={insertLink}
                      removeLink={removeLink}
                      getLinkValue={getLinkValue}
                      setTextColor={setTextColor}
                      getTextColor={getTextColor}
                      setTextBackgroundColor={setTextBackgroundColor}
                      getTextBackgroundColor={getTextBackgroundColor}
                    />
                  )}
                </div>
              </>
            )}
            {enableCharacterCount && (
              <>
                <Divider className='edit-control-divider' />
                <CharacterCountControl
                  textLength={props.textLength}
                  characterCount={props.characterCount}
                />
              </>
            )}
            {enableDelete && (
              <>
                <Divider className='edit-control-divider' />
                <Button
                  onClick={props.delete}
                  type='text'
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                  }}
                  icon={<DeleteOutlined />}
                  danger>
                  Delete
                </Button>
              </>
            )}
          </div>
        </div>
      }>
      {props.children}
    </Popover>
  );
};

const setupBlockHelpers = (
  editor: CustomTypes['Editor'],
  format: BlockFormatType,
  key: 'type' | 'align',
) => {
  const isActive = isBlockActive(editor, format, key);

  const toggle = () => toggleBlock(editor, format);

  return [isActive, toggle] as const;
};

function setupMarkHelpers(editor: CustomTypes['Editor'], mark: FormatType) {
  const isActive = isMarkActive(editor, mark);
  const toggle = () => {
    toggleMark(editor, mark);
  };
  return [isActive, toggle] as const;
}

function setupSizeMarkHelpers(editor: CustomTypes['Editor'], mark: CustomSize) {
  const isActive = isSizeMarkActive(editor, mark);
  const toggle = () => {
    toggleSizeMark(editor, mark);
  };
  return [isActive, toggle] as const;
}

function setupLinkHelpers(editor: CustomTypes['Editor']) {
  const isActive = isLinkActive(editor);
  const insertLink = (url: string) => {
    removeMark(editor, 'fakeSelection');
    wrapLink(editor, url);
  };
  const removeLink = () => {
    removeMark(editor, 'fakeSelection');
    unwrapLink(editor);
  };
  const getLinkValue = () => getLink(editor);

  return { isActive, insertLink, removeLink, getLinkValue };
}

function setupColorHelpers(
  editor: CustomTypes['Editor'],
  mark: 'color' | 'backgroundColor',
) {
  const setTextColor = (color: string) => {
    setMark(editor, mark, color);
  };
  const getTextColor = () => {
    return getMark(editor, mark) as string;
  };

  return { setTextColor, getTextColor };
}

export default EditorControl;
