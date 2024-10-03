import React from 'react';
import './index.scss';
import { Card } from '@learn-to-win/common/features/Cards/cardTypes';
import { useAppSelector } from '@hooks/reduxHooks';
import { ContentBlockEditor } from '@components/RichText/ContentBlockEditor';
import { EditorControlType } from '@components/EditorControl';
import { useSaveRichTextBlock } from '@components/ContentBlock/contentBlockHooks';
import { migrateContentBlock } from '@components/RichText/helpers';

interface SubtitleBlockProps {
  id: string;
  card: Card;
  showEditor: boolean;
}

const SubtitleBlock: React.FC<SubtitleBlockProps> = (
  props: SubtitleBlockProps,
) => {
  const { selectedCardId } = useAppSelector((state) => state.card);
  const editable = props.card.id === selectedCardId && props.showEditor;
  const save = useSaveRichTextBlock();
  return (
    <ContentBlockEditor
      blockId={props.id}
      card={props.card}
      editable={editable}
      blockType={'subtitle'}
      editorControlProps={{
        editorType: EditorControlType.subTitleText,
        enableSizeControls: false,
        enabled: true,
      }}
      save={save}
      editableText={migrateContentBlock(props.card, props.id, 'subtitle')}
    />
  );
};

export default SubtitleBlock;
