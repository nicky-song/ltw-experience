import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  CardEnrollment,
  EnrollmentState,
  GetCourseEnrollmentParams,
  GetLearningItemEnrollmentParams,
} from './enrollmentTypes';

const initialState: EnrollmentState = {
  cardEnrollments: [],
  courseEnrollment: [],
  learningItemEnrollments: [],
  loading: true,
  error: null,
};

export const enrollmentCourseSlice = createSlice({
  name: 'enrollment',
  initialState,
  reducers: {
    fetchAndCreateCourseEnrollments(
      state,
      action: PayloadAction<GetCourseEnrollmentParams>,
    ) {
      state.loading = true;
    },
    getCourseEnrollmentSuccess(state, action) {
      state.loading = false;
      state.courseEnrollment = action.payload;
    },
    getLearningItemsEnrollmentSuccess(state, action) {
      state.loading = false;
      state.learningItemEnrollments = action.payload;
    },
    createLearningItemsEnrollmentSuccess(state, action) {
      state.loading = false;
      state.learningItemEnrollments.push(action.payload);
    },
    fetchAndCreateCourseEnrollmentsFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    fetchAndCreateEnrollments(
      state,
      action: PayloadAction<GetLearningItemEnrollmentParams>,
    ) {
      state.loading = true;
    },
    getCardsEnrollmentByLearningItemSuccess(
      state,
      action: PayloadAction<CardEnrollment[]>,
    ) {
      state.loading = false;
      state.cardEnrollments = action.payload;
    },
    createCardsEnrollmentSuccess(state, action: PayloadAction<CardEnrollment>) {
      state.loading = false;
      state.cardEnrollments.push({ ...action.payload, answerCorrect: null });
    },
    fetchAndCreateEnrollmentsFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    setCardEnrollmentAnswerCorrect(state, action) {
      const { id, answerCorrect } = action.payload;
      const index = state.cardEnrollments.findIndex(
        (enrollment) => enrollment.id === id,
      );
      if (index > -1) {
        state.cardEnrollments[index].answerCorrect = answerCorrect;
      }
    },
  },
});

export const getCardsEnrollmentAction = (
  payload: GetLearningItemEnrollmentParams,
) => ({
  type: 'enrollment/getCardsEnrollment',
  payload,
});

export const {
  fetchAndCreateEnrollments,
  fetchAndCreateCourseEnrollments,
  setCardEnrollmentAnswerCorrect,
} = enrollmentCourseSlice.actions;

export default enrollmentCourseSlice.reducer;
