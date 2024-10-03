import { PayloadAction } from '@reduxjs/toolkit';
import { GetLearningItemParams, GetOneLearningItemParams } from './learningItemTypes';
import { call, put, takeEvery } from 'redux-saga/effects';
import { AxiosError } from 'axios';
import { getLearningItem, getLearningItemsAPI } from './learningItemService';

export function* getLearningItems(action: PayloadAction<GetLearningItemParams>) {
  try {
    const getLearningItemsResponse: ReturnType<typeof getLearningItemsAPI> =
      yield call(getLearningItemsAPI, action.payload);

    if (getLearningItemsResponse instanceof AxiosError) {
      yield put({
        type: 'learningItems/getLearningItemsFailure',
        payload: getLearningItemsResponse.message,
      });
    } else {
      yield put({
        type: 'learningItems/getLearningItemsSuccess',
        payload: getLearningItemsResponse,
      });
    }
  } catch (error) {
    yield put({
      type: 'learningItems/getLearningItemsFailure',
      payload: error?.toString(),
    });
  }
}

export function* getLearningItemDetails(action: PayloadAction<GetOneLearningItemParams>) {
  try {
    const getLearningItemDetailsResponse: ReturnType<typeof getLearningItem> =
      yield call(getLearningItem, action.payload);
    
    if (getLearningItemDetailsResponse instanceof AxiosError) {
      yield put({
        type: 'learningItems/getLearningItemDetailsFailure',
        payload: getLearningItemDetailsResponse.message,
      });
    } else {
      yield put({
        type: 'learningItems/getLearningItemDetailsSuccess',
        payload: getLearningItemDetailsResponse,
      });
    }
  } catch (error) {
    yield put({
      type: 'learningItems/getLearningItemDetailsFailure',
      payload: error?.toString(),
    });
  }
}

function* learningItemSaga() {
  yield takeEvery('learningItems/getLearningItems', getLearningItems);
  yield takeEvery('learningItems/getLearningItemDetails', getLearningItemDetails);
}

export default learningItemSaga;
