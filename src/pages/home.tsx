import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { Table, Button, Row, Col, Form, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { isNullOrUndefined } from '../utils/objectUtils';
import TodoApi from '../services/todoApi';
import Todo from '../models/todo';
import AddForm from '../components/addForm';

const Home = () => {
  const [tableLoading, setTableLoading] = useState<boolean>(false);
  const [doneLoading, setDoneLoading] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [rows, setRows] = useState<Array<Todo>>([]);
  const [resultMessageShow, setResultMessageShow] = useState<boolean>(true);
  const [resultMessage, setResultMessage] = useState<
    | {
        message: React.ReactElement;
        variant: string;
      }
    | undefined
  >();

  const todoApi = new TodoApi();

  const getTodos = async (cancelTokenSource?: any, done?: boolean) => {
    setTableLoading(true);
    try {
      if (!isNullOrUndefined(cancelTokenSource))
        todoApi.UseToken(cancelTokenSource.token);
      const getTodosResponse = await todoApi.GetTodosAsync(done);
      if (!isNullOrUndefined(getTodosResponse)) {
        let todos: Array<Todo> = [];
        for (let i = 0; i < getTodosResponse!.todos.length; i++) {
          const todo = getTodosResponse!.todos[i];
          todos.push({
            added_at: todo.added_at,
            done: todo.done,
            id: todo.id,
            name: todo.name,
            tags: todo.tags,
          });
        }
        setRows(todos);
      }
    } catch (err) {
      if (!isNullOrUndefined(err.response)) {
        console.log(err.message + ' ' + err.response.data.Error);
      } else {
        console.log(err);
      }
    }
    setTableLoading(false);
  };

  useEffect(() => {
    const source = TodoApi.CreateCancelToken();
    getTodos(source);
    return () => {
      source.cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onAdd = async (id: string) => {
    try {
      const getTodoResponse = await todoApi.GetTodoAsync(id);
      if (!isNullOrUndefined(getTodoResponse)) {
        const todo: Todo = {
          added_at: getTodoResponse!.added_at,
          done: getTodoResponse!.done,
          id: getTodoResponse!.id,
          name: getTodoResponse!.name,
          tags: getTodoResponse!.tags,
        };
        setRows((oldRows) => [todo, ...oldRows]);
        setResultMessageWrapper({
          message: <>{todo.name} successfully added</>,
          variant: 'success',
        });
      }
    } catch (err) {
      setResultMessageWrapper({
        message: <>An error occurred while adding</>,
        variant: 'danger',
      });
      if (!isNullOrUndefined(err.response)) {
        console.log(err.message + ' ' + err.response.data.Error);
      } else {
        console.log(err);
      }
    }
  };

  const findIndexViaTodoId = (id: string) => {
    let todo = rows.filter((value, index) => value.id === id);
    if (isNullOrUndefined(todo)) {
      return -1;
    }
    return rows.indexOf(todo[0]);
  };

  const onDelete = async (id: string) => {
    setDeleteLoading(true);
    try {
      let result = await todoApi.DeleteTodoAsync(id);
      if (!result?.success) return;
      var todos = [...rows];
      let index = findIndexViaTodoId(id);
      if (index === -1) return;
      todos.splice(index, 1);
      setRows(todos);

      setResultMessageWrapper({
        message: <>{id} successfully deleted</>,
        variant: 'success',
      });
    } catch (err) {
      setResultMessageWrapper({
        message: <>An error occurred while deleting {id}</>,
        variant: 'danger',
      });
      if (!isNullOrUndefined(err.response)) {
        console.log(err.message + ' ' + err.response.data.Error);
      } else {
        console.log(err);
      }
    }
    setDeleteLoading(false);
  };

  const onToggleDone = async (id: string, previousDoneState: boolean) => {
    setDoneLoading(true);
    try {
      let result = await todoApi.ToggleDoneAsync(id);
      if (!result?.success) return;
      var todos = [...rows];
      let index = findIndexViaTodoId(id);
      if (index === -1) return;
      todos[index].done = !previousDoneState;
      setRows(todos);

      setResultMessageWrapper({
        message: (
          <>
            {id} status successfully changed to{' '}
            {previousDoneState ? 'Undone' : 'Done'}
          </>
        ),
        variant: 'success',
      });
    } catch (err) {
      setResultMessageWrapper({
        message: <>An error occurred while changing {id} done status</>,
        variant: 'danger',
      });
      if (!isNullOrUndefined(err.response)) {
        console.log(err.message + ' ' + err.response.data.Error);
      } else {
        console.log(err);
      }
    }
    setDoneLoading(false);
  };

  const onFilterChange = async (filter: string) => {
    let done: boolean | undefined = undefined;
    switch (filter) {
      case 'done':
        done = true;
        break;
      case 'undone':
        done = false;
        break;
      default:
    }
    await getTodos(null, done);
  };

  const setResultMessageWrapper = (
    payload:
      | {
          message: React.ReactElement;
          variant: string;
        }
      | undefined
  ) => {
    setResultMessageShow(true);
    setResultMessage(payload);
    setTimeout(() => {
      setResultMessageShow(false);
    }, 2000);
  };

  return (
    <>
      <Row className="justify-content-md-center">
        <Alert variant="info">
          This site is for testing purposes of{' '}
          <a href="https://github.com/beykansen/todo-rs">todo rust api</a>,
          hence all ToDo items have very small amount TTL. Table shows only last
          100 ToDo items.
        </Alert>
      </Row>

      <Row className="justify-content-md-end mt-3">
        <Col xs="12" md="10" className="mb-3">
          <AddForm callback={onAdd} />
        </Col>
        <Col xs="12" lg="2">
          <Form.Group controlId="doneFilter">
            <Form.Control
              as="select"
              onChange={(e) => {
                onFilterChange(e.target.value);
              }}
            >
              <option value="all">All</option>
              <option value="done">Only Done</option>
              <option value="undone">Only Undone</option>
            </Form.Control>
          </Form.Group>
        </Col>
      </Row>
      {!isNullOrUndefined(resultMessage) ? (
        <Alert variant={resultMessage?.variant} show={resultMessageShow}>
          {resultMessage?.message}
        </Alert>
      ) : null}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>#ID</th>
            <th>Name</th>
            <th>Tags</th>
            <th>Done</th>
            <th>Added</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {!tableLoading
            ? rows.map((row) => (
                <tr key={row.id}>
                  <td>{row.id}</td>
                  <td>{row.name}</td>
                  <td>{row.tags.join(',')}</td>
                  <td style={{ textAlign: 'center' }}>
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      style={
                        row.done
                          ? {
                              color: 'green',
                              cursor: 'pointer',
                              fontSize: '1.5em',
                            }
                          : {
                              color: 'gray',
                              cursor: 'pointer',
                              fontSize: '1.5em',
                            }
                      }
                      onClick={() => {
                        onToggleDone(row.id, row.done);
                      }}
                    />
                  </td>
                  <td>
                    {moment(row.added_at).format('MMMM Do YYYY, h:mm:ss a')}{' '}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <Button
                      variant="danger"
                      size="sm"
                      disabled={deleteLoading}
                      onClick={() => {
                        if (
                          window.confirm('Are you sure to delete this todo?')
                        ) {
                          onDelete(row.id);
                        }
                      }}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            : 'loading...'}
        </tbody>
      </Table>
    </>
  );
};
export default Home;
