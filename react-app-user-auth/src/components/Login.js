import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button } from 'react-bootstrap';
import { url } from '../helper';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${url}/login`, { email, password });
      console.log(response.data);
      if(response.data){
        new Swal({
            title:"Login sucess",
            icon:"success",
            timer:"2000",
            status:"success"
        })
        navigate('/');
      }
    } catch (error) {
        new Swal({
            title:error.response.data.error,
            icon:"error",
            timer:"2000",
            status:"error"
        })
      console.error(error);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <Form.Group controlId="formEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </Form.Group>

      <Form.Group controlId="formPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </Form.Group>

      <Button variant="primary" type="submit">
        Login
      </Button>
    </Form>
  );
};

export default Login;
