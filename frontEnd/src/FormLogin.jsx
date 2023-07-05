import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { apiUrl } from './config';

import './styletailw.css';

const FormLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
<<<<<<< HEAD
      const response = await axios.post(`${apiUrl}/login`, {
=======
      const response = await axios.post('http://localhost:8081/login', {
>>>>>>> 822c350951c8a4c042780fb0d01f7ee9a8e45fad
        username,
        password,
      });

      if (response.status === 200) {
        window.location.href = '/home';
      } else {
        alert(response.data.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred during login.');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

<<<<<<< HEAD
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/user`);

        if (response.status === 200) {
          setUsername(response.data.username);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchData();
  }, []);

=======
>>>>>>> 822c350951c8a4c042780fb0d01f7ee9a8e45fad
  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="col-md-6">
        <div className="card">
          <div className="card-body">
            <h2 className="card-title text-center">Login</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="username">Username:</label>
                <input
                  type="text"
                  className="form-control"
                  id="username"
<<<<<<< HEAD
                  value={username} // Using the username value obtained from the server
=======
                  value={username}
>>>>>>> 822c350951c8a4c042780fb0d01f7ee9a8e45fad
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyDown={handleKeyDown}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password:</label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary btn-block">Login</button>
            </form>
            <div className="text-center mt-3">
              <Link to="/register">Sign Up</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormLogin;
