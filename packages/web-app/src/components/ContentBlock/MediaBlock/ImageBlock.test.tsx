import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import AuthoringCard from '@components/AuthoringCard/index';
import {
  Card,
  ImageBlockType,
} from '@learn-to-win/common/features/Cards/cardTypes';
import { updateContentBlockInCard } from '@components/ContentBlock/CardHelper';
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
        type: 'image',
        url: '/src/media/Rectangle.png',
        name: 'Rectangle',
      },
    ],
  },
};

jest.mock('@hooks/reduxHooks', () => ({
  useAppSelector: () => ({
    selectedCardId: '1',
    learningItemList: [
      {
        id: '1',
        name: 'testTitle',
        type: 'lesson',
        description: 'testDesc',
        cards: [1, 2, 3],
      },
    ],
  }),
  useAppDispatch: () =>
    function () {
      return null;
    },
}));

jest.mock('react-query', () => {
  return {
    ...jest.requireActual('react-query'),
    useQuery: () => '',
    useMutation: () => ({ mutate: jest.fn() }),
  };
});

describe('ImageBlock', () => {
  it('should render a image block', () => {
    render(
      <MemoryRouter>
        <AuthoringCard card={card} />
      </MemoryRouter>,
    );

    expect(screen.getByTestId('media-block-image')).toBeInTheDocument();
  });

  it('should render the popup when clicked', async () => {
    render(
      <MemoryRouter>
        <AuthoringCard card={card} />
      </MemoryRouter>,
    );

    const mediaBlock = screen.getByTestId('media-block-image');
    mediaBlock.click();

    expect(await screen.findByText(/Change Image/)).toBeInTheDocument();
  });

  it('should update the media block', () => {
    const updatedImageBlock: ImageBlockType = {
      id: '1',
      type: 'image',
      url: '',
      name: '',
    };

    const updatedCard = updateContentBlockInCard(card, updatedImageBlock);

    render(
      <MemoryRouter>
        <AuthoringCard card={updatedCard} />
      </MemoryRouter>,
    );

    expect(screen.queryByTestId('media-block-image')).not.toBeInTheDocument();
  });

  it('should expand the image', async () => {
    render(
      <MemoryRouter>
        <AuthoringCard card={card} />
      </MemoryRouter>,
    );
    const mediaBlock = screen.getByTestId('media-block-image');
    fireEvent.load(mediaBlock);
    const imageExpand = screen.getByTestId('media-block-icon-button');
    imageExpand.click();
    await waitFor(() => {
      expect(screen.getByTestId('media-block-icon-button')).toBeInTheDocument();
    });
  });
});
