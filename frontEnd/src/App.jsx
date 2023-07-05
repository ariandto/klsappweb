import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './Home';
import OrderKeyParsing from './OrderKeyParsing';
import FormLogin from './FormLogin';
import RegisterForm from './RegisterForm';
import MappingArea from './MappingArea';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FormLogin />} />
        <Route path="/home" element={<Home />} />
        <Route path="/order-key-parsing" element={<OrderKeyParsing />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/mapping-area" element={<MappingArea />} />
      </Routes>
    </Router>
  );
}

export default App;
