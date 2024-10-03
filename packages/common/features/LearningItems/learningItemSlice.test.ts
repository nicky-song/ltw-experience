import { LearningItemState, LearningItem } from './learningItemTypes';
import reducer, {
  getLearningItemsSuccess,
  getLearningItemsFailure,
  resetState,
  getLearningItems,
} from './learningItemSlice';

describe('learning item slice', () => {
  const initialState = {
    learningItemList: [],
    learningItemDetails: null,
    loading: true,
    error: null,
  } as LearningItemState;
  it('should handle initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle getlearningItemsSuccess', () => {
    const payload = {
      id: '1',
      name: 'test',
      description: 'testdesc',
      cards: [],
    } as LearningItem;

    const expected = {
      learningItemList: [payload],
      learningItemDetails: null,
      loading: false,
      error: null,
    };

    expect(reducer(initialState, getLearningItemsSuccess([payload]))).toEqual(
      expected,
    );
  });

  it('should handle getlearningItemsFailure', () => {
    const expected = {
      learningItemList: [],
      learningItemDetails: null,
      error: 'error',
      loading: false,
    };

    expect(reducer(initialState, getLearningItemsFailure('error'))).toEqual(
      expected,
    );
  });

  it('should handle resetState', () => {
    const expected = {
      learningItemList: [],
      learningItemDetails: null,
      error: null,
      loading: true,
    };
    expect(reducer(initialState, resetState())).toEqual(expected);
  });

  it('should handle getLearningItems', () => {
    const expected = {
      learningItemList: [],
      learningItemDetails: null,
      error: null,
      loading: true,
    };
    expect(reducer(initialState, getLearningItems)).toEqual(expected);
  });
});
