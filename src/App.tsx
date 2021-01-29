import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink,
} from 'react-router-dom';
import Create from './pages/create';
import About from './pages/about';
import Home from './pages/home';

export default function App() {
  return (
    <Router>
      <Container fluid={true}>
        <Navbar bg="light" expand="lg">
          <Navbar.Brand as={NavLink} to="/">
            ToDo-RS Web Client
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link as={NavLink} to="/create">
                Add ToDo
              </Nav.Link>
              <Nav.Link as={NavLink} to="/about">
                About
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </Container>
      <Switch>
        <Container fluid={true}>
          <Route path="/about">
            <About />
          </Route>
          <Route path="/create">
            <Create />
          </Route>
          <Route exact path="/">
            <Home />
          </Route>
        </Container>
      </Switch>
    </Router>
  );
}
