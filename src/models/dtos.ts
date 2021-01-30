export type CreateTodoRequest = {
  name: string;
  tags: Array<string>;
};

export type CreateTodoResponse = GeneralCUDResponse & {
  id: string;
};

export type GeneralCUDResponse = {
  success: Boolean;
};

export type GetTodoResponse = {
  id: string;
  name: string;
  done: true;
  added_at: Date;
  tags: Array<string>;
};

export type GetTodosResponse = {
  todos: Array<GetTodoResponse>;
};
