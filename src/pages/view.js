import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import './css/view.css';
import {FaNewspaper} from 'react-icons/fa';
import { FaImage } from 'react-icons/fa';
import {useNavigate} from 'react-router-dom';
import Carousel from 'react-bootstrap/Carousel';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';


import Form from 'react-bootstrap/Form';


ChartJS.register(ArcElement, Tooltip, Legend);



 

export default function View() {
  const [studentCount, setStudentCount] = useState([]);
  const [teacherCount, setTeacherCount] = useState([]);
  const [news, setNews] = useState([]);
  const [images, setImages] = useState([]);
  const [slider, setSlider] = useState([]);
  const [videos, setVideos] = useState([]);
  const [ticker,setTicker]= useState([]);
  const [contact , setContact]=useState({name:'', email:'', message:''});
  const navigate=useNavigate();
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  
  const sliderSettings = {
    dots: true,
    infinite: true, 
    speed: 200,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
  };

   // Prepare labels and data for the pie chart
   const labels = studentCount.map(e => e.department);
   const dataValues = studentCount.map(e => e.studentcount);
 
   // Configuration for the pie chart
   const pieChartData = {
     labels: labels,
     datasets: [
       {
         label: 'Student Count',
         data: dataValues,
         backgroundColor: [
           '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#E7E9ED',
         ], // Customize colors as needed
         hoverOffset: 4,
       },
     ],
   };

  useEffect(() => {
    const fetchStudentCount = async () => {
      try {
        const response = await fetch('http://localhost:5000/studentcount');
        const jsonData = await response.json();
        console.log(jsonData);
        setStudentCount(jsonData);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchteacherCount = async () => {
        try {
          const response = await fetch('http://localhost:5000/teachercount');
          const jsonData = await response.json();
          console.log(jsonData);
          setTeacherCount(jsonData);
        } catch (err) {
          console.log(err);
        }
      };

      const fetchNews=async()=>{
        try{
          const response =await fetch('http://localhost:5000/shownews');
          const jsonData=await response.json();
          setNews(jsonData);
        }
        catch(err){
          console.log(err);
        }
      }

      const showimage=async()=>{
        try{
            const data= await fetch('http://localhost:5000/showimage');
            if(data.ok){
        const image= await data.json();
        setImages(image);
        console.log('imagess fetched');
            }
            else{
                console.log('Failed to fetch images');}
            }
      catch(err){
        console.log(err);
      }     }

      const showslider=async()=>{
        try{
          const response= await fetch('http://localhost:5000/showslider');
          if(response.ok){
            const silder= await response.json();
            setSlider(silder);
          }
          else{
            console.log('error fetching slider');
          }
        }
        catch(err){
          console.log(err);
        }
      }

      const showvideo=async()=>{
        try{
            const data= await fetch('http://localhost:5000/showvideo');
            if(data.ok){
              const vid= await data.json();
              setVideos(vid);
              console.log('videos fetched');}
        }
        catch(err){
            console.log(err);
        }
        }
        const tickekers=async()=>{
          try{
            const response= await fetch('http://localhost:5000/showticker');
            if(response.ok){
              const data= await response.json();
              setTicker(data);
            }
            else{
              console.log('error fetching tickers');
            }
          }
          catch(err){
            console.log(err);
          }
        }
        fetchStudentCount();
        fetchteacherCount();
        fetchNews();
        showimage();
        showslider();
        showvideo();
        tickekers();

  }, []);

  const handleLoginClick = () => {
    navigate('/login');
  };
  const handleNewsClick = () => {
    navigate('/news');
  };

  const handleImagesClick = () => {
    navigate('/images');
  };

  const sendcontact = async()=>{
    try{
     const response= await fetch('http://localhost:5000/sendcontact',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({name:contact.name,message:contact.message,email:contact.email}),
     });
     if(response.ok){
     console.log('contact sent');
     alert('contact sent');
     }
     else{
       console.log('contact not sent');
    }}
    catch(err){
      console.log(err);
    }
  }
  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    if (currentScrollY > lastScrollY) {
      setShowNavbar(false);
    } else {
      setShowNavbar(true);
    }
    setLastScrollY(currentScrollY);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  
  

  return (

<div className="view-container">
  

<Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="#home">IIITN</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href='#news-section'>News</Nav.Link>
            <NavDropdown title="Dropdown" id="basic-nav-dropdown">
              <NavDropdown.Item href="#image-gallery">Gallery</NavDropdown.Item>
              <NavDropdown.Item href="#video-section">
                Video
              </NavDropdown.Item>
              <NavDropdown.Item href="#contact-section">ContactUs</NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Button onClick={handleLoginClick}>LOG-IN</Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>

    <div>

    <section id='HOME' className='block'>

<Carousel>
      <Carousel.Item>
       
      <img
        className='d-block w-100'
        src='https://i.ytimg.com/vi/jP2CH5uGZ-E/maxresdefault.jpg?sqp=-oaymwEmCIAKENAF8quKqQMa8AEB-AH-CYAC0AWKAgwIABABGE0gXChlMA8=&rs=AOn4CLD9PeUUaHQsmufi7XUh4inaSs8wOw'
        alt='First slide'
        style={{ objectFit: 'cover', maxHeight: '500px' }}
    />
        <Carousel.Caption>
          <h3>Comprehensive Admin Control</h3>
          <p>Admins can manage the entire system, including adding, updating, deleting, and viewing records to maintain a well-organized ERP.</p>
        </Carousel.Caption>
      </Carousel.Item>
      
      <Carousel.Item>
       
       
        <img
        className='d-block w-100'
        src = 'https://iiitnagpur.ac.in/images/Slider/173/Slider-173.jpg'
        alt='First slide'
        style={{ objectFit: 'cover', maxHeight: '500px' }}
        />
        <Carousel.Caption>
        <h3>Empowered Teachers</h3>
      <p>Teachers can access and update student information, monitor progress, and schedule exams seamlessly to enhance academic oversight.</p>
        </Carousel.Caption>
      </Carousel.Item>

      <Carousel.Item>
      <img
        className='d-block w-100'
        src = 'https://ugcounselor-content.s3.ap-south-1.amazonaws.com/wp-content/uploads/2024/05/19123831/IIIT-Nagpur.jpg'
        alt='First slide'
        style={{ objectFit: 'cover', maxHeight: '500px' }}
            />

        
        <Carousel.Caption>
        <h3>Student Self-Service</h3>
      <p>Students can view their personal details, academic progress, and submit feedback, making engagement and transparency more accessible.</p>
        </Carousel.Caption>
      </Carousel.Item>

    </Carousel>

        </section>

    </div>


    <section className="chart-section">
  <div className="chart-container">
    <h2>Student Count by Department</h2>
    {studentCount.length > 0 ? (
      <Pie
        data={pieChartData}
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
              labels: {
                font: {
                  size: 14,
                },
              },
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  let label = context.label || '';
                  let value = context.raw || 0;
                  return `${label}: ${value} students`;
                },
              },
            },
            datalabels: {
              formatter: (value, context) => {
                return `${value} students`; // Show the count on the pie chart
              },
              color: '#fff', // Change the label color to white
              font: {
                weight: 'bold',
              },
            },
          },
        }}
      />
    ) : (
      <p>No student data available</p>
    )}
  </div>

  <div className="chart-container">
    <h2>Teacher's Count by Department</h2>
    {teacherCount.length > 0 ? (
      <Pie
        data={{
          labels: teacherCount.map((e) => e.department),
          datasets: [
            {
              label: 'Teacher Count',
              data: teacherCount.map((e) => e.teachercount),
              backgroundColor: [
                '#FFC300', '#FF5733', '#C70039', '#900C3F', '#581845',
                '#28B463', '#1F618D',
              ],
              hoverOffset: 4,
            },
          ],
        }}
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
              labels: {
                font: {
                  size: 14,
                },
              },
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  let label = context.label || '';
                  let value = context.raw || 0;
                  return `${label}: ${value} teachers`;
                },
              },
            },
            datalabels: {
              formatter: (value, context) => {
                return `${value} teachers`; // Show the count on the pie chart
              },
              color: '#fff', // Change the label color to white
              font: {
                weight: 'bold',
              },
            },
          },
        }}
      />
    ) : (
      <p>No Teacher data available</p>
    )}
  </div>
