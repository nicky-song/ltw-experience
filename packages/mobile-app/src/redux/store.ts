import { configureStore, combineReducers } from '@reduxjs/toolkit';
import type { PreloadedState } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import rootSaga from './rootSaga';
import courseReducer from '@learn-to-win/common/features/Courses/courseSlice';
import learningItemReducer from '@learn-to-win/common/features/LearningItems/learningItemSlice';
import authReducer from '@learn-to-win/common/features/Auth/authSlice';
import cardReducer from '@learn-to-win/common/features/Cards/cardSlice';
import enrollmentReducer from '@learn-to-win/common/features/Enrollments/enrollmentSlice';

// Add reducers here
const rootReducer = combineReducers({
  auth: authReducer,
  course: courseReducer,
  learningItem: learningItemReducer,
  card: cardReducer,
  enrollment: enrollmentReducer,
});
export const setupStore = (preloadedState?: PreloadedState<RootState>) => {
  const sagaMiddleware = createSagaMiddleware();
  const middleware = [sagaMiddleware];
  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }).concat(middleware),
    preloadedState,
  });
  sagaMiddleware.run(rootSaga);
  return store;
};

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof rootReducer>;
// Inferred type: {cards: CardsState, user: UserState, learningItem: LearningItemState}
export type AppDispatch = AppStore['dispatch'];
export type AppStore = ReturnType<typeof setupStore>;
