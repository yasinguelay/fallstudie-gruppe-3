import { useState, useEffect, useRef } from 'react';

import './App.css';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function App() {
  const [fetchResult, setFetchResult] = useState([]);
  const [chosenMovie, setChosenMovie] = useState('');
  const [chosenMovieResult, setChosenMovieResult] = useState({});
  
  const movieDetails = useRef(null);

  const handleMovieChosen = (e) => {
    setChosenMovie(e.currentTarget.id);
    setChosenMovieResult(fetchResult.find(m => m.titel === e.currentTarget.id));
  }
  
  useEffect(() => {
    fetch('https://fallstudie-gruppe-3.herokuapp.com/filme')
    .then(res => res.json())
    .then((result) => {
      setFetchResult(result);
    });
  }, []);

  useEffect(() => {
    if (chosenMovie) {
      movieDetails.current.scrollIntoView(true);
    }
  }, [chosenMovie]);
  
  return (
    <div id="home" className="App ">
      
      <Navbar bg="dark" expand="lg" variant="dark" fixed="top">
        <Container fluid className="mx-2">
          <Navbar.Brand href="#home" style={{ flexBasis: 0 }} className="flex-grow-1 text-start m-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-film" viewBox="0 0 16 16">
              <path d="M0 1a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V1zm4 0v6h8V1H4zm8 8H4v6h8V9zM1 1v2h2V1H1zm2 3H1v2h2V4zM1 7v2h2V7H1zm2 3H1v2h2v-2zm-2 3v2h2v-2H1zM15 1h-2v2h2V1zm-2 3v2h2V4h-2zm2 3h-2v2h2V7zm-2 3v2h2v-2h-2zm2 3h-2v2h2v-2z"/>
            </svg>
            <span className="ms-3">
              Kino 3
            </span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Brand href="#home" style={{ flexBasis: 0 }} className="flex-grow-1 order-lg-last text-end m-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-person-circle" viewBox="0 0 16 16">
              <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
              <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
            </svg>
          </Navbar.Brand>
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav style={{ flexBasis: 0 }} className="me-auto flex-grow-1 justify-content-center">
              <Nav.Link href="#home">Home</Nav.Link>
              <Nav.Link href="#link">Link</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container fluid style={{marginTop: '100px'}}>
        <Row className="g-4 justify-content-around">
          {fetchResult.map((movie) => (
            <Col id={movie.titel} key={movie.titel} style={{flexBasis: '25rem'}} className="flex-grow-0" onClick={handleMovieChosen}>
              <Card className="container-fluid p-0">
                <Card.Img variant="top" src={movie.bild} />
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {
        chosenMovie ? (
          <Container ref={movieDetails}>
            <Row>
              <Col>
                <h2>{chosenMovieResult.titel}</h2>
              </Col>
            </Row>
            <Row>
              <Col>
                {`${chosenMovieResult.dauer}min`}
              </Col>
            </Row>
            <Row>
              <Col>
                <h2>Vorstellungen</h2>
                {chosenMovieResult.vorstellungen.map(e => (
                  <Row>
                    <Col style={{textAlign: 'left'}}>
                    {new Date(e.startzeit).toLocaleString('de-DE', {weekday: 'short'}).toUpperCase()}
                    <br />
                    {new Date(e.startzeit).toLocaleString('de-DE', {day: 'numeric', month:'short'})}
                    </Col>
                    <Col style={{textAlign: 'left'}}>
                      <Button variant="warning">{new Date(e.startzeit).toLocaleTimeString('de-DE', {hour: '2-digit', minute:'2-digit'})}</Button>
                    </Col>
                  </Row>
                ))}
              </Col>
              <Row>
                <Col>
                  Beschreibung
                </Col>
                <Col>
                  BeschreibungBlabla
                </Col>
              </Row>
            </Row>
          </Container>
        ) : null
      }
      

    </div>
  );
  // test.toLocaleString('de-DE', {weekday: 'short'}).toUpperCase();
}

export default App;
