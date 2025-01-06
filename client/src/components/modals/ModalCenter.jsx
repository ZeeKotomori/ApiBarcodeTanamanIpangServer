// Bootstrap
import Modal from 'react-bootstrap/Modal';

export default function ModalCenter({ show, feature, onHide, children }) {
    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>{feature}</Modal.Header>
            <Modal.Body>{children}</Modal.Body>
        </Modal>
    )
};