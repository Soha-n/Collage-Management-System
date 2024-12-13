import React, { useState } from 'react';
import Student from '../pages/student';
import Teacher from '../pages/teacher';
import Admin from '../pages/admin';
import './login.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setLocalRole] = useState('');
  const [login,setlogin]=useState(false);
  const[department,setDepartment]=useState('');
  const [data, setData] = useState('');
  const [course,setcourse]=useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    if (role) {
      try {
        const resp = await fetch('http://localhost:5000/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password, role }),
        });
        if (resp.ok) {
        const data = await resp.json();
        setData(data.user[0].id);
         if(data.students && data.students.length>0){
          setDepartment(data.students[0].department);
         }
          console.log(data.user);
          console.log(data.students);
         setlogin(true);
        } else {
          alert('invalid credentials login failed');
          console.log("Login Failed");
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <div className="login-container">
    {login ? (
      <>
        {role === 'student' && <Student name={username} department={department} id={data}/>}
        {role === 'teacher' && <Teacher id={data} />}
        {role === 'admin' && <Admin />}
      </>
    ) : (
      <div className="login-box">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <select onChange={(e) => setLocalRole(e.target.value)}>
            <option value="">Select Role</option>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="admin">Admin</option>
          </select>
          <button type="submit">Login</button>
        </form>
      </div>
    )}
  </div>
  );
}


export default Login;