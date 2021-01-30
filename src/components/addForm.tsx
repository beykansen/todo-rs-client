import React, { useState } from 'react';
import { Form, Button, Col } from 'react-bootstrap';
import TodoApi from '../services/todoApi';
import { CreateTodoRequest } from '../models/dtos';
import { isNullOrUndefined } from '../utils/objectUtils';

type AddFormProps = {
  callback: (id: string) => void;
};

const AddForm: React.FC<AddFormProps> = (props: AddFormProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [todoName, setTodoName] = useState('');
  const [todoTags, setTodoTags] = useState('');

  const reset = () => {
    setTodoName('');
    setTodoTags('');
  };

  const onFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    if (todoName === '') {
      setLoading(false);
      return;
    }

    const request: CreateTodoRequest = {
      name: todoName,
      tags: todoTags.split(','),
    };
    const todoApi = new TodoApi();

    let id: string | undefined;
    try {
      let result = await todoApi.CreateTodoAsync(request);
      id = result?.id;
    } catch (err) {
      if (!isNullOrUndefined(err.response)) {
        console.log(err.message + ' ' + err.response.data.Error);
      } else {
        console.log(err);
      }
    }
    if (!isNullOrUndefined(id)) {
      props.callback(id!);
    }

    setLoading(false);
    reset();
  };

  return (
    <>
      <Form onSubmit={onFormSubmit}>
        <Form.Row>
          <Col xs="auto">
            <Form.Control
              type="text"
              placeholder="Name"
              value={todoName}
              onChange={(e) => {
                setTodoName(e.target.value);
              }}
              required
            />
          </Col>
          <Col xs="auto">
            <Form.Control
              type="text"
              placeholder="Tags Comma Seperated"
              value={todoTags}
              onChange={(e) => {
                setTodoTags(e.target.value);
              }}
            />
          </Col>
          <Col xs="auto">
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? 'Loading...' : 'Add'}
            </Button>
          </Col>
        </Form.Row>
      </Form>
    </>
  );
};

export default AddForm;