</section>
    {/* <section className="chart-section">
      <div className="chart-container">
        <h2>Student Count by Department</h2>
        {studentCount.length > 0 ? (
          <Pie
            data={pieChartData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                  labels: {
                    font: {
                      size: 14,
                    },
                  },
                },
                tooltip: {
                  callbacks: {
                    label: function (context) {
                      let label = context.label || '';
                      let value = context.raw || 0;
                      return `${label}: ${value} students`;
                    },
                  },
                },
              },
            }}
          />
        ) : (
          <p>No student data available</p>
        )}
      </div>

      <div className="chart-container">
  <h2>Teacher's Count by Department</h2>
  {teacherCount.length > 0 ? ( // Change from studentCount to teacherCount
    <Pie
      data={{
        labels: teacherCount.map((e) => e.department), // Use teacher data for labels
        datasets: [
          {
            label: 'Teacher Count',
            data: teacherCount.map((e) => e.teachercount), // Use teacher data for values
            backgroundColor: ['#FFC300', '#FF5733', '#C70039', '#900C3F', '#581845', '#28B463', '#1F618D'], // Adjust colors as needed
            hoverOffset: 4,
          },
        ],
      }}
      options={{
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              font: {
                size: 14,
              },
            },
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                let label = context.label || '';
                let value = context.raw || 0;
                return `${label}: ${value} teachers`; // Update text for teacher data
              },
            },
          },
        },
      }}
    />
  ) : (
    <p>No Teacher data available</p>
  )}
</div>

    </section> */}

      {/* <section className="table-section">
        <div className="table-container">
          <div className="table-wrapper">
            <h2>Student Data</h2>
            {studentCount.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Branch</th>
                    <th>Student Count</th>
                  </tr>
                </thead>
                <tbody>
                  {studentCount.map((e) => (
                    <tr key={e.department}>
                      <td>{e.department}</td>
                      <td>{e.studentcount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No student data available</p>
            )}
          </div>
          <div className="table-wrapper">
            <h2>Teacher Data</h2>
            {teacherCount.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Branch</th>
                    <th>Teacher Count</th>
                  </tr>
                </thead>
                <tbody>
                  {teacherCount.map((e) => (
                    <tr key={e.department}>
                      <td>{e.department}</td>
                      <td>{e.teachercount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No teacher data available</p>
            )}
          </div>
        </div>
      </section>

      <section id ="news-section"className="news-section">
        <h2>News</h2>
        {news.length > 0 ? (
          <ul>
            {news.map((e) => (
              <li key={e.id} className="news-item">
                <h3>{e.title}</h3>
                <p>{e.content}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No news available</p>
        )}
      </section> */}

      <section id="image-gallery"className="image-gallery">
        <h2>Image Gallery</h2>
        {images.length > 0 ? (
          <div className="images-grid">
            {images.map((image) => (
              <div key={image.id} className="image-card">
                <h4>{image.title}</h4>
                <img
                  src={`http://localhost:5000${image.imageUrl}`}
                  alt={image.title}
                />
              </div>
            ))}
          </div>
        ) : (
          <p>No images available</p>
        )}
      </section>

      <section id ="video-section" className="video-section">
        <h2>Videos</h2>
        {videos.length > 0 ? (
          <div className="videos-grid">
            {videos.map((video) => (
              <div key={video.id} className="video-card">
                <h4>{video.title}</h4>
                <video controls>
                  <source
                    src={`http://localhost:5000${video.videoUrl}`}
                    type="video/mp4"
                  />
                </video>
              </div>
            ))}
          </div>
        ) : (
          <p>No videos available</p>
        )}
      </section>

      <section id='contact-section' className="contact-section">
        <h2>Contact</h2>
         <Form>
         <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
        <Form.Label>Name</Form.Label>
        <Form.Control type="text" placeholder="@Username"  value={contact.name} required onChange={(e) => setContact({ ...contact, name: e.target.value })} />
      </Form.Group>    
      <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
        <Form.Label>Email address</Form.Label>
        <Form.Control type="email" placeholder="name@example.com"  value={contact.email} required onChange={(e) => setContact({ ...contact, email: e.target.value })} />
      </Form.Group>
      <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
        <Form.Label>Message</Form.Label>
        <Form.Control as="textarea" rows={3} value={contact.message} required onChange={(e) => setContact({ ...contact, message: e.target.value })} />
      </Form.Group>
      <Button variant="outline-secondary" type='submit' onClick={sendcontact}>Submit</Button>
    </Form>
      </section>


    </div>
  );
  
}
