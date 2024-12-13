import React, { useEffect, useState } from 'react';
import './css/teacher.css';
import {FaBell} from 'react-icons/fa';

import Col from 'react-bootstrap/Col';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Button from 'react-bootstrap/Button';

const Teacher = ({id}) => {
  const [students, setStudents] = useState([]);
  const [marks,setMarks]=useState('');
    const [attendance,setAttendance]=useState('');
    const [userid,setId]=useState('');
    const [notice,setNotice]=useState([]);
    const [feedback,setFeedback]=useState([]);
    const [department,setDepartment]=useState('');
    const [exam,setExam]=useState({course:'',date:''});
    const [showNotices, setShowNotices] = useState(false);
    const [course,setCourse]=useState('');
    const [courseid,setCourseid]=useState('');
   
    const fetchStudents = async () => {
      try {
        const response = await fetch('http://localhost:5000/fetchstudents',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
      body:JSON.stringify({department,courseid}),
        });
        if (response.ok) {
          const data = await response.json();
          setStudents(data);
          console.log(data);
        } else {
          console.error('Failed to fetch students');
        }
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };
  useEffect(() => {
    fetchStudents();
  }, [department,courseid]);

  const updateStudent= async()=>{
    try{
   const response=await fetch('http://localhost:5000/update',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({
        userid,marks,attendance,courseid}),
   });
    if(response.ok){
      console.log('Student Updated');
       alert('Student details Updated');
      fetchStudents();
    }
    else{
      console.log('Failed to update student');}}
    catch (err){
      console.log(err);}   
  }

const deleteStudent= async()=>{
   try{
    const response= await fetch('http://localhost:5000/delete',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({userid,courseid}),
    })
    if(response.ok){
      console.log('Student Deleted');
      alert('Student Deleted');
      fetchStudents(); }
    else{
      console.log('Failed to delete student');
    }
   }
    catch(err){
      console.log(err);
    }
}
const addstudent=async()=>{
  try{
    const response= await fetch('http://localhost:5000/addstudent',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({userid,courseid,department}),
    });
    if(response.ok){
      console.log('Student Added');
      alert('Student Added');
      fetchStudents();
    }
    else{
      alert('Failed to add student');
      console.log('Failed to add student');
    }
  }
  catch(err){
    console.log(err);
  }
}

const fetchFeedback=async()=>{
  try{
    const response= await fetch('http://localhost:5000/showfeedback',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({department}),
    });
    if(response.ok){
      const data= await response.json();
      setFeedback(data);
    }
  }
  catch(err){
    console.log(err);
}
}

useEffect(()=>{
  const fetchnotive=async()=>{
    try{
      const response= await fetch('http://localhost:5000/showteachernotice');
      if(response.ok){
         const data= await response.json();
          setNotice(data);
          console.log(data);
      }}
    catch(err){
      console.log(err);
    }
  }

const fetchdep= async()=> {
  const response= await fetch('http://localhost:5000/teacherdep',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({id}),
  });
  if(response.ok){
    const data= await response.json();
    setDepartment(data[0].department);
    setCourse(data[0].course_name);
    setCourseid(data[0].course_id);
    console.log(data);
  }
  else{
    console.log('Failed to fetch department');
  }
};
fetchdep();
  fetchnotive();
},[]);

const scheduleExam=async(e)=>{
  e.preventDefault();
  try{
   const response=await fetch('http://localhost:5000/scheduleexam',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify({course:exam.course,examdate:exam.date}),
   })
   if(response.ok){
      console.log('Exam Scheduled');
      alert('Exam Scheduled');
   }
   else{
     console.log('Failed to schedule exam');
     alert('Failed to schedule exam');
   }
  }
  catch(err){
    console.log(err);
  }
}
const toggleNotices = () => {
  setShowNotices(!showNotices);
};


  return (
    
    <div className="teacher-page">

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


       <h1 style={{ textAlign: 'center' }}> Course: {course}</h1>
       {
        showNotices && (
          <div className="notices">
            <h2>Notices</h2>
            <ul className="notice-list">
              {notice.map((noticeItem) => (
                <li key={noticeItem.id} className="notice-item">
                  <h3>{noticeItem.title}</h3>
                  <p>{noticeItem.content}</p>
                </li>
              ))}
            </ul> 
          </div>)
       }
    <section className="section">
      <h1>Student List</h1>
      {students.length > 0 ? (
        <ol className="student-list">
          {students.map((student) => (
            <li key={student.id} className="student-item">
              <p><strong>ID:</strong> {student.user_id}</p>
              <p><strong>Name:</strong> {student.name}</p>
              <p><strong>Marks:</strong> {student.course_mark}</p>
              <p><strong>Department:</strong> {department}</p>
              <p><strong>Attendance:</strong> {student.attendance}</p>
            </li>
          ))}
        </ol>
      ) : (
        <p className="no-data">No students found</p>
      )}
      <div className="student-actions">
        <input type="number" placeholder="ID" onChange={(e) => setId(e.target.value)} />
        <input type="number" placeholder="Marks" onChange={(e) => setMarks(e.target.value)} />
        <input type="number" placeholder="Attendance" onChange={(e) => setAttendance(e.target.value)} />
        <button onClick={updateStudent}>Update</button>
        <button onClick={deleteStudent}>Delete</button>
        <button onClick={addstudent}>Add</button>
      </div>
    </section>


    <section className="section feedback-section">
      <h1>Feedback</h1>
      <button className="fetch-feedback-button" onClick={fetchFeedback}>Show Feedback</button>
      {feedback.length > 0 ? (
        <ul className="feedback-list">
          {feedback.map((feedbackItem) => (
            <li key={feedbackItem.id} className="feedback-item">
              <h3>{feedbackItem.fromwho}</h3>
              <p>{feedbackItem.feedback}</p>
            </li>  ))}
        </ul>
      ) : (
        <p className="no-data">No Feedback</p>
      )}
    </section>

    <section>

<h1>Schedule Exam</h1>
<Row className="g-2">
      <Col md>
        <FloatingLabel controlId="floatingInputGrid" label="Course">
          <Form.Control type="text" placeholder="Course" onChange={(e)=>setExam({...exam,course:e.target.value})} />
        </FloatingLabel>
      </Col>
      <Col md>
        <FloatingLabel>
          <Form.Control type="date" onChange={(e)=>setExam({...exam,date:e.target.value})}/>
        </FloatingLabel>
      </Col>
        <Button variant="outline-info" type='submit' onClick={scheduleExam}>Submit</Button>
    </Row>

    </section>
  </div>

 

  );
};

export default Teacher;