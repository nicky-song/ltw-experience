import reducer, {
  createUserSuccess,
  createUserFailure,
  resetState,
} from './userSlice';

describe('userSlice', () => {
  const initialState = {
    loading: false,
    error: null,
    userCreated: false,
    users: [],
  };
  it('should handle initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual({
      loading: false,
      error: null,
      userCreated: false,
      users: [],
    });
  });
  it('should handle createUserSuccess', () => {
    const expected = {
      loading: false,
      error: null,
      userCreated: true,
      users: [],
    };

    const actual = reducer(initialState, createUserSuccess());
    expect(actual).toEqual(expected);
  });

  it('should handle createUserFailure', () => {
    const expected = {
      loading: false,
      error: 'error',
      userCreated: false,
      users: [],
    };
    const actual = reducer(initialState, createUserFailure('error'));
    expect(actual).toEqual(expected);
  });
  it('should handle resetState', () => {
    const actual = reducer(initialState, resetState());
    expect(actual).toEqual(initialState);
  });
});
