import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/state/auth/authSlice';
import { themeSlice } from '../shared/state/themeSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeSlice.reducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
