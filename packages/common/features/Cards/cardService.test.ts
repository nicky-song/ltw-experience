import { CardType } from '../../constants';
import {
  createCard,
  getCardsAPI,
  updateCard,
  deleteCard,
  createCardBatch,
} from './cardService';

const mockRestClient = {
  get: jest.fn(() => ({
    data: {
      'hydra:member': 'helloWorld',
    },
  })),
  post: jest.fn(() => ({
    data: {
      'hydra:member': 'postResponse',
    },
  })),
  patch: jest.fn(() => ({
    data: 'patchResponse',
  })),
  delete: jest.fn(() => ({
    data: undefined,
  })),
};

jest.mock('../../utils/restClient', () => {
  return {
    getRestClient: jest.fn(() => mockRestClient),
    getApiGatewayUrl: jest.fn(() => 'test'),
  };
});
describe('getCardsAPI', () => {
  it('should make an api request', async () => {
    const res = await getCardsAPI({
      learningItemId: '1',
    });

    expect(res).toEqual('helloWorld');
  });
});

describe('createCard', () => {
  it('should make an api request', async () => {
    const res = await createCard({
      sequenceOrder: 0,
      learningItemId: 'api/learning_items/1',
      confidenceCheck: true,
      type: CardType.QUIZ_CARD,
      title: 'Card',
      json: JSON.parse('{"description":"Default Description"}'),
    });

    expect(res).toEqual({
      'hydra:member': 'postResponse',
    });
  });
});

describe('create card batch', () => {
  it('should make an api request', async () => {
    const res = await createCardBatch(
      [
        {
          sequenceOrder: 0,
          learningItemId: 'api/learning_items/1',
          confidenceCheck: true,
          type: CardType.QUIZ_CARD,
          title: 'Card',
          json: JSON.parse('{"description":"Default Description"}'),
        },
      ],
      '1',
    );

    expect(res).toEqual({
      'hydra:member': 'postResponse',
    });
  });
});

describe('updateCard', () => {
  it('should make an api request', async () => {
    const res = await updateCard({
      id: '1',
      sequenceOrder: 0,
      learningItemId: 'api/learning_items/1',
      learningItem: 'api/learning_items/1',
      type: CardType.QUIZ_CARD,
      title: 'Card',
      json: JSON.parse('{"description":"Default Description"}'),
    });

    expect(res).toEqual('patchResponse');
  });
});

describe('deleteCard', () => {
  it('should make an api request', async () => {
    const res = await deleteCard('1');

    expect(res).toEqual(undefined);
  });
});
