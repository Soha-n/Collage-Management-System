import './App.css';
import React, { useState } from 'react';
import Login from './components/login';
import { Routes, Route } from 'react-router-dom';
import Student from './pages/student';
import Teacher from './pages/teacher';
import Admin from './pages/admin';
import Navbar from './components/navbar';

function App() {
  const [role, setRole] = useState('');

  return (
    <div>
      <Navbar role={role} />
      <Routes>
        <Route path="/" element={<Login setRole={setRole} />} />
        <Route path="/student" element={role === 'student' ? <Student /> : <Login setRole={setRole} />} />
        <Route path="/teacher" element={role === 'teacher' ? <Teacher /> : <Login setRole={setRole} />} />
        <Route path="/admin" element={role === 'admin' ? <Admin /> : <Login setRole={setRole} />} />
      </Routes>
    </div>
  );
}

export default App;