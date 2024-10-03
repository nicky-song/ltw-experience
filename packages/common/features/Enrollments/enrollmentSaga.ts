import { PayloadAction } from '@reduxjs/toolkit';
import {
  CardEnrollmentParams,
  CreateLearningItemEnrollmentParams,
  GetCourseEnrollmentParams,
  GetLearningItemEnrollmentParams,
} from './enrollmentTypes';
import { call, put, select, takeEvery } from 'redux-saga/effects';
import { SagaIterator } from 'redux-saga';
import { AxiosError } from 'axios';
import { selectCards } from '../Cards/cardSlice';
import { selectLearningItems } from '../LearningItems/learningItemSlice';
import {
  createCardEnrollment as createCardEnrollmentAPI,
  createCourseEnrollment as createCourseEnrollmentAPI,
  createLearningItemEnrollment,
  getCardsEnrollmentByLearningItem as getCardsEnrollmentByLearningItemAPI,
  getCourseEnrollment as getCourseEnrollmentAPI,
  getLearningItemEnrollment as getLearningItemEnrollmentAPI,
  getLearningItemsEnrollmentByCourse,
} from './enrollmentService';
import { getInvitation } from '../Invitations/invitationService';
import {
  fetchAndCreateCourseEnrollments as fetchAndCreateCourseEnrollmentsAction,
  fetchAndCreateEnrollments as fetchAndCreateEnrollmentsAction,
} from './enrollmentSlice';

function* enrollmentSaga() {
  yield takeEvery(
    fetchAndCreateCourseEnrollmentsAction.type,
    fetchAndCreateCourseEnrollments,
  );
  yield takeEvery(
    fetchAndCreateEnrollmentsAction.type,
    fetchAndCreateLearningItemEnrollments,
  );
  yield takeEvery(
    'enrollment/getCardsEnrollment',
    getCardsEnrollmentByLearningItem,
  );
}

function* fetchAndCreateCourseEnrollments(
  action: PayloadAction<GetCourseEnrollmentParams>,
): Generator<any> {
  const { invitationId } = action.payload;
  const courseEnrollmentResponse: any = yield call(
    getCourseEnrollment,
    invitationId,
  );
  yield call(getLearningItemsEnrollment, courseEnrollmentResponse?.['@id']);
}

function* fetchAndCreateLearningItemEnrollments(
  action: PayloadAction<GetLearningItemEnrollmentParams>,
) {
  const { learningItemEnrollmentId } = action.payload;
  yield call(getLearningItemEnrollment, learningItemEnrollmentId);
}

