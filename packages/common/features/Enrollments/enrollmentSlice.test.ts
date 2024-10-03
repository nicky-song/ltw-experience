import reducer from './enrollmentSlice';
import { EnrollmentState } from './enrollmentTypes';

describe('enrollment slice', () => {
  const initialState: EnrollmentState = {
    cardEnrollments: [],
    courseEnrollment: [],
    learningItemEnrollments: [],
    loading: true,
    error: null,
  };

  it('should handle initialState', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle getEnrollmentCourses', () => {
    const expected = {
      ...initialState,
      loading: true,
    };

    expect(
      reducer(initialState, { type: 'enrollment/getEnrollmentCourses' }),
    ).toEqual(expected);
  });

  it('should handle fetchAndCreateEnrollments', () => {
    const expected = {
      ...initialState,
      loading: true,
    };

    expect(
      reducer(initialState, {
        type: 'enrollment/fetchAndCreateEnrollments',
        payload: { id: '1' },
      }),
    ).toEqual(expected);
  });
  it('should handle getCardsEnrollmentByLearningItemSuccess', () => {
    const expected = {
      ...initialState,
      loading: false,
      cardEnrollments: [{ id: '1' }],
    };

    expect(
      reducer(initialState, {
        type: 'enrollment/getCardsEnrollmentByLearningItemSuccess',
        payload: [{ id: '1' }],
      }),
    ).toEqual(expected);
  });
  it('should handle createCardsEnrollmentSuccess', () => {
    const expected = {
      ...initialState,
      loading: false,
      cardEnrollments: [{ id: '1' }],
    };

    expect(
      reducer(initialState, {
        type: 'enrollment/createCardsEnrollmentSuccess',
        payload: { id: '1' },
      }),
    ).toEqual(expected);
  });
  it('should handle fetchAndCreateEnrollmentsFailure', () => {
    const expected = {
      ...initialState,
      loading: false,
      error: 'error',
    };

    expect(
      reducer(initialState, {
        type: 'enrollment/fetchAndCreateEnrollmentsFailure',
        payload: 'error',
      }),
    ).toEqual(expected);
  });
});
