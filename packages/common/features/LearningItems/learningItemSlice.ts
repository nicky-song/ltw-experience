import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  LearningItem,
  LearningItemState,
  GetLearningItemParams,
  GetOneLearningItemParams,
} from './learningItemTypes';

const initialState = {
  learningItemList: [],
  learningItemDetails: null,
  loading: true,
  error: null,
} as LearningItemState;

export const learningItemsSlice = createSlice({
  name: 'learningItems',
  initialState,
  reducers: {
    addLearningItem(state, action: PayloadAction<LearningItem>) {
      state.learningItemList.push(action.payload);
    },
    getLearningItems(state) {
      state.loading = true;
    },
    getLearningItemsSuccess(state, action: PayloadAction<LearningItem[]>) {
      state.learningItemList = action.payload;
      state.loading = false;
    },
    getLearningItemsFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },
    getLearningItemDetails(state) {
      state.loading = true;
    },
    getLearningItemDetailsSuccess(state, action) {
      state.learningItemDetails = action.payload.data;
      state.loading = false;
    },
    getLearningItemDetailsFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },
    resetState() {
      return initialState;
    },
  },
});

export const getLearningItemsAction = (payload: GetLearningItemParams) => ({
  type: 'learningItems/getLearningItems',
  payload,
});

export const getLearningItemDetailsAction = (payload: GetOneLearningItemParams) => ({
  type: 'learningItems/getLearningItemDetails',
  payload
})

export const selectLearningItems = (state: {
  learningItem: LearningItemState;
}) => state.learningItem.learningItemList;

export default learningItemsSlice.reducer;
export const {
  addLearningItem,
  getLearningItemsSuccess,
  getLearningItemsFailure,
  getLearningItemDetails,
  getLearningItemDetailsSuccess,
  getLearningItemDetailsFailure,
  resetState,
  getLearningItems,
} = learningItemsSlice.actions;
