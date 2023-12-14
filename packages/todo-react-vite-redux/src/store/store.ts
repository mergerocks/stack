import { configureStore } from '@reduxjs/toolkit';
import todosReducer from './slices/todos.slice';

export const store = configureStore({
  reducer: {
    todos: todosReducer,
  },
});
