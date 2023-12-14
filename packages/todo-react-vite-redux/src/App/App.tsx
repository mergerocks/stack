import { ChangeEvent, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import {
  createTodo,
  deleteTodo,
  fetchTodos,
  selectError,
  selectTodos,
  selectTodosStatus,
  updateTodo,
} from '../store/slices/todos.slice';

function App() {
  const todos = useAppSelector(selectTodos);
  const todosStatus = useAppSelector(selectTodosStatus);
  const todosError = useAppSelector(selectError);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (todosStatus === 'idle') {
      dispatch(fetchTodos());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [todosStatus]);

  const onFormSubmit = (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target;
    const title = new FormData(form).get('title') as string;
    dispatch(
      createTodo({
        title,
      }),
    );
    form.reset();
  };

  return (
    <>
      <header>
        <h1>Todo: React + Vite + Redux</h1>
        <div>
          <button onClick={() => dispatch(fetchTodos())}>refetch todos</button>{' '}
          <button onClick={() => dispatch(fetchTodos({ withError: true }))}>
            throw error
          </button>
        </div>
        <pre>
          <p>Status: {todosStatus}</p>
          {todosError ? <p>Error: {todosError}</p> : null}
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
                    dispatch(
                      updateTodo({ id: todo.id, completed: e.target.checked }),
                    );
                  }}
                  type="checkbox"
                  checked={todo.completed}
                />
                <span>{todo.title}</span>
                <button onClick={() => dispatch(deleteTodo(todo.id))}>
                  Delete
                </button>
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
