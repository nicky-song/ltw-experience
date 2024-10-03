import { getCards, getCardsAndSetSelectedCard, updateCard } from './cardSaga';
import { expectSaga } from 'redux-saga-test-plan';
import { getCardsAPI, updateCard as updateCardApi } from './cardService';
import { call } from 'redux-saga/effects';
import {
  getCardsAction,
  getCardsAndSetSelectedCardAction,
  setSelectedCardIdAction,
} from './cardSlice';
import { Card } from './cardTypes';
import { CardType } from '../../constants';

describe('cardSaga', () => {
  const getLearningItemPayload = { learningItemId: '1' };
  it('should handle getCardsSuccess', () => {
    const response = {
      name: 'testName',
      description: 'testdesc',
      numberOfSlides: 1,
    };

    return expectSaga(getCards, {
      payload: getLearningItemPayload,
      type: 'card/getCards',
    })
      .provide([[call(getCardsAPI, getLearningItemPayload), response]])
      .put({
        type: 'card/getCardsSuccess',
        payload: response,
      })
      .run();
  });

  it('should handle getCardsFailure', () => {
    return expectSaga(getCards, {
      type: 'card/getCards',
      payload: getLearningItemPayload,
    })
      .provide([
        [call(getCardsAPI, getLearningItemPayload), Promise.reject('error')],
      ])
      .put({ type: 'card/getCardsFailure', payload: 'error' })
      .run();
  });

  it('should handle updateCard', () => {
    const payload: Card = {
      id: '1',
      learningItem: '1',
      title: 'test',
      type: CardType.QUIZ_CARD,
      sequenceOrder: 1,
      learningItemId: '1',
      confidenceCheck: true,
      json: {
        description: 'test',
        contentBlocks: [],
        version: '1',
        templateType: null,
      },
    };

    return expectSaga(updateCard, {
      type: 'card/updateCard',
      payload,
    })
      .provide([[call(updateCardApi, payload), null]])
      .put({
        type: 'card/updateCardSuccess',
        payload,
      })
      .run();
  });

  it('should handle getCardsAndSetSelectedCard', () => {
    const payload = {
      learningItemId: '1',
      selectedCardId: '1',
    };
    return expectSaga(
      getCardsAndSetSelectedCard,
      getCardsAndSetSelectedCardAction(payload),
    )
      .put(
        getCardsAction({
          learningItemId: payload.learningItemId,
          resetSelectedCard: false,
        }),
      )
      .dispatch({
        type: 'card/getCardsSuccess',
        payload: {},
      })
      .put(setSelectedCardIdAction(payload.selectedCardId))
      .run();
  });
});
