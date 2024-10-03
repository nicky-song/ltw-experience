import { render, screen } from '@testing-library/react';
import AuthoringCard from '@components/AuthoringCard/index';
import {
  Card,
  VideoBlockType,
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
    templateType: null,
    version: '1',
    contentBlocks: [
      {
        id: '1',
        type: 'video',
        url: '/media',
        name: 'youtube',
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
  it('should render a video block', () => {
    render(
      <MemoryRouter>
        <AuthoringCard card={card} />
      </MemoryRouter>,
    );

    expect(screen.getByTestId('video-content-block')).toBeInTheDocument();
  });

  it('should render the popup when clicked', async () => {
    render(
      <MemoryRouter>
        <AuthoringCard card={card} />
      </MemoryRouter>,
    );

    const videoBlock = screen.getByTestId('video-block-container');
    videoBlock.click();

    expect(await screen.findByText(/Change Video/)).toBeInTheDocument();
  });

  it('should update the video block', () => {
    const updatedImageBlock: VideoBlockType = {
      id: '1',
      type: 'video',
      url: '',
      name: '',
    };

    const updatedCard = updateContentBlockInCard(card, updatedImageBlock);

    render(
      <MemoryRouter>
        <AuthoringCard card={updatedCard} />
      </MemoryRouter>,
    );

    expect(screen.queryByTestId('video-content-block')).not.toBeInTheDocument();
  });
});
