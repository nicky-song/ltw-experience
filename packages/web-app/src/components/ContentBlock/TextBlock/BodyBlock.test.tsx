import { render, screen } from '@testing-library/react';
import AuthoringCard from '@components/AuthoringCard/index';
import {
  Card,
  BodyBlockType,
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
        type: 'body',
        text: 'Body Text',
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

describe('BodyBlock', () => {
  it('should render a body block', () => {
    render(
      <MemoryRouter>
        <AuthoringCard card={card} />
      </MemoryRouter>,
    );

    expect(screen.getByText('Body Text')).toBeInTheDocument();
  });

  it('should update the body block', () => {
    const updatedBodyBlock: BodyBlockType = {
      id: '1',
      type: 'body',
      text: 'Updated Body Text',
      json: [{ children: [{ text: 'Updated Body Text' }] } as Descendant],
    };

    const updatedCard = updateContentBlockInCard(card, updatedBodyBlock);

    render(
      <MemoryRouter>
        <AuthoringCard card={updatedCard} />
      </MemoryRouter>,
    );

    expect(screen.getByText('Updated Body Text')).toBeInTheDocument();
  });
});
