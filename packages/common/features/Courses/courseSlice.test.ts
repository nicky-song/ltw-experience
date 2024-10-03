import reducer, {
  getCoursesSuccess,
  getCoursesFailure,
  resetState,
  getCourses,
} from './courseSlice';

describe('course slice', () => {
  const initialState = {
    courseList: [],
    courseDetails: {
      id: '',
      title: '',
      description: '',
    },
    error: null,
    loading: true,
    enrolledCourseList: [],
  };

  it('should handle initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual({
      loading: true,
      error: null,
      courseList: [],
      enrolledCourseList: [],
      courseDetails: {
        id: '',
        title: '',
        description: '',
      },
    });
  });

  it('should handle getCoursesSuccess', () => {
    const expected = {
      courseList: [{ id: '1', title: 'test', description: 'testDesc' }],
      courseDetails: {
        id: '',
        title: '',
        description: '',
      },
      error: null,
      loading: false,
      enrolledCourseList: [],
    };
    const actual = reducer(
      initialState,
      getCoursesSuccess([{ id: '1', title: 'test', description: 'testDesc' }]),
    );

    expect(actual).toEqual(expected);
  });

  it('should handle getCoursesFailure', () => {
    const expected = {
      courseList: [],
      courseDetails: {
        id: '',
        title: '',
        description: '',
      },
      error: 'error',
      loading: false,
      enrolledCourseList: [],
    };

    const actual = reducer(initialState, getCoursesFailure('error'));
    expect(actual).toEqual(expected);
  });

  it('should handle resetState', () => {
    const expected = {
      courseList: [],
      courseDetails: {
        id: '',
        title: '',
        description: '',
      },
      error: null,
      loading: true,
      enrolledCourseList: [],
    };
    const actual = reducer(initialState, resetState());
    expect(actual).toEqual(expected);
  });

  it('should handle getCourses', () => {
    const expected = {
      courseList: [],
      courseDetails: {
        id: '',
        title: '',
        description: '',
      },
      error: null,
      loading: true,
      enrolledCourseList: [],
    };
    const actual = reducer(initialState, getCourses());
    expect(actual).toEqual(expected);
  });
});
