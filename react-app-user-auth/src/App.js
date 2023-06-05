import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import { Container, Nav, Navbar } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import Register from './components/Register';
import Login from './components/Login';
import UsersList from './components/UsersList';

function App() {
  return (
    <Router>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/">User Management</Navbar.Brand>
          <Nav className="ml-auto">
            <Nav.Link as={Link} to="/register">Register</Nav.Link>
            <Nav.Link as={Link} to="/login">Login</Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      <Container className="mt-4">
        <Routes>
          <Route exact path="/register" Component={Register} />
          <Route exact path="/login" Component={Login} />
          <Route exact path="/" Component={UsersList} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
