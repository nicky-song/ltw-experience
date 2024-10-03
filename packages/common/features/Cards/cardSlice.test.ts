import { CardsState, Card } from './cardTypes';
import reducer, {
  getCards,
  resetState,
  getCardsFailure,
  getCardsSuccess,
} from './cardSlice';
import { CardType } from '../../constants';

const initialState: CardsState = {
  cards: [],
  loading: false,
  error: null,
  selectedCardId: null,
};

describe('cardSlice', () => {
  it('should handle initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle getCardsFailure', () => {
    const payload: Card = {
      id: '1',
      type: CardType.LESSON_CARD,
      sequenceOrder: 0,
      confidenceCheck: true,
      json: {
        description: 'description',
        contentBlocks: [],
        version: '1',
        templateType: null,
      },
      learningItem: 'learningItem',
      learningItemId: 'learningItemId',
      title: 'title',
    };

    expect(reducer(initialState, getCardsSuccess([payload]))).toEqual({
      ...initialState,
      cards: [payload],
    });
  });

  it('should handle getCardsFailure', () => {
    expect(reducer(initialState, getCardsFailure('error'))).toEqual({
      ...initialState,
      error: 'error',
    });
  });

  it('should handle resetState', () => {
    expect(reducer(initialState, resetState())).toEqual({
      ...initialState,
    });
  });

  it('should handle getCards', () => {
    expect(reducer(initialState, getCards)).toEqual({
      ...initialState,
      loading: true,
    });
  });
});
