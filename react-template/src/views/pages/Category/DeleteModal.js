import React from "react";
import { Button, Modal } from "react-bootstrap";

const DeleteModal = ({ showModal, handleCloseModal,method }) => {
    const handleDelete = async () => {
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
          <p>Are you sure you want to delete?</p>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="success" onClick={()=>handleDelete()} >
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

export default DeleteModal;
