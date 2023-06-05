import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button } from 'react-bootstrap';
import { url } from '../helper';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${url}/register`, { email, password, phone, dob:date, name });
      console.log(response.data);
      if(response.data){
        new Swal({
            title:"Registration sucess",
            icon:"success",
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
      <h2>Register</h2>

      <Form.Group controlId="formEmail">
        <Form.Label>Name</Form.Label>
        <Form.Control type="text" placeholder="Enter name" required value={name} onChange={(e) => setName(e.target.value)} />
      </Form.Group>

      <Form.Group controlId="formEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control type="email" placeholder="Enter email" required value={email} onChange={(e) => setEmail(e.target.value)} />
      </Form.Group>

      <Form.Group controlId="formPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} />
      </Form.Group>

      <Form.Group controlId="formEmail">
        <Form.Label>Phone</Form.Label>
        <Form.Control type="number" placeholder="Enter phone" required value={phone} onChange={(e) => setPhone(e.target.value)} />
      </Form.Group>

      <Form.Group controlId="formEmail">
        <Form.Label>DOB</Form.Label>
        <Form.Control type="date" placeholder="Enter date" required value={date} onChange={(e) => setDate(e.target.value)} />
      </Form.Group>

      <Button variant="primary" type="submit">
        Register
      </Button>
    </Form>
  );
};

export default Register;
