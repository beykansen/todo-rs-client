export default interface Todo {
  id: string;
  name: string;
  done: boolean;
  added_at: Date;
  tags: Array<string>;
}
