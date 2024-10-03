import React from 'react';
import './index.scss';
import { Card } from '@learn-to-win/common/features/Cards/cardTypes';
import { useAppSelector } from '@hooks/reduxHooks';
import { ContentBlockEditor } from '@components/RichText/ContentBlockEditor';
import { EditorControlType } from '@components/EditorControl';
import { useSaveRichTextBlock } from '@components/ContentBlock/contentBlockHooks';
import { migrateContentBlock } from '@components/RichText/helpers';

interface BodyBlockProps {
  id: string;
  card: Card;
  showEditor: boolean;
}

const BodyBlock: React.FC<BodyBlockProps> = (props: BodyBlockProps) => {
  const { selectedCardId } = useAppSelector((state) => state.card);
  const editable = props.card.id === selectedCardId && props.showEditor;
  const save = useSaveRichTextBlock();
  return (
    <ContentBlockEditor
      blockId={props.id}
      card={props.card}
      editable={editable}
      blockType={'body'}
      editorControlProps={{
        editorType: EditorControlType.bodyText,
        enabled: true,
        enableListControls: true,
      }}
      save={save}
      editableText={migrateContentBlock(props.card, props.id, 'body')}
    />
  );
};

export default BodyBlock;
