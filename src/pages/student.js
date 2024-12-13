import React, { useEffect, useState } from 'react';
import {FaBell} from 'react-icons/fa';
import './css/student.css';

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Button from 'react-bootstrap/Button';


export default function Student({id,department,name}) {
const[notice,setNotice]=useState([]);
const [feedback, setFeedback] = useState('');
const [exam, setExam] = useState([]);
const [showNotices, setShowNotices] = useState(false);
const [studentdata,setStudentdata]=useState({});
useEffect(()=>{
  const fetchnotice=async()=>{
    try{
      const response= await fetch('http://localhost:5000/showstudentnotice');
        if(response.ok){
          const data= await response.json();
          setNotice(data);}
    }
    catch(err){
      console.log(err);
  }
}
const fetchdata=async()=>{
  try{
    const response= await fetch('http://localhost:5000/getstudent',{ 
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({id}),
    });
    if(response.ok){
      const data= await response.json();
      console.log(data);
      setStudentdata(data);
  }
}
  catch(err){
    console.log(err);
  }
}
const fetchexam= async()  =>{
  try{
   const response = await fetch('http://localhost:5000/showexam');
   if(response.ok){
    const data= await response.json();
    setExam(data);
   }
  }
  catch(err){
    console.log(err);
  }
}
fetchexam();
fetchnotice();
fetchdata();
},[]);

const sendFeedback = async () => {
  try {
    const response = await fetch('http://localhost:5000/sendfeedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ feedback, name, department })
    });
    if (response.ok) {
      console.log('Feedback sent');
      alert('Feedback sent');
    } else {
      console.log('Feedback not sent');
    }
  } catch (err) {
    console.log(err);
  }
};

const toggleNotices = () => {
  setShowNotices(!showNotices);
};

  return (


    <div className="student-container">

<Navbar expand="lg" className="bg-body-tertiary">
  <Container>
    <Navbar.Brand href="/">IIITN</Navbar.Brand>
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <FaBell 
      className="notice-icon" 
      onClick={toggleNotices} 
      style={{ color: 'yellow', marginRight: '20px'}} // Set color and add margin for spacing
    />
    <Button variant="danger" href='/'>LOG-OUT</Button>
  </Container>
</Navbar>

<h1 style={{ textAlign: 'center' }}> Student Dashboard</h1>


  {showNotices && (
    <div className="notices-section section-spacing">
      <h2>Notices</h2>
      <ul className="notice-list">
        {notice.map((noticeItem) => (
          <li key={noticeItem.id} className="notice-item">
            <h3>{noticeItem.title}</h3>
            <p>{noticeItem.content}</p>
          </li>
        ))}
      </ul>
    </div>
  )}

  <div className="student-info section-spacing">
    <p>
      <strong>Name:</strong> {name}
    </p>
    <p>
      <strong>Department:</strong> {department}
    </p>
    <div>
      {studentdata && studentdata.length > 0 ? (
        <ul>
          {studentdata.map((item) => (
            <li key={item.id} className="student-item">
              <h3 style={{ textAlign: 'center' }} >{item.course_name}</h3>
              <p>Marks: {item.mark}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No data available</p>
      )}
    </div>
  </div>

  <div className="feedback-section section-spacing">
    <textarea
      name="feedback"
      value={feedback}
      onChange={(e) => setFeedback(e.target.value)}
      placeholder="Your feedback here..."
      required
    />
    <button onClick={sendFeedback} className="feedback-button">
      Send Feedback
    </button>
  </div>

  <section className="section-spacing">
    <h1>Exam Schedule</h1>
    {exam.length > 0 ? (
      <ul>
        {exam.map((item) => (
          <li key={item.id} className="exam-item">
            <h3>{item.course}</h3>
            <p>Exam Date: {item.examdate}</p>
          </li>
        ))}
      </ul>
    ) : (
      <p>No exams scheduled</p>
    )}
  </section>
</div>

  
  );
}