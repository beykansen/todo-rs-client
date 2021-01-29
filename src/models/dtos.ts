export type CreateTodoRequest = {
  name: string;
  tags: Array<string>;
};

export type CreateTodoResponse = {
  success: Boolean;
  id: string;
};
