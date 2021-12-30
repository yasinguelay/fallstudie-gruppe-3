import { useState } from 'react';

import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import FloatingLabel from 'react-bootstrap/esm/FloatingLabel';
import FormGroup from 'react-bootstrap/esm/FormGroup';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';


export default function CheckoutForm() {
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
         <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <FloatingLabel controlId="Anrede" label="Anrede" className="mb-3 text-dark">
                <Form.Select required aria-label="Anrede">
                    <option  disabled selected hidden value=""></option>
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
                <Form.Select required aria-label="Zahlungsmittel">
                    <option  disabled selected hidden value=""></option>
                    <option value="1">Vor Ort bezahlen</option>
                </Form.Select>
                <Form.Control.Feedback type='invalid'>Bitte auswählen.</Form.Control.Feedback>
            </FloatingLabel>
          
            <Form.Group className="mb-3">
                <Form.Check required label="Agree to terms and conditions" feedback="You must agree before submitting." feedbackType="invalid" />
            </Form.Group>
            
            <Button type="submit">Submit form</Button>
      </Form>
    );
}