import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { useState } from 'react';

import Button from 'react-bootstrap/esm/Button';
import FloatingLabel from 'react-bootstrap/esm/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';


export function CheckoutForm(props) {
    const [validated, setValidated] = useState(false);
    const [bookingSucceeded, setBookingSucceeded] = useState(false);

    const { user, getAccessTokenSilently } = useAuth0();

    const handleSubmit = (event) => {
      const form = event.currentTarget;
      event.preventDefault();
      event.stopPropagation();
      
      if (form.checkValidity() === false) {
        setValidated(true);
        return;
      }
      
      setValidated(true);

      if (props.checkBoxToggled) {
        getAccessTokenSilently().then(res => {
            fetch('https://fallstudie-gruppe-3.herokuapp.com/sitzplaetze/checkout', {
                method: 'PUT',
                headers: {
                  Authorization: `Bearer ${res}`,
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({ sitzplaetze: props.chosenSeatsToBook.map(e => ({...e, wert: 'r' + user.sub})), kunde: {vorname: document.getElementById('Vorname').value, email: document.getElementById('E-Mail').value}, pkAuswahl: {kind1: props.totalSeatsAmount.pk1ChildAmount, kind2: props.totalSeatsAmount.pk2ChildAmount, erwachsener1: props.totalSeatsAmount.pk1AdultAmount, erwachsener2: props.totalSeatsAmount.pk2AdultAmount} })
              })
                .then((result) => {
                  if (!result.ok) {
                    props.setBookingModalShow(true);
                    return;
                  }
                  
                  setBookingSucceeded(true);
                  props.setBookingModalShow(true);
                }, (error) => {
                    props.setFetchResult('Init Fetch Failed!');
                });
        }, (err) => {
            props.setFetchResult('Init Fetch Failed!');
        });
      }
    };

  

    return (
        <>
         <Form id='Checkout' noValidate validated={validated} onSubmit={handleSubmit}>
            <FloatingLabel controlId="Anrede" label="Anrede" className="mb-3 text-dark">
                <Form.Select defaultValue='' required aria-label="Anrede">
                    <option disabled hidden value=""> </option>
                    <option value="1">Herr</option>
                    <option value="2">Frau</option>
                    <option value="3">Divers</option>
                </Form.Select>
                <Form.Control.Feedback type='invalid'>Bitte ausw??hlen.</Form.Control.Feedback>
            </FloatingLabel>
            <FloatingLabel controlId="Vorname" label="Vorname" className="mb-3 text-dark">
                <Form.Control required type="text" placeholder="Vorname" />
                <Form.Control.Feedback type='invalid'>Bitte angeben.</Form.Control.Feedback>
            </FloatingLabel>
            <FloatingLabel controlId="Nachname" label="Nachname" className="mb-3 text-dark">
                <Form.Control required type="text" placeholder="Nachname" />
                <Form.Control.Feedback type='invalid'>Bitte angeben.</Form.Control.Feedback>
            </FloatingLabel>
            <FloatingLabel controlId="E-Mail" label="E-Mail" className="mb-3 text-dark">
                <Form.Control required type="email" placeholder="E-Mail" defaultValue={user.email} />
                <Form.Control.Feedback type='invalid'>Bitte angeben.</Form.Control.Feedback>
            </FloatingLabel>
            <FloatingLabel controlId="Anschrift-Strasse" label="Stra??e Nr." className="mb-3 text-dark">
                <Form.Control required type="text" placeholder="Stra??e Nr." />
                <Form.Control.Feedback type='invalid'>Bitte angeben.</Form.Control.Feedback>
            </FloatingLabel>
            <FloatingLabel controlId="Anschrift-Ort" label="PLZ Ort" className="mb-3 text-dark">
                <Form.Control required type="text" placeholder="PLZ Ort" />
                <Form.Control.Feedback type='invalid'>Bitte angeben.</Form.Control.Feedback>
            </FloatingLabel>
            <FloatingLabel controlId="Land" label="Land" className="mb-5 text-dark">
                <Form.Control required type="text" placeholder="Land" />
                <Form.Control.Feedback type='invalid'>Bitte angeben.</Form.Control.Feedback>
            </FloatingLabel>
            <div className='fw-bold mb-3'>
                Zahlung:
            </div>
            <FloatingLabel controlId="Zahlungsmittel" label="Zahlungsmittel" className="mb-3 text-dark">
                <Form.Select defaultValue='' required aria-label="Zahlungsmittel">
                    <option  disabled hidden value=""> </option>
                    <option value="1">Vor Ort bezahlen</option>
                </Form.Select>
                <Form.Control.Feedback type='invalid'>Bitte ausw??hlen.</Form.Control.Feedback>
            </FloatingLabel>
      </Form>
      {
        bookingSucceeded ? (
            <Modal
            show={props.bookingModalShow}
            onHide={props.onHide[0]}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            className='text-dark'
            >
                <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Vielen Dank f??r Ihre Reservierung
                </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h4>Buchung erfolgreich</h4>
                    <p>
                        Ihre Buchung war erfolgreich.
                        <br />
                        Sie erhalten Ihre Tickets in K??rze per E-Mail.
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='warning' onClick={props.onHide[0]}>Schlie??en</Button>
                </Modal.Footer>
            </Modal>
        ) : (
            <Modal
            show={props.bookingModalShow}
            onHide={props.onHide[1]}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            className='text-dark'
            >
                <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Bitte starten Sie erneut
                </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h4>Sitzplatz belegt</h4>
                    <p>
                        Einer oder mehrere der von Ihnen ausgew??hlten Sitzpl??tze wurden in der Zwischenzeit belegt.
                        <br />
                        Bitte starten Sie erneut.
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='warning' onClick={props.onHide[1]}>Schlie??en</Button>
                </Modal.Footer>
            </Modal>
        )
      }
      </>
    );
}

export function CheckoutButton(props) {
    const [validated, setValidated] = useState(false);
  
    const handleSubmit = (event) => {
      const form = event.currentTarget;
      event.preventDefault();
      event.stopPropagation();
      
      if (form.checkValidity() !== false) {
        setValidated(true);
      } 

      setValidated(true);
    };
  
    return (
        <Form id='Checkout-Box' noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
                <Form.Check required onChange={(e) => props.setCheckBoxToggled(e.currentTarget.checked)} label={<>Ich stimme den <Link to='/agb' target='_blank' rel='noopener noreferrer'>AGB</Link> und der <Link to='/datenschutzerklaerung' target='_blank' rel='noopener noreferrer'>Datenschutzerkl??rung</Link> zu.</>} feedback="Sie m??ssen zustimmen, um zu buchen." feedbackType="invalid" />
            </Form.Group>
        </Form>
    );
}