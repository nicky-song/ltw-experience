import React from 'react';
import './index.scss';
import { Card } from '@learn-to-win/common/features/Cards/cardTypes';
import { useAppSelector } from '@hooks/reduxHooks';
import { ContentBlockEditor } from '@components/RichText/ContentBlockEditor';
import { EditorControlType } from '@components/EditorControl';
import { useSaveRichTextBlock } from '@components/ContentBlock/contentBlockHooks';
import { migrateContentBlock } from '@components/RichText/helpers';

interface TitleBlockProps {
  id: string;
  card: Card;
  showEditor: boolean;
}

//Will handle edits in each content block file separately, and edit the json string (either passed in, or stored in redux) based on its id.
//Will be passed a unique id to find its place in the json string.
//Will be passed an "editable" or "selected" bool to stop editing if shown as a slide to the left or right, or if a panel is extended, etc.
const TitleBlock: React.FC<TitleBlockProps> = (props: TitleBlockProps) => {
  const { selectedCardId } = useAppSelector((state) => state.card);
  const editable = props.card.id === selectedCardId && props.showEditor;
  const save = useSaveRichTextBlock();
  return (
    <ContentBlockEditor
      blockId={props.id}
      card={props.card}
      editable={editable}
      blockType={'title'}
      editorControlProps={{
        editorType: EditorControlType.titleText,
        enableSizeControls: false,
        enabled: true,
      }}
      save={save}
      editableText={migrateContentBlock(props.card, props.id, 'title')}
    />
  );
};

export default TitleBlock;
