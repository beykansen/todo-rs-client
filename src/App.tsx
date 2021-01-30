import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink,
} from 'react-router-dom';
import Home from './pages/home';

export default function App() {
  return (
    <Router>
      <Container fluid={true}>
        <Navbar bg="light" expand="lg">
          <Navbar.Brand as={NavLink} to="/">
            Home
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              {/* <Nav.Link as={NavLink} to="/">
                Home
              </Nav.Link> */}
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </Container>
      <Switch>
        <Container fluid={true} className="mt-3">
          <Route exact path="/">
            <Home />
          </Route>
        </Container>
      </Switch>
    </Router>
  );
}
