import { all, fork } from 'redux-saga/effects';
import userSaga from '@features/Users/userSaga';
import AuthSaga from '@learn-to-win/common/features/Auth/authSaga';
import { getAllUserInfo, login as loginAPI } from '@features/Auth/authService';
import cardSaga from '@learn-to-win/common/features/Cards/cardSaga';
import courseSaga from '@learn-to-win/common/features/Courses/coursesSaga';
import learningItemSaga from '@learn-to-win/common/features/LearningItems/learningItemSaga';
import enrollmentSaga from '@learn-to-win/common/features/Enrollments/enrollmentSaga';
import { initializeTrackers } from '@/utils/trackers';

const myAuthSagaClass = new AuthSaga(
  loginAPI,
  getAllUserInfo,
  initializeTrackers,
);

export default function* rootSaga() {
  yield all([
    fork(userSaga),
    fork(myAuthSagaClass.authSaga.bind(myAuthSagaClass)),
    fork(courseSaga),
    fork(learningItemSaga),
    fork(cardSaga),
    fork(enrollmentSaga),
  ]);
}
