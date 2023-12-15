import { configureStore } from '@reduxjs/toolkit';
import { todosApi } from './slices/todos.api';

export const store = configureStore({
  reducer: {
    [todosApi.reducerPath]: todosApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(todosApi.middleware),
});

store.dispatch(todosApi.endpoints.getTodos.initiate());