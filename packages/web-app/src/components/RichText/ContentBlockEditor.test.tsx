// Tests for ContentBlockEditor
import { render, screen } from '@tests/testing';
import { ContentBlockEditor } from './ContentBlockEditor';
import { EditorControlType } from '@components/EditorControl';
import { migrateContentBlock } from './helpers';
import { Card } from '@learn-to-win/common/features/Cards/cardTypes';
import { CardType } from '@learn-to-win/common/constants';
describe('ContentBlockEditor', () => {
  it('should render the component', () => {
    const card: Card = {
      id: '1',
      title: 'Test Card',
      type: CardType.LESSON_CARD,
      learningItem: '123',
      sequenceOrder: 1,
      learningItemId: '123',
      confidenceCheck: true,
      json: {
        version: '1',
        description: 'Test Description',
        templateType: null,
        contentBlocks: [
          {
            id: '1',
            type: 'title',
            text: 'Test Title',
          },
        ],
      },
    };
    render(
      <ContentBlockEditor
        blockId={'1'}
        card={card}
        editable={false}
        save={() => null}
        editableText={migrateContentBlock(card, '1', 'title')}
        blockType={'subtitle'}
        editorControlProps={{
          enabled: true,
          editorType: EditorControlType.subTitleText,
        }}
      />,
    );
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });
});
