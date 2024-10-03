import { getLearningItemDetails, getLearningItems } from './learningItemSaga';
import { expectSaga } from 'redux-saga-test-plan';
import { getLearningItem, getLearningItemsAPI } from '@learn-to-win/common/features/LearningItems/learningItemService';
import { call } from 'redux-saga/effects';

describe('learningitemSaga', () => {
  const getCoursesPayload = { organizationId: '1', courseId: '1' };
  const getLearningItemPayload = { learningItemId: '1' };
  it('should handle getLearningItemsSuccess', () => {
    const response = {
      name: 'testName',
      description: 'testdesc',
      numberOfSlides: 1,
    };

    return expectSaga(getLearningItems, {
      payload: getCoursesPayload,
      type: 'learningItems/getLearningItems',
    })
      .provide([[call(getLearningItemsAPI, getCoursesPayload), response]])
      .put({
        type: 'learningItems/getLearningItemsSuccess',
        payload: response,
      })
      .run();
  });

  it('should handle getLearningItemsFailure', () => {
    return expectSaga(getLearningItems, {
      type: 'learningItems/getLearningItems',
      payload: getCoursesPayload,
    })
      .provide([
        [call(getLearningItemsAPI, getCoursesPayload), Promise.reject('error')],
      ])
      .put({ type: 'learningItems/getLearningItemsFailure', payload: 'error' })
      .run();
  });

  it('should handle getLearningItemDetailsSuccess', () => {
    const response = {
      cards: [],
      course: '',
      createdAt: '',
      createdBy: '',
      id: '',
      name: '',
      state: '',
      type: '',
      updatedAt: '',
      updatedBy: '',
    };

    return expectSaga(getLearningItemDetails, {
      payload: getLearningItemPayload,
      type: 'learningItems/getLearningItemDetails',
    })
      .provide([[call(getLearningItem, getLearningItemPayload), response]])
      .put({
        type: 'learningItems/getLearningItemDetailsSuccess',
        payload: response,
      })
      .run();
  });

  it('should handle getLearningItemDetailsFailure', () => {
    return expectSaga(getLearningItemDetails, {
      type: 'learningItems/getLearningItemDetails',
      payload: getLearningItemPayload,
    })
      .provide([
        [call(getLearningItem, getLearningItemPayload), Promise.reject('error')],
      ])
      .put({ type: 'learningItems/getLearningItemDetailsFailure', payload: 'error' })
      .run();
  });
});
