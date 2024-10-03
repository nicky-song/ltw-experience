import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { CourseParams, Course, EnrolledCourse, CourseDetailsParams, CourseUpdateParams } from './types';

interface CourseState {
  courseList: Array<Course>;
  enrolledCourseList: Array<EnrolledCourse>;
  courseDetails: Course;
  error: null | string;
  loading: boolean;
}

const initialState = {
  courseList: [],
  enrolledCourseList: [],
  courseDetails: {
    id: '',
    title: '',
    description: '',
  },
  error: null,
  loading: true,
} as CourseState;

export const courseSlice = createSlice({
  name: 'course',
  initialState,
  reducers: {
    getCourses(state) {
      state.loading = true;
    },
    getCoursesSuccess(state, action: PayloadAction<Course[]>) {
      state.courseList = action.payload;
      state.loading = false;
    },
    getCoursesFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },
    getCourseDetails(state) {
      state.loading = true;
    },
    getCourseDetailsSuccess(state, action) {
      state.courseDetails = {...state.courseDetails, ...action.payload};
      state.loading = false;
    },
    getCourseDetailsFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },
    updateCourseDetails(state) {
      state.loading = true;
    },
    updateCourseDetailsSuccess(state, action) {
      state.courseDetails = action.payload;
      state.loading = false;
    },
    updateCourseDetailsFailure(state, action){
      state.error = action.payload;
      state.loading = false;
    },
    getInviteOrEnrolledCourses(state, action) {
      state.loading = true;
    },
    getInviteOrEnrolledCoursesSuccess(
      state,
      action: PayloadAction<EnrolledCourse[]>,
    ) {
      state.loading = false;
      state.enrolledCourseList = action.payload;
    },
    getInviteOrEnrolledCoursesFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    resetState() {
      return initialState;
    },
  },
});

export const getCoursesAction = (payload: CourseParams) => ({
  type: 'course/getCourses',
  payload,
});

export const getCourseDetailsAction = (payload: CourseDetailsParams) => ({
  type: 'course/getCourseDetails',
  payload
});

export const updateCourseDetailsAction = (payload: CourseUpdateParams) => ({
  type: 'course/updateCourseDetails',
  payload
});

export default courseSlice.reducer;
export const {
  getCoursesSuccess,
  getCoursesFailure,
  resetState,
  getCourses,
  getCourseDetails,
  getCourseDetailsSuccess,
  getCourseDetailsFailure,
  updateCourseDetails,
  updateCourseDetailsSuccess,
  updateCourseDetailsFailure,
  getInviteOrEnrolledCourses,
  getInviteOrEnrolledCoursesFailure,
  getInviteOrEnrolledCoursesSuccess,
} = courseSlice.actions;
