import {
  fireEvent,
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@tests/testing';
import AdminLesson from '@pages/AdminLesson';
import {
  BodyBlockType,
  Card,
  TitleBlockType,
} from '@learn-to-win/common/features/Cards/cardTypes';
import { MemoryRouter } from 'react-router-dom';
import { useQuery } from 'react-query';
import {
  createCard,
  deleteCard,
  getCardsAPI,
  updateCard,
} from '@learn-to-win/common/features/Cards/cardService';
import { CardType } from '@learn-to-win/common/constants';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    learningItemId: '1',
    cardId: '1',
  }),
}));
jest.mock('@learn-to-win/common/features/Cards/cardService');

jest.mock('react-query', () => ({
  ...jest.requireActual('react-query'),
  useQuery: jest.fn(),
}));

const cards: Array<Card> = [
  {
    id: '1',
    type: CardType.LESSON_CARD,
    sequenceOrder: 0,
    title: 'title card',
    learningItem: '1',
    learningItemId: '1',
    confidenceCheck: true,
    json: {
      templateType: 'blank',
      version: '1.0',
      description: 'test description',
      contentBlocks: [
        {
          id: '1',
          type: 'title',
          text: 'Card 1 Title',
        } as TitleBlockType,
      ],
    },
  },
  {
    id: '2',
    type: CardType.LESSON_CARD,
    sequenceOrder: 1,
    title: 'content card',
    learningItem: '1',
    learningItemId: '1',
    confidenceCheck: true,
    json: {
      templateType: 'blank',
      version: '1.0',
      description: 'test description',
      contentBlocks: [
        {
          id: '1',
          type: 'title',
          text: 'Card 2 Title',
        } as TitleBlockType,
      ],
    },
  },
  {
    id: '3',
    type: CardType.LESSON_CARD,
    sequenceOrder: 2,
    title: 'end card',
    learningItem: '1',
    learningItemId: '1',
    confidenceCheck: true,
    json: {
      templateType: 'blank',
      version: '1.0',
      description: 'test description',
      contentBlocks: [
        {
          id: '1',
          type: 'title',
          text: 'Card 3 Title',
        } as TitleBlockType,
      ],
    },
  },
];

