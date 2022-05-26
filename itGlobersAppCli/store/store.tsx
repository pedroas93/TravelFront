import {combineReducers, configureStore} from '@reduxjs/toolkit';
import userSlice from '../slices/userSlice';

const rootReducer = combineReducers({
  userDataPersist: userSlice,
});

export type RootState = ReturnType<typeof rootReducer>;

const store = configureStore({
  reducer: rootReducer,
});

export default store;