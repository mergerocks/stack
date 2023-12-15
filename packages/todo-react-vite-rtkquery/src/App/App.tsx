import { ChangeEvent } from 'react';
import { useAppSelector } from '../store';
import {
  selectTodos,
  useCreateTodoMutation,
  useDeleteTodoMutation,
  useGetTodosQuery,
  useUpdateTodoMutation,
} from '../store/slices/todos.api';

function App() {
  const todos = useAppSelector(selectTodos);
  const { status, refetch } = useGetTodosQuery();
  const [createTodo] = useCreateTodoMutation();
  const [updateTodo] = useUpdateTodoMutation();
  const [deleteTodo] = useDeleteTodoMutation();

  const onFormSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target;
    const title = new FormData(form).get('title') as string;
    createTodo(title);
    form.reset();
  };

  return (
    <>
      <header>
        <h1>Todo: React + Vite + RTK Query</h1>
        <div>
          <button
            onClick={() => {
              refetch();
            }}
          >
            refetch todos
          </button>{' '}
        </div>
        <pre>
          <p>Status: {status}</p>
        </pre>
        <br />
        <form onSubmit={onFormSubmit}>
          <input name="title" type="text" />
          <button>Add new task</button>
        </form>
        <ul>
          {todos.map((todo) => {
            return (
              <li key={todo.id}>
                <input
                  onChange={(e) => {
                    updateTodo({ id: todo.id, completed: e.target.checked });
                  }}
                  type="checkbox"
                  checked={todo.completed}
                />
                <span>{todo.title}</span>
                <button onClick={() => deleteTodo(todo.id)}>Delete</button>
              </li>
            );
          })}
        </ul>
      </header>
      <main></main>
    </>
  );
}

export default App;
