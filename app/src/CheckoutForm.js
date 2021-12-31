import { useState } from 'react';
import { Link } from 'react-router-dom';

import FloatingLabel from 'react-bootstrap/esm/FloatingLabel';
import Form from 'react-bootstrap/Form';


export function CheckoutForm(props) {
    const [validated, setValidated] = useState(false);
  
    const handleSubmit = (event) => {
      const form = event.currentTarget;
      if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
      }
  
      setValidated(true);
    };
  
    return (
         <Form id='Checkout' noValidate validated={validated} onSubmit={handleSubmit}>
            <FloatingLabel controlId="Anrede" label="Anrede" className="mb-3 text-dark">
                <Form.Select defaultValue='' required aria-label="Anrede">
                    <option disabled hidden value=""> </option>
                    <option value="1">Herr</option>
                    <option value="2">Frau</option>
                    <option value="3">Divers</option>
                </Form.Select>
                <Form.Control.Feedback type='invalid'>Bitte auswählen.</Form.Control.Feedback>
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
                <Form.Control required type="email" placeholder="E-Mail" />
                <Form.Control.Feedback type='invalid'>Bitte angeben.</Form.Control.Feedback>
            </FloatingLabel>
            <FloatingLabel controlId="Anschrift-Strasse" label="Straße Nr." className="mb-3 text-dark">
                <Form.Control required type="text" placeholder="Straße Nr." />
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
                <Form.Control.Feedback type='invalid'>Bitte auswählen.</Form.Control.Feedback>
            </FloatingLabel>
      </Form>
    );
}

export function CheckoutButton() {
    const [validated, setValidated] = useState(false);
  
    const handleSubmit = (event) => {
      const form = event.currentTarget;
      if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
      }
  
      setValidated(true);
      event.preventDefault();
      event.stopPropagation();
    };
  
    return (
        <Form id='Checkout-Box' noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
                <Form.Check required label={<>Ich stimme den <Link to='/agb' target='_blank' rel='noopener noreferrer'>AGB</Link> und der <Link to='/datenschutzerklaerung' target='_blank' rel='noopener noreferrer'>Datenschutzerklärung</Link> zu.</>} feedback="Sie müssen zustimmen, um zu buchen." feedbackType="invalid" />
            </Form.Group>
        </Form>
    );
}