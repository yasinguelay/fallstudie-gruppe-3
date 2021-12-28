import { useState, useEffect, useRef } from 'react';

import './App.css';

import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import Row from 'react-bootstrap/Row';
import Slider from 'react-slick';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

function App() {
  const [fetchResult, setFetchResult] = useState([]);
  const [chosenMovie, setChosenMovie] = useState('');
  const [chosenMovieElementContainer, setChosenMovieElementContainer] = useState('');
  const [chosenMovieDetails, setChosenMovieDetails] = useState({});
  const [chosenMovieShows, setChosenMovieShows] = useState([]);
  const [chosenShow, setChosenShow] = useState('');
  const [chosenHall, setChosenHall] = useState(-1);
  const [chosenShowSeats, setChosenShowSeats] = useState([]);
  const [pk1Selected, setPk1Selected] = useState(true);
  const [chosenSeatsToBook, setChosenSeatsToBook] = useState([]);

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

  const handlePkChosen = (k) => {
    if (k === 'PK2') {
      setPk1Selected(false);
    } else {
      setPk1Selected(true);
    }
  }

  const handleSeatChosen = (e) => {
    if(e.currentTarget.getAttribute('fill') === '#FFCA2D') {
      e.currentTarget.setAttribute('fill', 'currentColor');
      e.currentTarget.innerHTML = '<path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2z"/>';

      const seatToDelete = {titel: chosenMovie, saal: chosenHall, startzeit: chosenShow, reihe: e.currentTarget.id[0], nummer: parseInt(e.currentTarget.id[1])};
      
      const removedSeatArray = chosenSeatsToBook.filter((e) => JSON.stringify(e) !== JSON.stringify(seatToDelete))

      setChosenSeatsToBook(removedSeatArray);

    } else {
      e.currentTarget.setAttribute('fill', '#FFCA2D');
      e.currentTarget.innerHTML = '<path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/><path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm12 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1v-1c0-1-1-4-6-4s-6 3-6 4v1a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12z"/>'

      const seatToAppend = {titel: chosenMovie, saal: chosenHall, startzeit: chosenShow, reihe: e.currentTarget.id[0], nummer: parseInt(e.currentTarget.id[1])};
      
      setChosenSeatsToBook([...chosenSeatsToBook, seatToAppend]);
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

      const seatsForChosenShow = [[]];

      for (const seat of chosenMovieDetails.vorstellungen.find(e => e.startzeit === chosenShow).sitzplaetze) {
        for (const row of seatsForChosenShow) {
          const indexOfDayArray = seatsForChosenShow.indexOf(row);
          
          if (row.length === 0 || seat.reihe === row[0].reihe) {
            row.push(seat);
          } else if (indexOfDayArray === seatsForChosenShow.length - 1) {
            seatsForChosenShow.push([seat]);
            break;
          }
        }
      }

      setChosenShowSeats(seatsForChosenShow);
      setChosenHall(chosenMovieDetails.vorstellungen.find(e => e.startzeit === chosenShow).saal);
    }
  }, [chosenShow, chosenMovieDetails]);
  
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
              <Row className='pe-0 mb-5'>
                <Col className='pe-0'>
                  <Tabs defaultActiveKey="PK1" id="uncontrolled-tab-example" onSelect={handlePkChosen}>
                    <Tab eventKey="PK1" title="PK1" className='p-0'>
                      <Row className='px-3'>
                        <Col className='fw-bold'>
                          Ticket
                        </Col>
                        <Col className='fw-bold'>
                          Preis
                        </Col>
                        <Col className='fw-bold text-center'>
                          Anzahl
                        </Col>
                        <Col className='fw-bold text-end'>
                          Gesamt
                        </Col>
                      </Row>
                      <hr className='m-2' />
                      <Row className='px-3 align-items-center'>
                        <Col>
                          Erwachsener
                        </Col>
                        <Col>
                          17,90 €
                        </Col>
                        <Col className='text-center'>
                          <Button variant="secondary">-</Button>
                          <span></span>
                          <Button variant="secondary">+</Button>
                        </Col>
                        <Col className='text-end'>
                          Gesamt
                        </Col>
                      </Row>
                      <hr className='m-2' />
                      <Row className='px-3 mb-4 align-items-center'>
                        <Col>
                          Kind unter 15 J
                        </Col>
                        <Col>
                          14,90 €
                        </Col>
                        <Col className='text-center'>
                          <Button variant="secondary">-</Button>
                          <span></span>
                          <Button variant="secondary">+</Button>
                        </Col>
                        <Col className='text-end'>
                          Gesamt
                        </Col>
                      </Row>
                      <Row className='px-3'>
                        <Col className='text-end'>
                          <Button style={{backgroundColor: '#C63E38', borderColor: '#C63E38'}} >Auswahl aufheben</Button>
                        </Col>
                      </Row>
                    </Tab>
                    <Tab eventKey="PK2" title="PK2">
                      Test
                    </Tab>
                  </Tabs>
                </Col>
              </Row>
              <Row className='justify-content-center pe-0' style={{position: 'relative'}}>
                <Row className='pe-0 mb-5'>
                  <Col style={{borderBottom: '2rem solid #555', borderLeft: '2rem solid transparent', borderRight: '2rem solid transparent'}}>
                  </Col>
                </Row>
                <Row style={{position: 'absolute', height: '2rem'}} className='pe-0 align-items-center'>
                  <Col style={{textAlign: 'center'}}>
                    Leinwand
                  </Col>
                </Row>
                <Row className='pe-0'>
                  {
                    chosenShowSeats.map(e => (
                      <Row key={`row-${e[0].reihe}`} className='pe-0 ms-0 mb-2 align-items-center'>
                        <Row style={{flexBasis: '90%', flexGrow: 1}} className='justify-content-center'>
                          {
                            e.map(s => (
                              <Col key={`seat-${s.reihe}-${s.nummer}`} className='mx-1 p-0' style={pk1Selected && s.reihe <= 'G' && !s.reserviert? {color: '#9D082B'} : {}}>
                                {s.reserviert ? (
                                  <OverlayTrigger placement="top" overlay=
                                    {
                                      <Popover id={`popover-positioned-top`}>
                                        <Popover.Header as="h3" style={{color: 'black'}}>Sitz nicht verfügbar</Popover.Header>
                                        <Popover.Body>
                                          Dieser Sitz steht leider nicht zur Verfügung.
                                        </Popover.Body>
                                      </Popover>
                                    }>
                                    <svg id={`${s.reihe}${s.nummer}`} xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-person-square" viewBox="0 0 16 16">
                                      <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                                      <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm12 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1v-1c0-1-1-4-6-4s-6 3-6 4v1a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12z"/>
                                    </svg>
                                   </OverlayTrigger>
                                  ) : (
                                    <OverlayTrigger placement="top" overlay=
                                    {
                                      <Popover id={`popover-positioned-top`}>
                                        <Popover.Header as="h3" style={{color: 'black'}}>{s.reihe <= 'G' ? 'PK1' : 'PK2'}</Popover.Header>
                                        <Popover.Body>
                                          {`Reihe: ${s.reihe}`}
                                          <br />
                                          {`Sitz: ${s.nummer}`}
                                        </Popover.Body>
                                      </Popover>
                                    }>
                                    <svg id={`${s.reihe}${s.nummer}`} onClick={handleSeatChosen} xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-square-fill" viewBox="0 0 16 16">
                                      <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2z"/>
                                    </svg>
                                 </OverlayTrigger>
                                )}
                              </Col>
                            ))
                          }
                        </Row>
                        <Col className='flex-grow-0 pe-0'>
                          {e[0].reihe}
                        </Col>
                      </Row>
                    ))
                  }
                </Row>
              </Row>
            </Row>
          </Container>
        ) : null
      }


    </div>
  );
}

export default App;
