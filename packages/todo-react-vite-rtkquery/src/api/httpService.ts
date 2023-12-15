import { Todo, TodoCreate } from './types';

class HttpService {
  protected BASE_URL = 'https://jsonplaceholder.typicode.com';
  protected endpoints = {
    todos: `${this.BASE_URL}/todos`,
    users: `${this.BASE_URL}/users`,
  };

  protected request =
    (method: 'GET' | 'POST' | 'PATCH' | 'DELETE') =>
    async <ResponseData = void, RequestData = undefined>(
      endpoint: string,
      body?: RequestData,
    ) => {
      try {
        const res = await fetch(endpoint, {
          method,
          body: JSON.stringify(body),
        });
        const data = (await res.json()) as ResponseData;
        return { data };
      } catch (error) {
        return { error };
      }
    };

  protected get = this.request('GET');

  protected post = this.request('POST');

  protected patch = this.request('PATCH');

  protected delete = this.request('DELETE');

  async getTodos() {
    return this.get<Todo[]>(this.endpoints.todos);
  }

  async createTodo(title: string) {
    return this.post<Todo, TodoCreate>(this.endpoints.todos, {
      title,
    });
  }

  async updateTodo(todo: Todo) {
    return this.patch<Todo, Todo>(`${this.endpoints.todos}/${todo.id}`, todo);
  }

  async deleteTodo(id: string) {
    return this.delete(`${this.endpoints.todos}/${id}`);
  }

  async getUsers() {
    return this.get<Todo[]>(this.endpoints.users);
  }

  async throwError() {
    return {
      error: 'Custom error message',
      status: 'FETCH_ERROR',
      data: undefined,
    };
  }
}

export const httpService = new HttpService();
