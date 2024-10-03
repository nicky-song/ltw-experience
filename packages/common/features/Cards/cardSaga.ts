import { PayloadAction } from '@reduxjs/toolkit';
//import { getCardsAPI, updateCard as updateCardApi } from './cardService';
import { Card, GetCardsParams } from './cardTypes';
import { call, put, take, takeEvery } from 'redux-saga/effects';
import { AxiosError } from 'axios';
import {
  getCardsAction,
  getCardsAndSetSelectedCardAction,
  setSelectedCardIdAction,
} from './cardSlice';
import { getCardsAPI, updateCard as updateCardAPI } from './cardService';

export function* getCards(action: PayloadAction<GetCardsParams>) {
  try {
    const { resetSelectedCard = true, cardId } = action.payload;
    const getCardsResponse: Awaited<ReturnType<typeof getCardsAPI>> =
      yield call(getCardsAPI, action.payload);

    if (getCardsResponse instanceof AxiosError) {
      yield put({
        type: 'card/getCardsFailure',
        payload: getCardsResponse.message,
      });
    } else {
      yield put({
        type: 'card/getCardsSuccess',
        payload: getCardsResponse,
      });
      if (cardId && getCardsResponse.find((card: Card) => card.id === cardId)) {
        yield put(setSelectedCardIdAction(cardId));
      } else if (resetSelectedCard) {
        yield put(setSelectedCardIdAction(getCardsResponse[0]?.id));
      }
    }
  } catch (error) {
    yield put({
      type: 'card/getCardsFailure',
      payload: error?.toString(),
    });
  }
}

export function* updateCard(action: PayloadAction<Card>) {
  try {
    yield call(updateCardAPI, action.payload);
    yield put({
      type: 'card/updateCardSuccess',
      payload: action.payload,
    });
  } catch (error) {
    yield put({
      type: 'card/updateCardFailure',
      payload: error?.toString(),
    });
  }
}

export function* getCardsAndSetSelectedCard(
  action: ReturnType<typeof getCardsAndSetSelectedCardAction>,
) {
  yield put(
    getCardsAction({
      learningItemId: action.payload.learningItemId,
      resetSelectedCard: false,
    }),
  );

  const response: { type: string } = yield take([
    'card/getCardsSuccess',
    'card/getCardsFailure',
  ]);
  if (response.type === 'card/getCardsSuccess') {
    yield put(setSelectedCardIdAction(action.payload.selectedCardId));
  }
}

function* cardSaga() {
  yield takeEvery('card/getCards', getCards);
  yield takeEvery('card/updateCard', updateCard);
  yield takeEvery(
    getCardsAndSetSelectedCardAction.toString(),
    getCardsAndSetSelectedCard,
  );
}

export default cardSaga;
