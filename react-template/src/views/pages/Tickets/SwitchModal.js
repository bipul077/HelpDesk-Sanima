import React from "react";
import { Button, Modal } from "react-bootstrap";

const SwitchModal = ({ showModal, handleCloseModal,method,dept }) => {
    const handleSwitch = async () => {
        await method();
        handleCloseModal();
      };
  return (
    <div>
      <Modal show={showModal} onHide={handleCloseModal} style={{ zIndex: 10000 }}>
        <Modal.Header>
          <Modal.Title>Delete</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>Are you sure you want to switch this Ticket to {dept}?</p>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="success" onClick={()=>handleSwitch()} >
            Yes
          </Button>
          <Button variant="primary" onClick={handleCloseModal}>
            No
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SwitchModal;
