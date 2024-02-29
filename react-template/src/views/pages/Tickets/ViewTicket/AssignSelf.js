import React from 'react';
import { Button, Modal } from "react-bootstrap";

const AssignSelf = ({showModal, handleCloseModal,method}) => {
    const handleAssign = async () => {
        await method();
        handleCloseModal();
      };
  return (
    <div>
      <Modal show={showModal} onHide={handleCloseModal} style={{ zIndex: 10000 }}>
        <Modal.Header>
          <Modal.Title>Assign Yourself</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>Are you sure you want to assign this ticket to yourself?</p>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="success" onClick={()=>handleAssign()} >
            Yes
          </Button>
          <Button variant="primary" onClick={handleCloseModal}>
            No
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default AssignSelf
