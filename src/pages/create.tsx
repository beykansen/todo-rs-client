import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import TodoApi from '../services/todoApi';
import { CreateTodoRequest } from '../models/dtos';

const Create = () => {
  const todoApi = new TodoApi('https://todo-api.beykansen.com');
  const onFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const request: CreateTodoRequest = {
      name: todoName,
      tags: todoTags.split(','),
    };
    let id: string | undefined;
    try {
      let result = await todoApi.CreateTodoAsync(request);
      id = result?.id;
    } catch (exception) {
      console.log(exception);
    }
    setCreateResult({
      message: id === undefined ? 'an error occurred' : `todo created: ${id}`,
      variant: id === undefined ? 'danger' : 'success',
    });
  };
  const [todoName, setTodoName] = useState('');
  const [todoTags, setTodoTags] = useState('');
  const [createResult, setCreateResult] = useState<{
    message: string;
    variant: string;
  }>();

  return (
    <>
      <Form onSubmit={onFormSubmit}>
        <Form.Group controlId="todoName">
          <Form.Label>Todo Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter ToDo Name"
            value={todoName}
            onChange={(e) => {
              setTodoName(e.target.value);
            }}
          />
        </Form.Group>
        <Form.Group controlId="todoTags">
          <Form.Label>Todo Tags</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter ToDo Tags Comma Seperated"
            value={todoTags}
            onChange={(e) => {
              setTodoTags(e.target.value);
            }}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Save
        </Button>
      </Form>
      <br />
      <br />
      {createResult !== undefined || createResult !== null ? (
        <Alert variant={createResult?.variant}>{createResult?.message}</Alert>
      ) : null}
    </>
  );
};

export default Create;
