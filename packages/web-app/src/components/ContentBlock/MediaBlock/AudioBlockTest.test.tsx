import { render, screen } from '@testing-library/react';
import AuthoringCard from '@components/AuthoringCard/index';
import {
  Card,
  AudioBlockType,
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
        type: 'audio',
        url: '/src/media/Rectangle.mp3',
        name: 'Rectangle',
      },
    ],
  },
};

jest.mock('@hooks/reduxHooks', () => ({
  useAppSelector: () => ({
    selectedCardId: '1',
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
  it('should render an audio block', () => {
    render(
      <MemoryRouter>
        <AuthoringCard card={card} />
      </MemoryRouter>,
    );

    expect(screen.getByTestId('audio-content-block')).toBeInTheDocument();
  });

  it('should render the popup when clicked', async () => {
    render(
      <MemoryRouter>
        <AuthoringCard card={card} />
      </MemoryRouter>,
    );

    const mediaBlock = screen.getByTestId('audio-content-block');
    mediaBlock.click();

    expect(await screen.findByText(/Change Audio/)).toBeInTheDocument();
  });

  it('should update the media block', () => {
    const updatedImageBlock: AudioBlockType = {
      id: '1',
      type: 'audio',
      url: '',
      name: '',
    };

    const updatedCard = updateContentBlockInCard(card, updatedImageBlock);

    render(
      <MemoryRouter>
        <AuthoringCard card={updatedCard} />
      </MemoryRouter>,
    );

    expect(screen.queryByTestId('media-block-tag')).not.toBeInTheDocument();
  });
});
