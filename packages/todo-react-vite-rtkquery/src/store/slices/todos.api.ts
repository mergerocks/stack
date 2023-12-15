import { createSelector, nanoid } from '@reduxjs/toolkit';
import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { Todo, httpService } from '../../api';

export interface TodoCreate {
  title: string;
}

export interface TodoUpdate {
  id: string;
  title?: string;
  completed?: boolean;
}

export interface TodoToggle {
  id: string;
  completed: boolean;
}

export const todosApi = createApi({
  // The cache reducer expects to be added at `state.api` (already default - this is optional)
  reducerPath: 'todosApi',
  // All of our requests will have URLs starting with '/fakeApi'
  baseQuery: fakeBaseQuery(),
  // The "endpoints" represent operations and requests for this server
  endpoints: (builder) => ({
    getTodos: builder.query<Todo[], void>({
      queryFn: () => {
        return httpService.getTodos();
      },
    }),
    createTodo: builder.mutation<Todo, string>({
      queryFn: (title) => httpService.createTodo(title),

      // Optimistic update
      async onQueryStarted(title, { dispatch, queryFulfilled }) {
        dispatch(
          todosApi.util.updateQueryData('getTodos', undefined, (draft) => {
            draft.unshift({
              id: nanoid(),
              title,
              completed: false,
            });
          }),
        );
        await queryFulfilled;
      },
    }),
    updateTodo: builder.mutation<Todo, Todo>({
      queryFn: (todo) => httpService.updateTodo(todo),

      // Optimistic update
      async onQueryStarted(todo, { dispatch, queryFulfilled }) {
        dispatch(
          todosApi.util.updateQueryData('getTodos', undefined, (draft) => {
            const todoIndex = draft.findIndex((t) => t.id === todo.id);
            if (todoIndex !== -1) {
              draft[todoIndex] = {
                ...draft[todoIndex],
                ...todo,
              };
            }
          }),
        );
        await queryFulfilled;
      },
    }),
    deleteTodo: builder.mutation<void, string>({
      queryFn: (id) => httpService.deleteTodo(id),

      // Optimistic update
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        dispatch(
          todosApi.util.updateQueryData('getTodos', undefined, (draft) => {
            const todoIndex = draft.findIndex((t) => t.id === id);
            if (todoIndex !== -1) {
              draft.splice(todoIndex, 1);
            }
          }),
        );
        await queryFulfilled;
      },
    }),
  }),
});

const selectors = {
  selectTodos: createSelector(
    todosApi.endpoints.getTodos.select(),
    (state) => state?.data ?? [],
  ),
};

export const {
  useGetTodosQuery,
  useCreateTodoMutation,
  useDeleteTodoMutation,
  useUpdateTodoMutation,
} = todosApi;
export const { selectTodos } = selectors;
