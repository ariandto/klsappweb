import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const RegisterForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Periksa apakah password dan konfirmasi password sama
    if (password !== confirmPassword) {
      alert('Password dan Konfirmasi Password tidak sesuai');
      return;
    }

    try {
      // Kirim data registrasi ke server
      const response = await fetch('http://localhost:8081/register', { // Ganti URL dengan endpoint yang sesuai
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (!response.ok) {
        throw new Error('Registration request failed.');
      }

      const data = await response.json();

      // Tampilkan pesan sukses atau error
      if (data.message) {
        alert(data.message);
      } else {
        alert('Registration successful.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred during registration.');
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="col-md-6">
        <div className="card">
          <div className="card-body">
            <h2 className="card-title text-center">Register</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="username">Username:</label>
                <input
                  type="text"
                  className="form-control"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
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
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password:</label>
                <input
                  type="password"
                  className="form-control"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary btn-block">Register</button>
            </form>
            <div className="text-center mt-3">
              <Link to="/">Login</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
