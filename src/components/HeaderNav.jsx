import React, { useRef } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { NavLink } from 'react-router-dom'
import './HeaderStyles.css'


export const HeaderNav = () => {


    const collapseRef = useRef(null);
  
    const hideBars = () => {
      collapseRef.current.setAttribute("class", "navbar-collapse collapse");
    };

  return (
    <Navbar expand="lg" className="navbar-custom">
      <Container>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" ref={collapseRef}>
          <Nav>
            <NavLink to='/ordenes' onClick={hideBars}>Ordenes</NavLink>
            <NavLink to='/productos' onClick={hideBars}>Productos</NavLink>
            <NavLink to='/cargar' onClick={hideBars}>Cargar Producto</NavLink>
            <NavLink to='/preguntas-frecuentes' onClick={hideBars}>Pre</NavLink>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
