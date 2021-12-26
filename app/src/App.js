import { useState, useEffect, useRef } from 'react';

import './App.css';

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Slider from 'react-slick';

function App() {
  const [fetchResult, setFetchResult] = useState([]);
  const [chosenMovie, setChosenMovie] = useState('');
  const [chosenMovieResult, setChosenMovieResult] = useState({});
  
  const movieDetails = useRef(null);

  const sliderSettings = {
    slidesToShow: 5,
    slidesToScroll: 4
  }
  
  
  const handleMovieChosen = (e) => {
    setChosenMovie(e.currentTarget.id);
    setChosenMovieResult(fetchResult.find(m => m.titel === e.currentTarget.id));
  }

  const handleMovieHover = (e) => {
    e.currentTarget.className = 'App-movie-hover';
    e.currentTarget.children[1].style = '';
  }
  
  const handleMovieLeave = (e) => {
    e.currentTarget.className = '';
    e.currentTarget.children[1].style = 'visibility: hidden;'
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

      <Container style={{marginTop: 100}} className="p-0">
        <h2 style={{marginLeft: '5rem', marginBottom: '1.5rem'}}>Aktuelles Programm</h2>
        <Slider {...sliderSettings}>
          {fetchResult.map((movie) => (
            <div>
                <div onMouseEnter={handleMovieHover} onMouseLeave={handleMovieLeave} style={{paddingTop: '0.3rem', textAlign: 'center'}}>
                  <Card id={movie.titel} key={movie.titel} style={{width: '97%', margin: 'auto', color: 'black'}} onClick={handleMovieChosen}>
                    <Card.Img variant="top" src={movie.bild} />
                      <Card.Body style={{height: '7rem'}}>
                        <Card.Title style={{textAlign: 'left'}}>
                          {movie.titel}
                        </Card.Title>
                      </Card.Body>
                    </Card>
                    <svg style={{visibility: 'hidden'}} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-caret-down-fill" viewBox="0 0 16 16">
                      <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
                    </svg>
                </div>
            </div>
            ))}
        </Slider>
      </Container>

      {
        chosenMovie ? (
          <Container ref={movieDetails} style={{paddingLeft: '10rem', paddingRight: '10rem'}}>
            <Row style={{marginBottom: '0.5rem'}}>
              <Col style={{padding: 0}}>
                <h3>{chosenMovieResult.titel}</h3>
              </Col>
            </Row>
            <Row style={{backgroundColor: '#404B62', marginBottom: '0.5rem', paddingTop: '1rem', paddingBottom: '1rem'}}>
              <Col>
                {`${chosenMovieResult.dauer}min`}
              </Col>
            </Row>
            <Row style={{backgroundColor: '#404B62', paddingTop: '2rem', paddingBottom: '1rem', marginBottom: '5rem'}}>
              <Col>
                <h3 style={{fontWeight: 'bold', marginBottom: '1rem', marginLeft: '1.5rem'}}>Vorstellungen</h3>
                <Container fluid style={{backgroundColor: '#000B22'}}>
                  {chosenMovieResult.vorstellungen.map(e => (
                    <Row style={{paddingTop: '1rem', paddingBottom: '1rem'}} className='align-items-center'>
                      <Col style={{textAlign: 'left'}}>
                      {new Date(e.startzeit).toLocaleString('de-DE', {weekday: 'short'}).toUpperCase()}
                      <br />
                      {new Date(e.startzeit).toLocaleString('de-DE', {day: 'numeric', month:'short'})}
                      </Col>
                      <Col style={{textAlign: 'left'}}>
                        <Button variant="warning" style={{width: '5rem'}}>{new Date(e.startzeit).toLocaleTimeString('de-DE', {hour: '2-digit', minute:'2-digit'})}</Button>
                      </Col>
                    </Row>
                  ))} 
                </Container>
              </Col>
            </Row>
            <Row>
              <Col className='fs-5'>
                Beschreibung
              </Col>
              <Col>
                BeschreibungBlablasdasd asddddddddddddddas saaaaaaaaaaaada ssaaaaaa
              </Col>
            </Row>
          </Container>
        ) : null
      }


    </div>
  );
}

export default App;
