import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const FormLogin = () => {
  const [userid, setUserID] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Kirim permintaan login ke backend
      const response = await axios.post('http://localhost:8081/login', {
        userid,
        username,
        password,
      });

      console.log(response.data); // Output response dari backend

      // Periksa apakah login berhasil atau tidak
      if (response.status === 200) {
        // Jika login berhasil, arahkan ke halaman home
        window.location.href = '/home';
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred during login.');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  const getUserByUsername = async () => {
    try {
      // Kirim permintaan untuk mendapatkan data pengguna berdasarkan User ID ke backend
      const response = await axios.get(`http://localhost:8081/user/${userid}`);

      if (response.status === 200) {
        // Jika berhasil mendapatkan data pengguna, tetapkan username ke dalam state
        setUsername(response.data.username);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="col-md-6">
        <div className="card">
          <div className="card-body">
            <h2 className="card-title text-center">Login</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="userid">User ID:</label>
                <input
                  type="text"
                  className="form-control"
                  id="userid"
                  value={userid}
                  onChange={(e) => setUserID(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="username">Username:</label>
                <input
                  type="text"
                  className="form-control"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyPress={handleKeyPress}
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
