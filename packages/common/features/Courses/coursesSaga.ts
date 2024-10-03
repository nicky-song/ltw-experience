import { AxiosError } from 'axios';
import { takeEvery, put, call } from 'redux-saga/effects';
import { SagaIterator } from 'redux-saga';
import { PayloadAction } from '@reduxjs/toolkit';
import {
  CourseParams,
  CourseUpdateParams,
  InvitedOrEnrolledCourseParams,
  OneCourseParams,
} from './types';
import {
  getLearnerInvitedOrEnrolledCourses,
  getCoursesAPI,
  getCourseDetails as getCourseDetailsAPI,
  updateCourseDetails,
} from './coursesService';

export function* getCourses(action: PayloadAction<CourseParams>): SagaIterator {
  try {
    const coursesResponse: ReturnType<typeof getCoursesAPI> = yield call(
      getCoursesAPI,
      action.payload,
    );

    if (coursesResponse instanceof AxiosError) {
      yield put({
        type: 'course/getCoursesFailure',
        payload: coursesResponse.message,
      });
    } else {
      yield put({
        type: 'course/getCoursesSuccess',
        payload: coursesResponse,
      });
    }
  } catch (error) {
    yield put({
      type: 'course/getCoursesFailure',
      payload: error?.toString(),
    });
  }
}

function* getCourseDetails(
  action: PayloadAction<OneCourseParams & CourseParams>,
): SagaIterator {
  try {
    const courseResponse: ReturnType<typeof getCourseDetailsAPI> = yield call(
      getCourseDetailsAPI,
      action.payload,
    );

    if (courseResponse instanceof AxiosError) {
      yield put({
        type: 'course/getCourseDetailsFailure',
        payload: courseResponse.message,
      });
    } else {
      yield put({
        type: 'course/getCourseDetailsSuccess',
        payload: courseResponse,
      });
    }
  } catch (error) {
    yield put({
      type: 'course/getCourseDetailsFailure',
      payload: error?.toString(),
    });
  }
}

export function* getInviteOrEnrolledCourses(
  action: PayloadAction<InvitedOrEnrolledCourseParams>,
): SagaIterator {
  try {
    const inviteOrEnrolledCoursesResponse: ReturnType<
      typeof getLearnerInvitedOrEnrolledCourses
    > = yield call(getLearnerInvitedOrEnrolledCourses, action.payload);

    if (inviteOrEnrolledCoursesResponse instanceof AxiosError) {
      yield put({
        type: 'course/getInviteOrEnrolledCoursesFailure',
        payload: inviteOrEnrolledCoursesResponse.message,
      });
    } else {
      yield put({
        type: 'course/getInviteOrEnrolledCoursesSuccess',
        payload: inviteOrEnrolledCoursesResponse,
      });
    }
  } catch (error) {
    yield put({
      type: 'course/getInviteOrEnrolledCoursesFailure',
      payload: error?.toString(),
    });
  }
}

export function* updateCourse(
  action: PayloadAction<CourseUpdateParams>,
): SagaIterator {
  try {
    const updateCourseResponse: ReturnType<typeof updateCourseDetails> = 
    yield call(updateCourseDetails, action.payload);

    if (updateCourseResponse instanceof AxiosError) {
      yield put({
        type: 'course/updateCourseDetailsFailure',
        payload: updateCourseResponse.message,
      });
    } else {
      yield put({
        type: 'course/updateCourseDetailsSuccess',
        payload: updateCourseResponse,
      });
    }
  } catch (error) {
    yield put({
      type: 'course/updateCourseDetailsFailure',
      payload: error?.toString(),
    });
  }
}

function* courseSaga() {
  yield takeEvery('course/getCourses', getCourses);
  yield takeEvery('course/getCourseDetails', getCourseDetails);
  yield takeEvery('course/updateCourseDetails', updateCourse);
  yield takeEvery(
    'course/getInviteOrEnrolledCourses',
    getInviteOrEnrolledCourses,
  );
}

export default courseSaga;
