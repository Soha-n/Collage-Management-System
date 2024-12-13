import React from 'react';
import Dashboard from './dashboard';

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Button from 'react-bootstrap/Button';

export default function Admin(){

    return(
        <div>
            
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand  href="/">IIITN</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Button variant="danger" href='/'>LOG-OUT</Button>
      </Container>
    </Navbar>

    <h2 style={{ textAlign: 'center' }}>Admin Dashboard</h2>

         <Dashboard/>
        </div>
    );
}