describe('Integration tests for Lesson Editing', () => {
  const setup = (newCard?: Card, updatedCards?: Card[]) => {
    if (newCard) {
      (createCard as jest.Mock).mockReturnValueOnce(newCard);
    }
    if (updatedCards) {
      (getCardsAPI as jest.Mock)
        .mockReturnValueOnce(cards.map((card) => ({ ...card })))
        .mockReturnValueOnce(updatedCards.map((card) => ({ ...card })));
    } else {
      (getCardsAPI as jest.Mock).mockReturnValueOnce(
        cards.map((card) => ({ ...card })),
      );
    }
    (useQuery as jest.Mock).mockImplementation(() => {
      return {
        data: 1,
      };
    });
    render(
      <MemoryRouter>
        <AdminLesson />
      </MemoryRouter>,
    );
  };

  const createCardWithTextTemplate = async () => {
    const newCard: Card = {
      id: '4',
      type: CardType.LESSON_CARD,
      sequenceOrder: 1,
      title: 'new text content card',
      learningItem: '1',
      learningItemId: '1',
      confidenceCheck: true,
      json: {
        version: '1.0',
        description: 'test description new',
        templateType: 'blank',
        contentBlocks: [
          {
            id: '1',
            type: 'title',
            text: 'Untitled',
          } as TitleBlockType,
          {
            id: '2',
            type: 'body',
            text: 'This is your body text. Ready to bring life to this empty space? Start adding info for your learners here.',
          } as BodyBlockType,
        ],
      },
    };
    const updatedCards: Array<Card> = [
      cards[0],
      newCard,
      { ...cards[1], sequenceOrder: 2 },
      { ...cards[2], sequenceOrder: 3 },
    ];
    setup(newCard, updatedCards);
    fireEvent.click(screen.getByTestId('createCardButton'));
    expect(await screen.findByText('Lesson Cards')).toBeInTheDocument();
    const textTemplateButton = await screen.findByTestId('Text');
    expect(textTemplateButton).toBeInTheDocument();
    // Select template for text card
    fireEvent.click(textTemplateButton);
  };

  it('should render the lesson page with initial state', () => {
    setup();

    expect(screen.queryByText('Editing Lesson')).toBeInTheDocument();
    expect(screen.queryByText('Lesson Cards')).not.toBeInTheDocument();
    expect(screen.getByRole('listitem', { name: '1' })).toHaveTextContent(
      'Title',
    );
    expect(screen.getByRole('listitem', { name: '2' })).toHaveTextContent('1');
    expect(screen.getByRole('listitem', { name: '3' })).toHaveTextContent(
      'End',
    );
    expect(screen.queryByText('Card 1 Title')).toBeInTheDocument();
    expect(screen.queryByText('Card 2 Title')).toBeInTheDocument();
    expect(screen.queryByText('Card 3 Title')).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Move Card Left' }),
    ).toHaveClass('card-swapper-container__button--hidden');
    expect(
      screen.queryByRole('button', { name: 'Move Card Right' }),
    ).toBeDisabled();
  });

  it('should select the correct card when clicking an inactive card', async () => {
    setup();
    fireEvent.click(await screen.findByTestId('card-2'));
    expect(await screen.findByText('Card 1 Title')).toBeInTheDocument();
    expect(await screen.findByText('Card 2 Title')).toBeInTheDocument();
    expect(await screen.findByText('Card 3 Title')).toBeInTheDocument();
  });

  it('should create a new card with blank card template', async () => {
    const newCard: Card = {
      id: '4',
      type: CardType.LESSON_CARD,
      sequenceOrder: 1,
      title: 'new blank content card',
      learningItem: '1',
      learningItemId: '1',
      confidenceCheck: true,
      json: {
        templateType: 'blank',
        version: '1.0',
        description: 'test description new',
        contentBlocks: [],
      },
    };
    const updatedCards = [
      cards[0],
      newCard,
      { ...cards[1], sequenceOrder: 2 },
      { ...cards[2], sequenceOrder: 3 },
    ];
    setup(newCard, updatedCards);

    fireEvent.click(screen.getByTestId('createCardButton'));
    expect(await screen.findByText('Lesson Cards')).toBeInTheDocument();
    const blankCardButton = await screen.findByTestId('Blank');
    expect(blankCardButton).toBeInTheDocument();
    // Select template for Blank card
    fireEvent.click(blankCardButton);
    const newCardElement = await screen.findByText(
      /From text and images to video and more, the choice is yours!/,
    );
    expect(newCardElement).toBeInTheDocument();
    expect(
      await screen.findByRole('listitem', { name: '4' }),
    ).toBeInTheDocument();

    const titleInput = screen.getByTestId('titleInput') as HTMLInputElement;

    fireEvent.focus(titleInput);
    expect(screen.getByTestId('title-circle-progress')).toBeInTheDocument();
    fireEvent.change(titleInput, { target: { value: 'title123' } });
    fireEvent.keyPress(titleInput, { key: 'Enter', code: 'Enter' });
    expect(titleInput.value).toEqual('title123');
  });

  it('should add text content blocks to a blank card', async () => {
    const newCard: Card = {
      id: '4',
      type: CardType.LESSON_CARD,
      sequenceOrder: 1,
      title: 'new blank content card',
      learningItem: '1',
      learningItemId: '1',
      confidenceCheck: true,
      json: {
        templateType: 'blank',
        version: '1.0',
        description: 'test description new',
        contentBlocks: [],
      },
    };
    const updatedCards = [
      cards[0],
      newCard,
      { ...cards[1], sequenceOrder: 2 },
      { ...cards[2], sequenceOrder: 3 },
    ];
    setup(newCard, updatedCards);

    fireEvent.click(screen.getByTestId('createCardButton'));
    const blankCardButton = screen.getByTestId('Blank');
    fireEvent.click(blankCardButton);
    fireEvent.click(screen.getByTestId('addContentBlockButton'));
    const titleMenuItem = screen.getByRole('menuitem', {
      name: 'Title',
    });
    const subtitleMenuItem = screen.getByRole('menuitem', {
      name: 'Subtitle',
    });
    const bodyMenuItem = screen.getByRole('menuitem', {
      name: 'Body',
    });
    expect(titleMenuItem).toBeInTheDocument();
    expect(subtitleMenuItem).toBeInTheDocument();
    expect(bodyMenuItem).toBeInTheDocument();

    // Add title content block
    fireEvent.click(await screen.findByTestId('addContentBlockButton'));
    fireEvent.click(titleMenuItem);
    expect(await screen.findByText('Add a title here')).toBeInTheDocument();
    // Add subtitle content block
    fireEvent.click(screen.getByTestId('addContentBlockButton'));
    fireEvent.click(subtitleMenuItem);
    expect(await screen.findByText('Add a subtitle here')).toBeInTheDocument();
    // Add body content block
    fireEvent.click(screen.getByTestId('addContentBlockButton'));
    fireEvent.click(bodyMenuItem);
    expect(
      await screen.findByText(
        'This is your body text. Ready to bring life to this empty space? Start adding info for your learners here.',
      ),
    ).toBeInTheDocument();
  });

  it('should add a media content block to a blank card', async () => {
    setup();
    fireEvent.click(screen.getByTestId('createCardButton'));

    const blankCardButton = await screen.findByTestId('Blank');
    fireEvent.click(blankCardButton);

    fireEvent.click(screen.getByTestId('addContentBlockButton'));
    const mediaMenuItem = await screen.findByRole('menuitem', {
      name: 'Image',
    });

    expect(mediaMenuItem).toBeInTheDocument();

    fireEvent.click(await screen.findByTestId('addContentBlockButton'));
    fireEvent.click(mediaMenuItem);
    const mediaBlock = await screen.findByTestId('media-block-wrapper');
    expect(mediaBlock).toBeInTheDocument();
  });

  it('should create a new card with text card template', async () => {
    await createCardWithTextTemplate();
    expect(await screen.findByText('Untitled')).toBeInTheDocument();
    expect(
      await screen.findByText(
        'This is your body text. Ready to bring life to this empty space? Start adding info for your learners here.',
      ),
    ).toBeInTheDocument();
    expect(
      await screen.findByRole('listitem', { name: '4' }),
    ).toBeInTheDocument();
  });

  it('should create a new card when copying the selected card', async () => {
    const cardCopy: Card = {
      id: '4',
      type: CardType.LESSON_CARD,
      sequenceOrder: 2,
      title: 'content card copy',
      learningItem: '1',
      learningItemId: '1',
      confidenceCheck: true,
      json: {
        version: '1.0',
        description: 'test description copy',
        templateType: 'blank',
        contentBlocks: [
          {
            id: '2',
            type: 'title',
            text: 'Card 2 Title Copy',
          } as TitleBlockType,
        ],
      },
    };
    const updatedCards = [
      cards[0],
      cards[1],
      cardCopy,
      { ...cards[2], sequenceOrder: 3 },
    ];
    setup(cardCopy, updatedCards);
    // select the next card
    fireEvent.click(await screen.findByTestId('card-2'));
    fireEvent.click(await screen.findByRole('button', { name: 'copy' }));
    const newCardElement = await screen.findByText('Card 2 Title Copy');
    expect(newCardElement).toBeInTheDocument();
    expect(
      await screen.findByRole('listitem', { name: '4' }),
    ).toBeInTheDocument();
  });

  it('should show deletion confirmation screen the selected card is deleted', async () => {
    setup();
    // select the next card
    fireEvent.click(await screen.findByTestId('card-2'));

    // Click delete card button and cancel deletion
    fireEvent.click(await screen.findByRole('button', { name: 'delete' }));
    const deletionConfirmationMessage =
      'Looks like you want to delete this card, is that right?';
    expect(screen.queryByText(deletionConfirmationMessage)).toBeInTheDocument();
    fireEvent.click(await screen.findByRole('button', { name: 'Cancel' }));
    expect(
      screen.queryByText(deletionConfirmationMessage),
    ).not.toBeInTheDocument();
  });

  it('should delete the selected card', async () => {
    (deleteCard as jest.Mock).mockResolvedValue({});
    const updatedCards = [cards[0], { ...cards[2], sequenceOrder: 1 }];
    setup(undefined, updatedCards);

    // select the next card
    fireEvent.click(await screen.findByTestId('card-2'));

    // Click delete card button and confirm deletion
    fireEvent.click(await screen.findByRole('button', { name: 'delete' }));
    const deletionConfirmationMessage =
      'Looks like you want to delete this card, is that right?';
    expect(
      await screen.findByText(deletionConfirmationMessage),
    ).toBeInTheDocument();
    fireEvent.click(await screen.findByRole('button', { name: 'Yes, delete' }));
    await waitForElementToBeRemoved(() =>
      screen.queryByText(deletionConfirmationMessage),
    );
    await waitFor(() => {
      expect(screen.queryByText('Card 2 Title')).not.toBeInTheDocument();
    });
  });

  const testData = [
    {
      id: 1,
      title: 'Test Lesson',
      type: CardType.LESSON_CARD,
      label: 'Test Lesson',
      name: 'Test Lesson',
      sequenceOrder: 1,
      json: {
        templateType: 'text',
        version: '1.0',
        description: 'test desc',
        contentBlocks: [
          {
            id: '1',
            type: 'title',
            text: 'Card1 to import',
          } as TitleBlockType,
        ],
      },
    },
    {
      id: 2,
      title: 'Test Lesson2',
      type: CardType.LESSON_CARD,
      label: 'Test Lesson2',
      name: 'Test Lesson2',
      sequenceOrder: 2,
      json: {
        templateType: 'text',
        version: '1.0',
        description: 'test desc',
        contentBlocks: [
          {
            id: '1',
            type: 'title',
            text: 'Card2 to import',
          } as TitleBlockType,
        ],
      },
    },
  ];

  const importCardSetup = async () => {
    (useQuery as jest.Mock).mockImplementation(() => {
      return {
        data: testData,
        isFetching: false,
        refetch: () => {
          return testData;
        },
      };
    });
    render(
      <MemoryRouter>
        <AdminLesson />
      </MemoryRouter>,
    );
    fireEvent.click(screen.getByTestId('createCardButton'));
    const importCardsMenu = await screen.findByText('Import Cards');
    expect(importCardsMenu).toBeInTheDocument();
    fireEvent.click(importCardsMenu);
    const searchSelect = document.querySelector(
      `[data-testid="import-search-select"] > .ant-select-selector`,
    ) as HTMLElement;
    fireEvent.mouseDown(searchSelect);
    const learningItem = await screen.findByText('Test Lesson');

    fireEvent.click(learningItem);
  };

  it('should preview selected cards', async () => {
    await importCardSetup();
    const selectFirstIndex = await screen.findByTestId('first-preview-index');
    const selectSecondIndex = await screen.findByTestId('second-preview-index');
    expect(selectFirstIndex).toBeInTheDocument();
    expect(selectSecondIndex).toBeInTheDocument();

    fireEvent.change(selectFirstIndex, { target: { value: '1' } });
    fireEvent.change(selectSecondIndex, { target: { value: '2' } });
    expect(screen.getByText('Previewing')).toBeInTheDocument();

    const previewBack = await screen.findByTestId('preview-previous');
    const previewNext = await screen.findByTestId('preview-next');
    fireEvent.click(previewNext);
    expect(await screen.findByText(/Card2 to import/i)).toBeInTheDocument();
    fireEvent.click(previewBack);
    expect(screen.getByText(/Card1 to import/i)).toBeInTheDocument();
    expect(screen.getByText(/Import\(2\)/i)).toBeInTheDocument();

    expect(selectSecondIndex).toHaveValue(2);
    fireEvent.change(selectSecondIndex, { target: { value: '1' } });
    expect(selectFirstIndex).toHaveValue(1);
    const submitImport = await screen.findByTestId('import-submit');

    fireEvent.click(submitImport);
    await waitFor(() => {
      expect(submitImport).toBeDisabled();
    });
  });

  it('should show an alert if there are no cards', async () => {
    await importCardSetup();
    (useQuery as jest.Mock).mockImplementation(() => {
      return {
        data: [],
        isFetching: false,
        refetch: () => {
          return [];
        },
      };
    });
    const selectFirstIndex = await screen.findByTestId('first-preview-index');
    const selectSecondIndex = await screen.findByTestId('second-preview-index');
    fireEvent.change(selectFirstIndex, { target: { value: '1' } });
    fireEvent.change(selectSecondIndex, { target: { value: '2' } });
    expect(screen.getByText('No Cards Available')).toBeInTheDocument();
  });

  it('should swap the selected card', async () => {
    const swapLeftLabel = 'Move Card Left';
    const swapRightLabel = 'Move Card Right';

    const swappedCard = {
      id: '4',
      type: CardType.LESSON_CARD,
      sequenceOrder: 2,
      title: 'new text content card',
      learningItem: '1',
      learningItemId: '1',
      confidenceCheck: true,
      json: {
        version: '1.0',
        description: 'test description new',
        contentBlocks: [
          {
            id: '1',
            type: 'title',
            text: 'Untitled',
          } as TitleBlockType,
          {
            id: '2',
            type: 'body',
            text: 'This is your body text. Ready to bring life to this empty space? Start adding info for your learners here.',
          } as BodyBlockType,
        ],
      },
    };
    (updateCard as jest.Mock).mockResolvedValue(swappedCard);

    await createCardWithTextTemplate();
    expect(await screen.findByText('Untitled')).toBeInTheDocument();
    let swapleftButton = await screen.findByRole('button', {
      name: swapLeftLabel,
    });
    let swapRightButton = await screen.findByRole('button', {
      name: swapRightLabel,
    });
    expect(swapleftButton).toBeInTheDocument();
    expect(swapleftButton).toBeDisabled();

    expect(swapRightButton).toBeInTheDocument();
    expect(swapRightButton).toBeEnabled();

    fireEvent.mouseOver(swapRightButton);
    expect(await screen.findByText(swapRightLabel)).toBeInTheDocument();

    fireEvent.mouseOver(swapleftButton);
    expect(screen.queryByText(swapLeftLabel)).not.toBeInTheDocument();

    // Swap card to the right
    const resequencedCards = [
      cards[0],
      { ...cards[1], sequenceOrder: 1 },
      swappedCard,
      { ...cards[2], sequenceOrder: 3 },
    ];
    (getCardsAPI as jest.Mock).mockReturnValueOnce(
      resequencedCards.map((card) => ({ ...card })),
    );

    fireEvent.click(swapRightButton);

    expect(await screen.findByText('Card 3 Title')).toBeInTheDocument();
    swapleftButton = await screen.findByRole('button', {
      name: swapLeftLabel,
    });
    swapRightButton = await screen.findByRole('button', {
      name: swapRightLabel,
    });
    expect(swapleftButton).toBeEnabled();
    expect(swapRightButton).toBeDisabled();
  }, 10000);
});