export function* getCourseEnrollment(invitationId: string): SagaIterator {
  try {
    let getCourseEnrollmentResponse = yield call(
      getCourseEnrollmentAPI,
      invitationId,
    );
    if (getCourseEnrollmentResponse instanceof AxiosError) {
      yield put({
        type: 'enrollment/fetchAndCreateCourseEnrollmentsFailure',
        payload: getCourseEnrollmentResponse.message,
      });
      return;
    }
    const invitation = yield call(getInvitation, invitationId);
    // Fetch learning items for a course (by courseId)
    yield put({
      type: 'learningItems/getLearningItems',
      payload: {
        organizationId: invitation?.organizationId,
        courseId: invitation?.courseId,
      },
    });
    if (getCourseEnrollmentResponse?.length === 0) {
      const payload = {
        invitation: invitation?.['@id'],
        courseId: invitation?.courseId,
        userId: invitation?.invitedUserId,
        organizationId: invitation?.organizationId,
      };
      getCourseEnrollmentResponse = yield call(
        createCourseEnrollmentAPI,
        payload,
      );
    } else {
      getCourseEnrollmentResponse = getCourseEnrollmentResponse[0];
    }

    yield put({
      type: 'course/getCourseDetails',
      payload: {
        organizationId: invitation?.organizationId,
        courseId: invitation?.courseId,
      },
    });

    yield put({
      type: 'enrollment/getCourseEnrollmentSuccess',
      payload: getCourseEnrollmentResponse,
    });

    return getCourseEnrollmentResponse;
  } catch (error) {
    yield put({
      type: 'enrollment/fetchAndAPIsFailure',
      payload: error?.toString(),
    });
  }
}
export function* getLearningItemsEnrollment(
  courseEnrollmentIRI: string,
): SagaIterator {
  try {
    const courseEnrollmentId = courseEnrollmentIRI.substring(
      courseEnrollmentIRI.lastIndexOf('/') + 1,
    );
    const learningItemsEnrollmentResponse = yield call(
      getLearningItemsEnrollmentByCourse,
      courseEnrollmentId,
    );

    if (learningItemsEnrollmentResponse instanceof AxiosError) {
      yield put({
        type: 'enrollment/fetchAndAPIsFailure',
        payload: learningItemsEnrollmentResponse.message,
      });
      return;
    }

    if (learningItemsEnrollmentResponse?.length === 0) {
      yield call(createLearningItemsEnrollments, courseEnrollmentIRI);
      return;
    }

    yield put({
      type: 'enrollment/getLearningItemsEnrollmentSuccess',
      payload: learningItemsEnrollmentResponse,
    });
  } catch (error) {
    yield put({
      type: 'enrollment/fetchAndAPIsFailure',
      payload: error?.toString(),
    });
  }
}
export function* createLearningItemsEnrollments(
  courseEnrollmentIRI: string,
): SagaIterator {
  try {
    // Get Learning Items from the store
    const learningItems: ReturnType<typeof selectLearningItems> = yield select(
      selectLearningItems,
    );

    if (learningItems.length === 0) {
      yield put({
        type: 'learningItems/getLearningItemsFailure',
        payload: 'No learning items found',
      });
      return;
    }

    for (const learningItem of learningItems) {
      const payload = {
        courseEnrollment: courseEnrollmentIRI,
        learningItemId: learningItem.id,
        progress: 0,
      } as CreateLearningItemEnrollmentParams;

      const learningItemEnrollmentResponse = yield call(
        createLearningItemEnrollment,
        payload,
      );
      if (learningItemEnrollmentResponse instanceof AxiosError) {
        yield put({
          type: 'enrollment/fetchAndAPIsFailure',
          payload: learningItemEnrollmentResponse.message,
        });
        return;
      }
      yield put({
        type: 'enrollment/createLearningItemsEnrollmentSuccess',
        payload: learningItemEnrollmentResponse,
      });
    }
  } catch (error) {
    yield put({
      type: 'enrollment/fetchAndAPIsFailure',
      payload: error?.toString(),
    });
  }
}
export function* getLearningItemEnrollment(
  learningItemEnrollmentId: string,
): SagaIterator {
  try {
    const learningItemEnrollmentData = yield call(
      getLearningItemEnrollmentAPI,
      learningItemEnrollmentId,
    );

    if (learningItemEnrollmentData instanceof AxiosError) {
      yield put({
        type: 'enrollment/fetchAndCreateEnrollmentsFailure',
        payload: learningItemEnrollmentData?.message,
      });
      return;
    }

    // Fetch cards for the learning item
    yield put({
      type: 'card/getCards',
      payload: { learningItemId: learningItemEnrollmentData?.learningItemId },
    });

    yield call(getCardsEnrollmentByLearningItem, {
      type: '',
      payload: {
        learningItemEnrollmentId,
      },
    });
  } catch (error) {
    yield put({
      type: 'enrollment/fetchAndCreateEnrollmentsFailure',
      payload: error?.toString(),
    });
  }
}
export function* getCardsEnrollmentByLearningItem(
  action: PayloadAction<GetLearningItemEnrollmentParams>,
): SagaIterator {
  try {
    const cardsEnrollmentData = yield call(
      getCardsEnrollmentByLearningItemAPI,
      action.payload.learningItemEnrollmentId,
    );

    if (cardsEnrollmentData instanceof AxiosError) {
      yield put({
        type: 'enrollment/fetchAndCreateEnrollmentsFailure',
        payload: cardsEnrollmentData?.message,
      });
      return;
    }
    if (cardsEnrollmentData?.length === 0) {
      yield call(
        createCardsEnrollment,
        action.payload.learningItemEnrollmentId,
      );
      return;
    }
    yield put({
      type: 'enrollment/getCardsEnrollmentByLearningItemSuccess',
      payload: cardsEnrollmentData,
    });
  } catch (error) {
    yield put({
      type: 'enrollment/fetchAndCreateEnrollmentsFailure',
      payload: error?.toString(),
    });
  }
}

export function* createCardsEnrollment(
  learningItemEnrollmentId: string,
): SagaIterator {
  try {
    // Get cards from card slice of the store
    const cards: ReturnType<typeof selectCards> = yield select(selectCards);
    if (cards.length === 0) {
      yield put({
        type: 'enrollment/fetchAndCreateEnrollmentsFailure',
        payload: 'No cards found',
      });
      return;
    }
    // Iterate over cards and create enrollment
    for (const card of cards) {
      const payload: CardEnrollmentParams = {
        learningItemEnrollmentId,
        cardId: card.id,
        startedAt: card.sequenceOrder === 0 ? new Date().toISOString() : null,
      };

      const cardEnrollmentData = yield call(createCardEnrollmentAPI, payload);
      if (cardEnrollmentData instanceof AxiosError) {
        yield put({
          type: 'enrollment/fetchAndCreateEnrollmentsFailure',
          payload: cardEnrollmentData?.message,
        });
        return;
      }
      yield put({
        type: 'enrollment/createCardsEnrollmentSuccess',
        payload: cardEnrollmentData,
      });
    }
  } catch (error) {
    yield put({
      type: 'enrollment/fetchAndCreateEnrollmentsFailure',
      payload: error?.toString(),
    });
  }
}

export default enrollmentSaga;
