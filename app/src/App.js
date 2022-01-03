import { useState, useEffect, useRef } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

import { CheckoutForm, CheckoutButton } from './CheckoutForm.js';
import Loading from './Loading.js';

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
import SeatsModal from './SeatsModal.js';
import Tooltip from 'react-bootstrap/Tooltip';

function App() {
  const { isLoading, isAuthenticated, loginWithRedirect, logout, user } = useAuth0();

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
  const [seatsSelected, setSeatsSelected] = useState(false);
  
  const [pk1FreeSeatsTotal, setPk1FreeSeatsTotal] = useState(0);
  const [pk2FreeSeatsTotal, setPk2FreeSeatsTotal] = useState(0);
  const [pk1SelectableSeats, setPk1SelectableSeats] = useState(0);
  const [pk2SelectableSeats, setPk2SelectableSeats] = useState(0);
  const [pk1AdultAmount, setPk1AdultAmount] = useState(0);
  const [pk1ChildAmount, setPk1ChildAmount] = useState(0);
  const [pk2AdultAmount, setPk2AdultAmount] = useState(0);
  const [pk2ChildAmount, setPk2ChildAmount] = useState(0);

  const [seatsModalShow, setSeatsModalShow] = useState(false);
  const [checkBoxToggled, setCheckBoxToggled] = useState(false);
  const [checkoutEntered, setCheckoutEntered] = useState(false);

  const movieDetails = useRef(null);
  const showDetails = useRef(null);
  const checkout = useRef(null);

  const pk1AdultPrice = 11.90;
  const pk1ChildPrice = 9.90;
  const pk2AdultPrice = 12.90
  const pk2ChildPrice = 9.90;

  const sliderSettings = {
    slidesToShow: 5,
    slidesToScroll: 4
  };


  const handleMovieChosen = (e) => {
    setChosenMovie(e.currentTarget.id);

    setChosenMovieElementContainer(e.currentTarget.parentElement);

    setChosenMovieDetails(fetchResult.find(m => m.titel === e.currentTarget.id))

    setChosenShow('');

    setSeatsSelected(false);
    
    const allShowsForChosenMovie = fetchResult.find(m => m.titel === e.currentTarget.id).vorstellungen.map(s => s.startzeit).filter(s => new Date(s) > new Date()).sort();

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
  };

  const handleShowChosen = (e) => {
    setChosenShow(e.target.value);
    setSeatsSelected(false);
  };

  const handleMovieHover = (e) => {
    if (e.currentTarget.children[0].id !== chosenMovie) {
      e.currentTarget.className = 'App-movie-hover';
      e.currentTarget.children[1].style = '';
    }
  };
  
  const handleMovieLeave = (e) => {
    if (e.currentTarget.children[0].id !== chosenMovie) {
      e.currentTarget.className = '';
      e.currentTarget.children[1].style = 'visibility: hidden;'
    }
  };

  const handlePkChosen = (k) => {
    if (k === 'PK2') {
      setPk1Selected(false);
    } else {
      setPk1Selected(true);
    }
  };

  const handleSeatChosen = (e) => {
    if(e.currentTarget.getAttribute('fill') === '#FFCA2D') {

      setChosenShowSeats(chosenShowSeats.map(r => {
        const arrayToReturn = [];
        
        for (const s of r) {
          if (s.reihe === e.currentTarget.id[0] && s.nummer === parseInt(e.currentTarget.id.slice(1))) {
            s.reserviert = false;
          }
          
          arrayToReturn.push(s);
        }
        
        return arrayToReturn;
      }));

      const seatToDelete = {titel: chosenMovie, saal: chosenHall, startzeit: chosenShow, reihe: e.currentTarget.id[0], nummer: parseInt(e.currentTarget.id.slice(1))};
      
      const removedSeatArray = chosenSeatsToBook.filter((e) => JSON.stringify(e) !== JSON.stringify(seatToDelete))

      setChosenSeatsToBook(removedSeatArray);

      if (e.currentTarget.id[0] <= 'G') {
        setPk1SelectableSeats(pk1SelectableSeats + 1);
      } else {
        setPk2SelectableSeats(pk2SelectableSeats + 1);
      }

      setSeatsSelected(false);

    } else if (e.currentTarget.id[0] <= 'G' && pk1SelectableSeats > 0) {

      setChosenShowSeats(chosenShowSeats.map(r => {
        const arrayToReturn = [];
        
        for (const s of r) {
          if (s.reihe === e.currentTarget.id[0] && s.nummer === parseInt(e.currentTarget.id.slice(1))) {
            s.reserviert = 'userSelect';
          }
          
          arrayToReturn.push(s);
        }
        
        return arrayToReturn;
      }));

      const seatToAppend = {titel: chosenMovie, saal: chosenHall, startzeit: chosenShow, reihe: e.currentTarget.id[0], nummer: parseInt(e.currentTarget.id.slice(1))};
      
      setChosenSeatsToBook([...chosenSeatsToBook, seatToAppend]);
      setPk1SelectableSeats(pk1SelectableSeats - 1);
    } else if (e.currentTarget.id[0] > 'G' && pk2SelectableSeats > 0) {
      
      setChosenShowSeats(chosenShowSeats.map(r => {
        const arrayToReturn = [];
        
        for (const s of r) {
          if (s.reihe === e.currentTarget.id[0] && s.nummer === parseInt(e.currentTarget.id.slice(1))) {
            s.reserviert = 'userSelect';
          }
          
          arrayToReturn.push(s);
        }
        
        return arrayToReturn;
      }));

      const seatToAppend = {titel: chosenMovie, saal: chosenHall, startzeit: chosenShow, reihe: e.currentTarget.id[0], nummer: parseInt(e.currentTarget.id.slice(1))};
      
      setChosenSeatsToBook([...chosenSeatsToBook, seatToAppend]);
      setPk2SelectableSeats(pk2SelectableSeats - 1);
    }
  };

  const handlePk1AdultAdded = (e) => {
    if (pk1AdultAmount < 9 && pk1FreeSeatsTotal > 0) {
      setPk1AdultAmount(pk1AdultAmount + 1);
      setPk1FreeSeatsTotal(pk1FreeSeatsTotal - 1);
      setPk1SelectableSeats(pk1SelectableSeats + 1);
    }
  };

  const handlePk1AdultRemoved = (e) => {
    if (pk1AdultAmount > 0 && pk1SelectableSeats > 0) {
      setPk1AdultAmount(pk1AdultAmount - 1);
      setPk1FreeSeatsTotal(pk1FreeSeatsTotal + 1);
      setPk1SelectableSeats(pk1SelectableSeats - 1);
    }
  };

  const handlePk1ChildAdded = (e) => {
    if (pk1ChildAmount < 9 && pk1FreeSeatsTotal > 0) {
      setPk1ChildAmount(pk1ChildAmount + 1);
      setPk1FreeSeatsTotal(pk1FreeSeatsTotal - 1);
      setPk1SelectableSeats(pk1SelectableSeats + 1);
    }
  };
  
  const handlePk1ChildRemoved = (e) => {
    if (pk1ChildAmount > 0 && pk1SelectableSeats > 0) {
      setPk1ChildAmount(pk1ChildAmount - 1);
      setPk1FreeSeatsTotal(pk1FreeSeatsTotal + 1);
      setPk1SelectableSeats(pk1SelectableSeats - 1);
    }
  };

  const handlePk2AdultAdded = (e) => {
    if (pk2AdultAmount < 9 && pk2FreeSeatsTotal > 0) {
      setPk2AdultAmount(pk2AdultAmount + 1);
      setPk2FreeSeatsTotal(pk2FreeSeatsTotal - 1);
      setPk2SelectableSeats(pk2SelectableSeats + 1);
    }
  };

  const handlePk2AdultRemoved = (e) => {
    if (pk2AdultAmount > 0 && pk2SelectableSeats > 0) {
      setPk2AdultAmount(pk2AdultAmount - 1);
      setPk2FreeSeatsTotal(pk2FreeSeatsTotal + 1);
      setPk2SelectableSeats(pk2SelectableSeats - 1);
    }
  };

  const handlePk2ChildAdded = (e) => {
    if (pk2ChildAmount < 9 && pk2FreeSeatsTotal > 0) {
      setPk2ChildAmount(pk2ChildAmount + 1);
      setPk2FreeSeatsTotal(pk2FreeSeatsTotal - 1);
      setPk2SelectableSeats(pk2SelectableSeats + 1);
    }
  };
  
  const handlePk2ChildRemoved = (e) => {
    if (pk2ChildAmount > 0 && pk2SelectableSeats > 0) {
      setPk2ChildAmount(pk2ChildAmount - 1);
      setPk2FreeSeatsTotal(pk2FreeSeatsTotal + 1);
      setPk2SelectableSeats(pk2SelectableSeats - 1);
    }
  };
  
  const handleDeleteSelectionPk1 = (e) => {
    const newChosenSeatsToBook = chosenSeatsToBook.filter(e => e.reihe > 'G');
    const resetChosenSeatsToBook = chosenSeatsToBook.filter(e => e.reihe <= 'G')
    
    setPk1FreeSeatsTotal(pk1FreeSeatsTotal + pk1AdultAmount + pk1ChildAmount);
    setPk1SelectableSeats(0);
    setPk1AdultAmount(0);
    setPk1ChildAmount(0);
    setChosenSeatsToBook(newChosenSeatsToBook);
    setSeatsSelected(false);

    for (const row of chosenShowSeats) {
      for (const seat of row) {
        if (seat.reserviert === 'userSelect' && seat.reihe <= 'G') {
          seat.reserviert = false;
        }
      }
    }

    if (checkoutEntered) {

      setCheckoutEntered(false);

      fetch('https://fallstudie-gruppe-3.herokuapp.com/sitzplaetze/freigeben', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(resetChosenSeatsToBook.map(e => ({...e, wert: 'r' + user.sub})))
      })
        .then((result) => {
          ;
        }, (error) => {
          ;
        });
    }
  };
  
  const handleDeleteSelectionPk2 = (e) => {
    const newChosenSeatsToBook = chosenSeatsToBook.filter(e => e.reihe <= 'G');
    const resetChosenSeatsToBook = chosenSeatsToBook.filter(e => e.reihe > 'G')

    setPk2FreeSeatsTotal(pk2FreeSeatsTotal + pk2AdultAmount + pk2ChildAmount);
    setPk2SelectableSeats(0);
    setPk2AdultAmount(0);
    setPk2ChildAmount(0);
    setChosenSeatsToBook(newChosenSeatsToBook);
    setSeatsSelected(false);

    for (const row of chosenShowSeats) {
      for (const seat of row) {
        if (seat.reserviert === 'userSelect' && seat.reihe > 'G') {
          seat.reserviert = false;
        }
      }
    }

    if (checkoutEntered) {

      setCheckoutEntered(false);

      fetch('https://fallstudie-gruppe-3.herokuapp.com/sitzplaetze/freigeben', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(resetChosenSeatsToBook.map(e => ({...e, wert: 'r' + user.sub})))
      })
        .then((result) => {
          ;
        }, (error) => {
          ;
        });
    }
  };

  const handleNextClick = (e) => {
    if ((pk1AdultAmount || pk1ChildAmount || pk2AdultAmount || pk2ChildAmount) && !pk1SelectableSeats && !pk2SelectableSeats) {
      if(isAuthenticated) {
        fetch('https://fallstudie-gruppe-3.herokuapp.com/sitzplaetze/reservieren', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(chosenSeatsToBook.map(e => ({...e, wert: 'r' + user.sub})))
        })
          .then((result) => {
            if (!result.ok) {
              setSeatsModalShow(true);
              return;
            }
            
            setSeatsSelected(true);
            setCheckoutEntered(true);
          }, (error) => {
            setFetchResult('Init Fetch Failed!');
          });
      } else {
        setSeatsModalShow(true);
      }
    }
  };

  const handleFormSubmit = (e) => {
    document.getElementById('Checkout').requestSubmit();
    document.getElementById('Checkout-Box').requestSubmit();
  }

  const handleSeatsModalHide = [
    (e) => {
      window.location.reload();
    }, (e) => {
      loginWithRedirect();
    }
  ];

  const handleBookingModalHide = [
    (e) => {
        window.location.reload();
    }, (e) => {
      showDetails.current.scrollIntoView();

      const seatsForChosenShow = [[]];
      let pk1FreeSeatsTotal = 0;
      let pk2FreeSeatsTotal = 0;

      for (const seat of chosenMovieDetails.vorstellungen.find(e => e.startzeit === chosenShow).sitzplaetze) {
        for (const row of seatsForChosenShow) {
          const indexOfDayArray = seatsForChosenShow.indexOf(row);
          
          if (row.length === 0 || seat.reihe === row[0].reihe) {
            row.push({...seat});
          } else if (indexOfDayArray === seatsForChosenShow.length - 1) {
            seatsForChosenShow.push([{...seat}]);
            break;
          }
        }

        if (seat.reserviert === false && seat.reihe <= 'G') {
          pk1FreeSeatsTotal++;
        } else if (seat.reserviert === false && seat.reihe > 'G') {
          pk2FreeSeatsTotal++;
        }
      }

      setChosenShowSeats(seatsForChosenShow);
      setChosenHall(chosenMovieDetails.vorstellungen.find(e => e.startzeit === chosenShow).saal);
      setPk1FreeSeatsTotal(pk1FreeSeatsTotal);
      setPk2FreeSeatsTotal(pk2FreeSeatsTotal);
      setPk1SelectableSeats(0);
      setPk2SelectableSeats(0);
      setPk1AdultAmount(0);
      setPk1ChildAmount(0);
      setPk2AdultAmount(0);
      setPk2ChildAmount(0);
      setChosenSeatsToBook([]);
    }
];

  useEffect(() => {
    fetch('https://fallstudie-gruppe-3.herokuapp.com/filme')
    .then(res => res.json())
    .then((result) => {
      setFetchResult(result);
    }, (error) => {
      setFetchResult('Init Fetch Failed!');
    });
  }, []);


  useEffect(() => {
    setPk1FreeSeatsTotal(0);
    setPk2FreeSeatsTotal(0);
    setPk1SelectableSeats(0);
    setPk2SelectableSeats(0);
    setPk1AdultAmount(0);
    setPk1ChildAmount(0);
    setPk2AdultAmount(0);
    setPk2ChildAmount(0);
    setChosenSeatsToBook([]);
    
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
      let pk1FreeSeatsTotal = 0;
      let pk2FreeSeatsTotal = 0;

      for (const seat of chosenMovieDetails.vorstellungen.find(e => e.startzeit === chosenShow).sitzplaetze) {
        for (const row of seatsForChosenShow) {
          const indexOfDayArray = seatsForChosenShow.indexOf(row);
          
          if (row.length === 0 || seat.reihe === row[0].reihe) {
            row.push({...seat});
          } else if (indexOfDayArray === seatsForChosenShow.length - 1) {
            seatsForChosenShow.push([{...seat}]);
            break;
          }
        }

        if (seat.reserviert === false && seat.reihe <= 'G') {
          pk1FreeSeatsTotal++;
        } else if (seat.reserviert === false && seat.reihe > 'G') {
          pk2FreeSeatsTotal++;
        }
      }

      setChosenShowSeats(seatsForChosenShow);
      setChosenHall(chosenMovieDetails.vorstellungen.find(e => e.startzeit === chosenShow).saal);
      setPk1FreeSeatsTotal(pk1FreeSeatsTotal);
      setPk2FreeSeatsTotal(pk2FreeSeatsTotal);
      setPk1SelectableSeats(0);
      setPk2SelectableSeats(0);
      setPk1AdultAmount(0);
      setPk1ChildAmount(0);
      setPk2AdultAmount(0);
      setPk2ChildAmount(0);
      setChosenSeatsToBook([]);
    }
  }, [chosenShow, chosenMovieDetails]);

  useEffect(() => {
    if(seatsSelected) {
      checkout.current.scrollIntoView();
    }
  }, [seatsSelected]);

  
  if (isLoading) {
    return <Loading />;
  }

  if (fetchResult === 'Init Fetch Failed!') {
    return (
      <Row style={{minHeight: '95vh'}} className="justify-content-center align-items-center">
          <Col xs='auto'>
              Bitte versuchen Sie es später erneut
          </Col>
      </Row>
    );
  }

  return (
    <div id="home" className="App pb-4">
      
      <Navbar bg="dark" expand="lg" variant="dark" fixed="top">
        <Container fluid className="mx-2">
          <Navbar.Brand href="/" style={{ flexBasis: 0 }} className="flex-grow-1 text-start m-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-film" viewBox="0 0 16 16">
              <path d="M0 1a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V1zm4 0v6h8V1H4zm8 8H4v6h8V9zM1 1v2h2V1H1zm2 3H1v2h2V4zM1 7v2h2V7H1zm2 3H1v2h2v-2zm-2 3v2h2v-2H1zM15 1h-2v2h2V1zm-2 3v2h2V4h-2zm2 3h-2v2h2V7zm-2 3v2h2v-2h-2zm2 3h-2v2h2v-2z"/>
            </svg>
            <span className="ms-3">
              Kino 3
            </span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          {isAuthenticated ? (
              <Row style={{ flexBasis: 0, cursor: 'pointer' }} className="flex-grow-1 order-lg-last text-end m-0 justify-content-end">
                <OverlayTrigger placement="bottom" delay={{ show: 250, hide: 400 }} overlay={<Tooltip id="logout-tooltip">Logout</Tooltip>}>
                  <Col xs='auto' className='pe-0'>
                    <Navbar.Brand href="" onClick={() => logout({returnTo: window.location.origin})}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-box-arrow-left" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0v2z"/>
                        <path fillRule="evenodd" d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3z"/>
                      </svg>
                    </Navbar.Brand>
                  </Col>
                </OverlayTrigger>
              </Row>
          ) : (
              <Row style={{ flexBasis: 0, cursor: 'pointer' }} className="flex-grow-1 order-lg-last text-end m-0 justify-content-end">
                <OverlayTrigger placement="bottom" delay={{ show: 250, hide: 400 }} overlay={<Tooltip id="login-tooltip">Login</Tooltip>}>
                  <Col xs='auto' className='pe-0'>
                    <Navbar.Brand href="" style={{ flexBasis: 0, cursor: 'pointer' }} className="flex-grow-1 order-lg-last text-end m-0" onClick={() => loginWithRedirect()}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-person-circle" viewBox="0 0 16 16">
                        <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                        <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
                      </svg>
                    </Navbar.Brand>
                  </Col>
                </OverlayTrigger>
              </Row>
          )}
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav style={{ flexBasis: 0 }} className="me-auto flex-grow-1 justify-content-center">
              <Nav.Link href="/">Programm</Nav.Link>
              {/* <Nav.Link href="">Admin</Nav.Link> */}
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
            <iframe width="100%" height="500" src={chosenMovieDetails.trailer} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
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
                    {chosenMovieShows[0].length !== 0 ? chosenMovieShows.map((e, i) => (
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
                    )) : (
                      <Row style={{height: '5rem'}} className='align-items-center'>
                        <Col>
                          Aktuell keine Vorstellung
                        </Col>
                      </Row>
                    )} 
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
          <Container ref={showDetails} style={{scrollMarginTop: 59, backgroundColor: '#404B62'}} className='pb-3'>
            <Row className='py-2 fs-5'>
              <Col>
                Ihre Film- & Platzwahl
              </Col>
            </Row>
            <Row style={{backgroundColor: '#000B22'}} className='mx-0 pt-1 pb-5 mb-2'>
              <Row className='py-4 mb-4'>
                <Col>
                  <span className='fw-bold'>Film: </span>{chosenMovie + ' | '}<span className='fw-bold'>Saal: </span>{chosenMovieDetails.vorstellungen.find(e => e.startzeit === chosenShow).saal + ' | '}<span className='fw-bold'>Datum: </span>{new Date(chosenShow).toLocaleString('de-DE', {weekday: 'long', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'})}
                </Col>
              </Row>
              <Row className='mb-4'>
                <Col>
                  {pk1AdultAmount || pk1ChildAmount || pk2AdultAmount || pk2ChildAmount ? `${(pk1AdultAmount + pk1ChildAmount + pk2AdultAmount + pk2ChildAmount) - (pk1SelectableSeats + pk2SelectableSeats)} von ${pk1AdultAmount + pk1ChildAmount + pk2AdultAmount + pk2ChildAmount} Tickets platziert.` : 
                  <>Bitte wählen Sie Ihre gewünschten Tickets und deren Anzahl aus.
                  <br />
                  Platzieren Sie die Tickets daraufhin in dem Saalplan unter der Ticketauswahl.
                  </>}
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
                          {pk1AdultPrice.toLocaleString(undefined, {minimumFractionDigits: 2})} €
                        </Col>
                        <Col>
                          <Row className='justify-content-center align-items-center'>
                            <Col className='flex-grow-0'>
                              <Button onClick={handlePk1AdultRemoved} variant="secondary" className='py-0' {...(pk1AdultAmount === 0 ? {disabled: true} : null)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-dash-lg" viewBox="0 0 16 16">
                                  <path fillRule="evenodd" d="M2 8a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11A.5.5 0 0 1 2 8Z"/>
                                </svg>
                              </Button>
                            </Col>
                            <Col style={{textAlign: 'center'}} className='flex-grow-0 mx-1'>
                            {pk1AdultAmount}
                            </Col>
                            <Col className='flex-grow-0'>
                              <Button onClick={handlePk1AdultAdded} variant="secondary" className='py-0' {...(pk1AdultAmount === 9 || pk1FreeSeatsTotal === 0 ? {disabled: true} : null)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width='16' height='16' fill="currentColor" className="bi bi-plus-lg" viewBox="0 0 16 16">
                                  <path fillRule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"/>
                                </svg>
                              </Button>
                            </Col>
                          </Row>
                        </Col>
                        <Col className='text-end'>
                          {(pk1AdultAmount * pk1AdultPrice) === 0 ? '0,00' : (pk1AdultAmount * pk1AdultPrice).toLocaleString(undefined, {minimumFractionDigits: 2})} €
                        </Col>
                      </Row>
                      <hr className='m-2' />
                      <Row className='px-3 mb-4 align-items-center'>
                        <Col>
                          Kind unter 15 J
                        </Col>
                        <Col>
                          {pk1ChildPrice.toLocaleString(undefined, {minimumFractionDigits: 2})} €
                        </Col>
                        <Col className='text-center'>
                          <Row className='justify-content-center align-items-center'>
                            <Col className='flex-grow-0'>
                              <Button onClick={handlePk1ChildRemoved} variant="secondary" className='py-0' {...(pk1ChildAmount === 0 ? {disabled: true} : null)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-dash-lg" viewBox="0 0 16 16">
                                  <path fillRule="evenodd" d="M2 8a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11A.5.5 0 0 1 2 8Z"/>
                                </svg>
                              </Button>
                            </Col>
                            <Col style={{textAlign: 'center'}} className='flex-grow-0 mx-1'>
                            {pk1ChildAmount}
                            </Col>
                            <Col className='flex-grow-0'>
                              <Button onClick={handlePk1ChildAdded} variant="secondary" className='py-0' {...(pk1ChildAmount === 9 || pk1FreeSeatsTotal === 0 ? {disabled: true} : null)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width='16' height='16' fill="currentColor" className="bi bi-plus-lg" viewBox="0 0 16 16">
                                  <path fillRule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"/>
                                </svg>
                              </Button>
                            </Col>
                          </Row>
                        </Col>
                        <Col className='text-end'>
                          {(pk1ChildAmount * pk1ChildPrice) === 0 ? '0,00' : (pk1ChildAmount * pk1ChildPrice).toLocaleString(undefined, {minimumFractionDigits: 2})} €
                        </Col>
                      </Row>
                      <Row className='px-3'>
                        <Col className='text-end'>
                          <Button onClick={handleDeleteSelectionPk1} variant='danger' > Auswahl aufheben</Button>
                        </Col>
                      </Row>
                    </Tab>
                    <Tab eventKey="PK2" title="PK2">
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
                          {pk2AdultPrice.toLocaleString(undefined, {minimumFractionDigits: 2})} €
                        </Col>
                        <Col>
                          <Row className='justify-content-center align-items-center'>
                            <Col className='flex-grow-0'>
                              <Button onClick={handlePk2AdultRemoved} variant="secondary" className='py-0' {...(pk2AdultAmount === 0 ? {disabled: true} : null)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-dash-lg" viewBox="0 0 16 16">
                                  <path fillRule="evenodd" d="M2 8a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11A.5.5 0 0 1 2 8Z"/>
                                </svg>
                              </Button>
                            </Col>
                            <Col style={{textAlign: 'center'}} className='flex-grow-0 mx-1'>
                            {pk2AdultAmount}
                            </Col>
                            <Col className='flex-grow-0'>
                              <Button onClick={handlePk2AdultAdded} variant="secondary" className='py-0' {...(pk2AdultAmount === 9 || pk2FreeSeatsTotal === 0 ? {disabled: true} : null)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width='16' height='16' fill="currentColor" className="bi bi-plus-lg" viewBox="0 0 16 16">
                                  <path fillRule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"/>
                                </svg>
                              </Button>
                            </Col>
                          </Row>
                        </Col>
                        <Col className='text-end'>
                          {(pk2AdultAmount * pk2AdultPrice) === 0 ? '0,00' : (pk2AdultAmount * pk2AdultPrice).toLocaleString(undefined, {minimumFractionDigits: 2})} €
                        </Col>
                      </Row>
                      <hr className='m-2' />
                      <Row className='px-3 mb-4 align-items-center'>
                        <Col>
                          Kind unter 15 J
                        </Col>
                        <Col>
                          {pk2ChildPrice.toLocaleString(undefined, {minimumFractionDigits: 2})} €
                        </Col>
                        <Col className='text-center'>
                          <Row className='justify-content-center align-items-center'>
                            <Col className='flex-grow-0'>
                              <Button onClick={handlePk2ChildRemoved} variant="secondary" className='py-0' {...(pk2ChildAmount === 0 ? {disabled: true} : null)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-dash-lg" viewBox="0 0 16 16">
                                  <path fillRule="evenodd" d="M2 8a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11A.5.5 0 0 1 2 8Z"/>
                                </svg>
                              </Button>
                            </Col>
                            <Col style={{textAlign: 'center'}} className='flex-grow-0 mx-1'>
                            {pk2ChildAmount}
                            </Col>
                            <Col className='flex-grow-0'>
                              <Button onClick={handlePk2ChildAdded} variant="secondary" className='py-0' {...(pk2ChildAmount === 9 || pk2FreeSeatsTotal === 0 ? {disabled: true} : null)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width='16' height='16' fill="currentColor" className="bi bi-plus-lg" viewBox="0 0 16 16">
                                  <path fillRule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"/>
                                </svg>
                              </Button>
                            </Col>
                          </Row>
                        </Col>
                        <Col className='text-end'>
                          {(pk2ChildAmount * pk2ChildPrice) === 0 ? '0,00' : (pk2ChildAmount * pk2ChildPrice).toLocaleString(undefined, {minimumFractionDigits: 2})} €
                        </Col>
                      </Row>
                      <Row className='px-3'>
                        <Col className='text-end'>
                          <Button onClick={handleDeleteSelectionPk2} variant='danger' >Auswahl aufheben</Button>
                        </Col>
                      </Row>
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
                              <Col key={`seat-${s.reihe}-${s.nummer}`} className='mx-1 p-0' style={(pk1Selected && s.reihe <= 'G' && !s.reserviert) || (!pk1Selected && s.reihe > 'G' && !s.reserviert) ? {color: '#DC3646'} : {}}>
                                {s.reserviert !== false && s.reserviert !== 'userSelect' ? (
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
                                      <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                                      <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm12 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1v-1c0-1-1-4-6-4s-6 3-6 4v1a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12z" />
                                    </svg>
                                   </OverlayTrigger>
                                  ) : s.reserviert === 'userSelect' ? (
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
                                      <svg id={`${s.reihe}${s.nummer}`} onClick={handleSeatChosen} xmlns="http://www.w3.org/2000/svg" fill="#FFCA2D" className="bi bi-square-fill" viewBox="0 0 16 16">
                                        <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                                        <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm12 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1v-1c0-1-1-4-6-4s-6 3-6 4v1a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12z" />
                                      </svg>
                                    </OverlayTrigger>
                                  ): (
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
              <Row className='mt-5 justify-content-end pe-0'>
                <Col xs='auto pe-0'>
                  <Button variant="warning" onClick={handleNextClick}>Weiter</Button>
                  <SeatsModal show={seatsModalShow} onHide={handleSeatsModalHide} />
                </Col>
              </Row>
            </Row>
            {
              seatsSelected ? (
                <>
                  <Row className='py-2 fs-5' ref={checkout} style={{scrollMarginTop: 59}}>
                    <Col>
                      Details & Zusammenfassung
                    </Col>
                  </Row>
                  <Row style={{backgroundColor: '#000B22'}} className='mx-0 mb-3'>
                    <Row className='pt-4 mb-5'>
                      <Col>
                        Auf dieser Seite finden Sie einen Überblick über Ihre bisherige Auswahl.
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <div className='fw-bold mb-3'>Ihre Daten:</div>
                        <CheckoutForm chosenSeatsToBook = {chosenSeatsToBook} onHide={handleBookingModalHide} totalAmount={(pk1ChildAmount * pk1ChildPrice + pk2ChildAmount * pk2ChildPrice + pk1AdultAmount * pk1AdultPrice + pk2AdultAmount * pk2AdultPrice)} checkBoxToggled={checkBoxToggled} setFetchResult={setFetchResult} />
                      </Col>
                      <Col xs={6} className='ps-5'>
                        <Row className='mb-2'>
                          <Col className='fw-bold'>
                            Karten:
                          </Col>
                          <Col className='fw-bold text-end'>
                            Preis:
                          </Col>
                        </Row>
                        <Row className='py-2 mb-1' style={{backgroundColor: '#404B62'}}>
                          <Col>
                            Erwachsener
                          </Col>
                          <Col className='text-end'>
                            {(pk1AdultAmount * pk1AdultPrice + pk2AdultAmount * pk2AdultPrice) === 0 ? '0,00' : (pk1AdultAmount * pk1AdultPrice + pk2AdultAmount * pk2AdultPrice).toLocaleString(undefined, {minimumFractionDigits: 2})} €
                          </Col>
                        </Row>
                        <Row className='py-2' style={{backgroundColor: '#404B62'}}>
                          <Col>
                            Kind unter 15 J
                          </Col>
                          <Col className='text-end'>
                            {(pk1ChildAmount * pk1ChildPrice + pk2ChildAmount * pk2ChildPrice) === 0 ? '0,00' : (pk1ChildAmount * pk1ChildPrice + pk2ChildAmount * pk2ChildPrice).toLocaleString(undefined, {minimumFractionDigits: 2})} €
                          </Col>
                        </Row>
                        <Row className='py-2'>
                          <Col className='fw-bold'>
                            Noch zu zahlen:
                          </Col>
                          <Col className='text-end fw-bold'>
                            {(pk1ChildAmount * pk1ChildPrice + pk2ChildAmount * pk2ChildPrice + pk1AdultAmount * pk1AdultPrice + pk2AdultAmount * pk2AdultPrice) === 0 ? '0,00' : (pk1ChildAmount * pk1ChildPrice + pk2ChildAmount * pk2ChildPrice + pk1AdultAmount * pk1AdultPrice + pk2AdultAmount * pk2AdultPrice).toLocaleString(undefined, {minimumFractionDigits: 2})} €
                          </Col>
                        </Row>
                        <Row className='mt-5'>
                          <Col>
                            <CheckoutButton setCheckBoxToggled={setCheckBoxToggled} />
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <Button style={{width: '100%'}} variant="warning" onClick={handleFormSubmit}>Buchen</Button>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Row>
                </>
              ) : null
            }
          </Container>
        ) : null
      }
    
    </div>
  );
}

export default App;
