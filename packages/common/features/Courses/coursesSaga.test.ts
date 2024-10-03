import { expectSaga } from 'redux-saga-test-plan';
import { call } from 'redux-saga/effects';
import { getCourses, getInviteOrEnrolledCourses } from './coursesSaga';
import {
  getCoursesAPI,
  getLearnerInvitedOrEnrolledCourses,
} from './coursesService';
import { CourseParams } from './types';

describe('courseSaga', () => {
  const getCoursesPayload = {
    organizationId: '1',
  } as CourseParams;
  const getInviteOrEnrolledCoursesPayload = {
    organizationId: '1',
    userId: '1',
  };
  it('should handle getCourses success', () => {
    const response = {
      title: 'testTitle',
      description: 'testDesc',
    };

    return expectSaga(getCourses, {
      type: 'course/getCourses',
      payload: { organizationId: '1' },
    })
      .provide([[call(getCoursesAPI, getCoursesPayload), response]])
      .put({ type: 'course/getCoursesSuccess', payload: response })
      .run();
  });

  it('should handle getCourses failure', () => {
    const error = new Error('error');

    return expectSaga(getCourses, {
      type: 'course/getCourses',
      payload: { ...getCoursesPayload },
    })
      .provide([
        [call(getCoursesAPI, getCoursesPayload), Promise.reject(error)],
      ])
      .put({ type: 'course/getCoursesFailure', payload: error?.toString() })
      .run();
  });

  it('should handle getInviteOrEnrolledCourses success', () => {
    return expectSaga(getInviteOrEnrolledCourses, {
      type: 'course/getInviteOrEnrolledCourses',
      payload: { ...getInviteOrEnrolledCoursesPayload },
    })
      .provide([
        [
          call(
            getLearnerInvitedOrEnrolledCourses,
            getInviteOrEnrolledCoursesPayload,
          ),
          getInviteOrEnrolledCoursesPayload,
        ],
      ])
      .put({
        type: 'course/getInviteOrEnrolledCoursesSuccess',
        payload: { organizationId: '1', userId: '1' },
      })
      .run();
  });

  it('should handle getEnrolledCourses failure', () => {
    const error = new Error('error');

    return expectSaga(getInviteOrEnrolledCourses, {
      type: 'course/getEnrolledCourses',
      payload: { ...getInviteOrEnrolledCoursesPayload },
    })
      .provide([
        [
          call(
            getLearnerInvitedOrEnrolledCourses,
            getInviteOrEnrolledCoursesPayload,
          ),
          Promise.reject(error),
        ],
      ])
      .put({
        type: 'course/getInviteOrEnrolledCoursesFailure',
        payload: error?.toString(),
      })
      .run();
  });
});
