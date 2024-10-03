import { render, screen } from '@testing-library/react';
import AuthoringCard from '@components/AuthoringCard/index';
import {
  Card,
  ContentBlockType,
} from '@learn-to-win/common/features/Cards/cardTypes';
import { updateContentBlockInCard } from '@components/ContentBlock/CardHelper';
import { Descendant } from 'slate';
import { MemoryRouter } from 'react-router-dom';
import { CardType } from '@learn-to-win/common/constants';

const card: Card = {
  id: '1',
  title: 'Card Title',
  type: CardType.LESSON_CARD,
  sequenceOrder: 1,
  learningItemId: '1',
  learningItem: '1',
  confidenceCheck: true,
  json: {
    description: 'Card Description',
    version: '1',
    templateType: null,
    contentBlocks: [
      {
        id: '1',
        type: 'title',
        text: 'Title Text',
      },
    ],
  },
};

jest.mock('@hooks/reduxHooks', () => ({
  useAppSelector: () => ({
    card: [
      {
        selectedCardId: '1',
      },
    ],
  }),
  useAppDispatch: () =>
    function () {
      return null;
    },
}));

describe('TitleBlock', () => {
  it('should render a title block', () => {
    render(
      <MemoryRouter>
        <AuthoringCard card={card} />
      </MemoryRouter>,
    );

    expect(screen.getByText('Title Text')).toBeInTheDocument();
  });

  it('should update the title block', () => {
    const updatedTitleBlock: ContentBlockType = {
      id: '1',
      type: 'title',
      text: 'Updated Title Text',
      json: [{ children: [{ text: 'Updated Title Text' }] } as Descendant],
    };

    const updatedCard = updateContentBlockInCard(card, updatedTitleBlock);

    render(
      <MemoryRouter>
        <AuthoringCard card={updatedCard} />
      </MemoryRouter>,
    );

    expect(screen.getByText('Updated Title Text')).toBeInTheDocument();
  });
});
