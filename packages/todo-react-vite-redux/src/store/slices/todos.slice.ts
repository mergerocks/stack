import { createSlice, nanoid, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { TodoCreate, httpService } from '../../api';
import { StatusType } from '../types';

export interface Todo {
  id: string;
  title?: string;
  completed?: boolean;
  useId?: string;
}

export interface TodoCreateInterface {
  title: string;
}

export interface TodoUpdateInterface {
  id: string;
  title?: string;
  completed?: boolean;
}

export interface TodoToggleInterface {
  id: string;
  completed: boolean;
}

export interface TodosState {
  todos: Todo[];
  status: StatusType;
  error?: string | null;
}

const initialState: TodosState = {
  todos: [],
  status: 'idle',
};

export const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    createTodo: {
      reducer(state, action: PayloadAction<Todo>) {
        state.todos.unshift(action.payload);
      },
      prepare(payload: TodoCreateInterface) {
        return {
          payload: {
            id: nanoid(),
            title: payload.title,
            done: false,
          },
        };
      },
    },
    deleteTodo(state, action: PayloadAction<string>) {
      const idx = state.todos.findIndex((todo) => todo.id === action.payload);
      if (idx !== -1) {
        state.todos.splice(idx, 1);
      }
    },
    updateTodo(state, action: PayloadAction<TodoUpdateInterface>) {
      const idx = state.todos.findIndex(
        (todo) => todo.id === action.payload.id,
      );
      if (idx !== -1) {
        state.todos.splice(idx, 1, {
          ...state.todos[idx],
          ...action.payload,
        });
      }
    },
  },
  selectors: {
    selectTodos: (state) => state.todos,
    selectTodoById: (state, id: string) =>
      state.todos.find((todo) => todo.id === id),
    selectTodosStatus: (state) => state.status,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.todos = action.payload;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(createTodo.pending, (state, payload) => {
        state.status = 'loading';
        state.error = null;
        state.todos.unshift({
          id: nanoid(),
          title: (payload.meta.arg as unknown as Todo)?.title,
          completed: false,
        });
      })
      .addCase(updateTodo.pending, (state, payload) => {
        state.status = 'loading';
        state.error = null;
        const todo = payload.meta.arg as unknown as Todo;
        const idx = state.todos.findIndex((t) => t.id === todo.id);
        if (idx !== -1) {
          state.todos[idx] = {
            ...state.todos[idx],
            ...todo,
          };
        }
      })
      .addCase(deleteTodo.pending, (state, payload) => {
        state.status = 'loading';
        state.error = null;
        const id = payload.meta.arg as unknown as string;
        const idx = state.todos.findIndex((t) => t.id === id);
        if (idx !== -1) {
          state.todos.splice(idx, 1);
        }
      });
  },
});

export const fetchTodos = createAsyncThunk('todos/fetchTodos', async () => {
  return httpService.getTodos();
});

export const createTodo = createAsyncThunk(
  'todos/createTodo',
  async (payload: TodoCreate) => {
    return httpService.createTodo(payload);
  },
);

export const updateTodo = createAsyncThunk(
  'todos/updateTodo',
  async (todo: Todo) => {
    return httpService.updateTodo(todo);
  },
);

export const deleteTodo = createAsyncThunk(
  'todos/deleteTodo',
  async (id: string) => {
    return httpService.deleteTodo(id);
  },
);

// Action creators are generated for each case reducer function
export const { selectTodos, selectTodoById, selectTodosStatus } =
  todosSlice.selectors;

export default todosSlice.reducer;
