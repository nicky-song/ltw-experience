import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Card, GetCardsParams, CardsState } from './cardTypes';
import { getIdFromUrl } from '../../utils/entityId';

const initialState = {
  cards: [],
  selectedCardId: null,
  loading: false,
  error: null,
} as CardsState;

export const cardSlice = createSlice({
  name: 'card',
  initialState,
  reducers: {
    getCards(state) {
      state.loading = true;
    },
    getCardsSuccess(state, action: PayloadAction<Card[]>) {
      state.cards = action.payload;
      for (const card of state.cards) {
        card.learningItemId = getIdFromUrl(card.learningItem);
      }
      state.loading = false;
    },
    getCardsFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },
    setSelectedCardId(state, action: PayloadAction<string>) {
      state.selectedCardId = action.payload;
    },
    updateCard(state , action: PayloadAction<Card>) {
      state.loading = true;
      const cardIndex = state.cards.findIndex(
        (card) => card.id === action.payload.id,
      );
     state.cards[cardIndex] = action.payload;
    },
    updateCardSuccess(state, action: PayloadAction<Card>) {
      const cardIndex = state.cards.findIndex(
        (card) => card.id === action.payload.id,
      );
      state.cards[cardIndex] = action.payload;
      state.loading = false;
    },
    updateCardFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },
    resetState() {
      return initialState;
    },
  },
});

export const getCardsAndSetSelectedCardAction = createAction<
  Omit<GetCardsParams, 'resetSelectedCard'> & { selectedCardId: string }
>('card/getCardsAndSetActiveCard');

export const getCardsAction = (payload: GetCardsParams) => ({
  type: 'card/getCards',
  payload,
});

export const selectCards = (state: { card: CardsState }) => state.card.cards;

export const setSelectedCardIdAction = (payload: string) => ({
  type: 'card/setSelectedCardId',
  payload,
});

export const updateCardAction = (payload: Card) => ({
  type: 'card/updateCard',
  payload,
});

export const {
  getCardsSuccess,
  getCardsFailure,
  resetState,
  getCards,
  setSelectedCardId,
  updateCard,
  updateCardFailure,
  updateCardSuccess,
} = cardSlice.actions;
export default cardSlice.reducer;
