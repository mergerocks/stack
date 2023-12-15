export interface Todo {
  id: string;
  title?: string;
  completed?: boolean;
  useId?: string;
}

export interface TodoCreate {
  title: string;
}

export interface User {
  id: string;
  name?: string;
  email?: string;
}