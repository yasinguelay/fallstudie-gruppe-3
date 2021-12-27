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
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'

function App() {
  const [fetchResult, setFetchResult] = useState([]);
  const [chosenMovie, setChosenMovie] = useState('');
  const [chosenMovieElementContainer, setChosenMovieElementContainer] = useState('');
  const [chosenMovieDetails, setChosenMovieDetails] = useState({});
  const [chosenMovieShows, setChosenMovieShows] = useState([]);
  const [chosenShow, setChosenShow] = useState('');

  const movieDetails = useRef(null);
  const showDetails = useRef(null);

  const sliderSettings = {
    slidesToShow: 5,
    slidesToScroll: 4
  }
  
  
  const handleMovieChosen = (e) => {
    setChosenMovie(e.currentTarget.id);

    setChosenMovieElementContainer(e.currentTarget.parentElement);

    setChosenMovieDetails(fetchResult.find(m => m.titel === e.currentTarget.id))
    
    const allShowsForChosenMovie = fetchResult.find(m => m.titel === e.currentTarget.id).vorstellungen.map(s => s.startzeit).sort();

    const showsForEachDay = [[]];

    for (const show of allShowsForChosenMovie) {
      for (const day of showsForEachDay) {
        const indexOfDayArray = showsForEachDay.indexOf(day);
        
        if (day.length === 0 || show.substring(0, 10) === day[0].substring(0, 10)) {
          day.push(show);
        } else if(indexOfDayArray === showsForEachDay.length - 1) {
          showsForEachDay.push([show]);
          break;
        }
      }
    }

    setChosenMovieShows(showsForEachDay);
  }

  const handleShowChosen = (e) => {
    setChosenShow(e.target.value);
  }

  const handleMovieHover = (e) => {
    if (e.currentTarget.children[0].id !== chosenMovie) {
      e.currentTarget.className = 'App-movie-hover';
      e.currentTarget.children[1].style = '';
    }
  }
  
  const handleMovieLeave = (e) => {
    if (e.currentTarget.children[0].id !== chosenMovie) {
      e.currentTarget.className = '';
      e.currentTarget.children[1].style = 'visibility: hidden;'
    }
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
      chosenMovieElementContainer.className = 'App-movie-hover-active';
      movieDetails.current.scrollIntoView();
    }

    return () => {
      if (chosenMovie) {
        chosenMovieElementContainer.className = '';
        chosenMovieElementContainer.children[1].style = 'visibility: hidden;';
      }
    }
  }, [chosenMovie, chosenMovieElementContainer]);

  useEffect(() => {
    if (chosenShow) {
      showDetails.current.scrollIntoView();
    }
  }, [chosenShow]);
  
  return (
    <div id="home" className="App">
      
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
              <Nav.Link href="#home">Programm</Nav.Link>
              <Nav.Link href="#link">Admin</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container style={{marginTop: 100}} className="p-0">
        <h2 style={{marginLeft: '5rem', marginBottom: '1.5rem'}}>Aktuelles Programm</h2>
        <Slider {...sliderSettings}>
          {fetchResult.map((movie) => (
            <div key={movie.titel}>
                <div id={movie.titel + ' Container'} onMouseEnter={handleMovieHover} onMouseLeave={handleMovieLeave} style={{paddingTop: '0.3rem', textAlign: 'center'}}>
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
          <>
            <Container ref={movieDetails} style={{marginBottom: '5rem', scrollMarginTop: 59}}>
            <iframe width="100%" height="500" src="https://www.youtube.com/embed/JfVOs4VSpmA" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
            </Container>

            <Container style={{paddingLeft: '10rem', paddingRight: '10rem', marginBottom: '7rem'}}>
              <Row style={{marginBottom: '0.5rem'}}>
                <Col style={{padding: 0}}>
                  <h3>{chosenMovie}</h3>
                </Col>
              </Row>
              <Row style={{backgroundColor: '#404B62', marginBottom: '0.5rem', paddingTop: '1rem', paddingBottom: '1rem'}}>
                <Col>
                  {`${chosenMovieDetails.dauer}min`}
                </Col>
              </Row>
              <Row style={{backgroundColor: '#404B62', paddingTop: '2rem', paddingBottom: '1rem', marginBottom: '5rem'}}>
                <Col>
                  <h3 style={{fontWeight: 'bold', marginBottom: '1rem', marginLeft: '1.5rem'}}>Vorstellungen</h3>
                  <Container fluid style={{backgroundColor: '#000B22'}}>
                    {chosenMovieShows.map((e, i) => (
                      <Row key={e[0]} style={{paddingTop: '1rem', paddingBottom: '1rem'}} className='align-items-center'>
                        <Col xs={3} style={{textAlign: 'left'}}>
                        {new Date(e[0]).toLocaleString('de-DE', {weekday: 'short'}).toUpperCase()}
                        <br />
                        {new Date(e[0]).toLocaleString('de-DE', {day: 'numeric', month:'short'})}
                        </Col>
                        <Col>
                          <Row className='gx-2 gy-1 justify-content-start'>
                            {chosenMovieShows[i].map(s => (
                              <Col key={s} style={{textAlign: 'left'}} className='flex-grow-0'>
                                <Button value={s} variant="warning" style={{width: '5rem'}} onClick={handleShowChosen}>{new Date(s).toLocaleTimeString('de-DE', {hour: '2-digit', minute:'2-digit'})}</Button>
                              </Col>
                            ))}
                          </Row>
                        </Col>
                      </Row>
                    ))} 
                  </Container>
                </Col>
              </Row>
              <Row>
                <Col xs={3} className='fs-5'>
                  Beschreibung
                </Col>
                <Col>
                  {chosenMovieDetails.beschreibung}
                </Col>
              </Row>
            </Container>
          </>
          
        ) : null
      }

      {
        chosenShow ? (
          <Container ref={showDetails} style={{scrollMarginTop: 59, backgroundColor: '#404B62'}}>
            <Row className='py-2 fs-5'>
              <Col>
                Ihre Film- & Platzwahl
              </Col>
            </Row>
            <Row style={{backgroundColor: '#000B22'}} className='mx-0 pt-1'>
              <Row className='py-4 mb-4'>
                <Col>
                  <span className='fw-bold'>Film: </span>{chosenMovie + ' | '}<span className='fw-bold'>Saal: </span>{chosenMovieDetails.vorstellungen.find(e => e.startzeit === chosenShow).saal + ' | '}<span className='fw-bold'>Datum: </span>{new Date(chosenShow).toLocaleString('de-DE', {weekday: 'long', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'})}
                </Col>
              </Row>
              <Row className='mb-4'>
                <Col>
                  Bitte wählen Sie Ihre gewünschten Tickets und deren Anzahl aus.
                  <br />
                  Platzieren Sie die Tickets daraufhin in dem Saalplan unter der Ticketauswahl.
                </Col>
              </Row>
              <Row className='pe-0'>
                <Col className='pe-0'>
                  <Tabs defaultActiveKey="home" id="uncontrolled-tab-example" className="">
                    <Tab eventKey="home" title="Home" className='p-0'>
                      <Row className='px-3'>
                        <Col>
                          Ticket
                        </Col>
                        <Col>
                          Preis
                        </Col>
                        <Col>
                          Anzahl
                        </Col>
                        <Col>
                          Gesamt
                        </Col>
                      </Row>
                      <hr className='m-2' />
                      <Row className='px-3'>
                        <Col>
                          Erwachsener
                        </Col>
                        <Col>
                          17,90 €
                        </Col>
                        <Col>
                          <Button variant="secondary">-</Button>
                          <span></span>
                          <Button variant="secondary">+</Button>
                        </Col>
                        <Col>
                          Gesamt
                        </Col>
                      </Row>
                      <hr className='m-2' />
                      <Row className='px-3 mb-4'>
                        <Col>
                          Kind unter 15 J
                        </Col>
                        <Col>
                          14,90 €
                        </Col>
                        <Col>
                          <Button variant="secondary">-</Button>
                          <span></span>
                          <Button variant="secondary">+</Button>
                        </Col>
                        <Col>
                          Gesamt
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <Button variant="secondary">Auswahl aufheben</Button>
                        </Col>
                      </Row>
                    </Tab>
                    <Tab eventKey="profile" title="Profile">
                      Test
                    </Tab>
                  </Tabs>
                </Col>
              </Row>
            </Row>
          </Container>
        ) : null
      }


    </div>
  );
}

export default App;
