import Button from 'react-bootstrap/esm/Button';
import Modal from 'react-bootstrap/Modal';


export default function SeatsModal(props) {
    return (
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
                <Button variant='warning' onClick={props.onHide}>Schließen</Button>
            </Modal.Footer>
        </Modal>
    );
}