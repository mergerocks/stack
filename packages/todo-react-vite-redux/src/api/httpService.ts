class HttpService {
  protected BASE_URL = 'https://jsonplaceholder.typicode.com';
  protected endpoints = {
    todos: `${this.BASE_URL}/todos`,
  };

  async getTodos() {
    const res = await fetch(this.endpoints.todos);
    const data = await res.json();
    return data;
  }

  async throwError() {
    throw new Error('Failed to fetch data');
  }
}

export const httpService = new HttpService();
