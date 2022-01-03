import { useAuth0 } from '@auth0/auth0-react';

import Button from 'react-bootstrap/esm/Button';
import Modal from 'react-bootstrap/Modal';


export default function SeatsModal(props) {
    const { isAuthenticated } = useAuth0();
    
    return isAuthenticated ? (
        <Modal
        {...props}
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
                    Einer oder mehrere der von Ihnen ausgewählten Sitzplätze wurden in der Zwischenzeit belegt.
                    <br />
                    Bitte starten Sie erneut.
                </p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant='warning' onClick={props.onHide[0]}>Schließen</Button>
            </Modal.Footer>
        </Modal>
    ) : (
        <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className='text-dark'
        >
            <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
                Bitte loggen Sie sich ein
            </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h4>Login benötigt</h4>
                <p>
                    Loggen Sie sich bitte ein, um fortzufahren.
                </p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant='warning' onClick={props.onHide[1]}>Login</Button>
            </Modal.Footer>
        </Modal>
    );
}