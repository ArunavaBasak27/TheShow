import React from "react";
import { Button, Modal } from "react-bootstrap";

const MovieForm = (props) => {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Modal heading
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row">
          <div className="col-md-6">
            <div className="mb-3">
              <label htmlFor="formGroupExampleInput" className="form-label">
                Example label
              </label>
              <input
                type="text"
                className="form-control"
                id="formGroupExampleInput"
                placeholder="Example input placeholder"
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label htmlFor="formGroupExampleInput2" className="form-label">
                Another label
              </label>
              <input
                type="text"
                className="form-control"
                id="formGroupExampleInput2"
                placeholder="Another input placeholder"
              />
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default MovieForm;
