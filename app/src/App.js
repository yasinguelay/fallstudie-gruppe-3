import './App.css';
import { useState, useEffect } from 'react';

import SingleMovie from './SingleMovie';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ProgressBar from 'react-bootstrap/ProgressBar'
import cinemaIcon from 'bootstrap-icons/icons/film.svg';

function App() {
  const [result, setResult] = useState([]);
  const [chosenMovie, setChosenMovie] = useState('');

  const handleMovieChosen = (title) => {
    setChosenMovie(title);
  }
  
  useEffect(() => {
    fetch('https://fallstudie-gruppe-3.herokuapp.com/filme')
    .then(res => res.json())
    .then((result) => {
      setResult(result);
    });
  });
  
  return (
    <div id="home" className="App">
     <Navbar bg="dark" expand="lg" variant="dark">
  <Container fluid className="mx-2">
    <Navbar.Brand href="#home" style={{ 'flex-basis': 0 }} className="flex-fill text-start m-0">
    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-film" viewBox="0 0 16 16">
  <path d="M0 1a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V1zm4 0v6h8V1H4zm8 8H4v6h8V9zM1 1v2h2V1H1zm2 3H1v2h2V4zM1 7v2h2V7H1zm2 3H1v2h2v-2zm-2 3v2h2v-2H1zM15 1h-2v2h2V1zm-2 3v2h2V4h-2zm2 3h-2v2h2V7zm-2 3v2h2v-2h-2zm2 3h-2v2h2v-2z"/>
</svg><span className="ms-3">
  Kino 3
</span>
    </Navbar.Brand>
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Navbar.Brand href="#home" style={{ 'flex-basis': 0 }} className="flex-fill order-lg-last text-end m-0">
    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-person-circle" viewBox="0 0 16 16">
  <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
  <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
</svg>
    </Navbar.Brand>
    <Navbar.Collapse id="basic-navbar-nav">
      <Nav style={{ 'flex-basis': 0 }} className="me-auto flex-fill justify-content-center">
        <Nav.Link href="#home">Home</Nav.Link>
        <Nav.Link href="#link">Link</Nav.Link>
      </Nav>
    </Navbar.Collapse>
  </Container>
</Navbar>
     
    </div>
  );
  
}

export default App;
