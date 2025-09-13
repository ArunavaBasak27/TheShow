import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import inputHelper from "../../../helper/inputHelper.js";
import {
  useCreateTheatreMutation,
  useGetTheatreByIdQuery,
  useUpdateTheatreMutation,
} from "../../../api/theatreApi.js";
import toastNotify from "../../../helper/toastNotify.js";

const TheatreForm = (props) => {
  const theatreId = props.theatreId;
  const initialState = {
    name: "",
    email: "",
    address: "",
    phone: "",
    isActive: false,
  };
  const [userInput, setUserInput] = useState(initialState);
  const { data, isLoading } = useGetTheatreByIdQuery(theatreId, {
    skip: !theatreId,
  });
  const [createTheatre] = useCreateTheatreMutation();
  const [updateTheatre] = useUpdateTheatreMutation();
  const handleInputChange = (e) => {
    const tempData = inputHelper(e, userInput);
    setUserInput(tempData);
  };

  useEffect(() => {
    if (props.show) {
      if (!theatreId) {
        setUserInput(initialState);
      } else if (!isLoading && data?.result) {
        setUserInput(data?.result);
      }
    }
  }, [props.show, props?.theatreId, data, isLoading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (theatreId) {
        response = await updateTheatre(userInput).unwrap();
      } else {
        response = await createTheatre(userInput).unwrap();
      }
      if (response.success) {
        toastNotify({ message: response.message, type: "success" });
        setUserInput(initialState);
        props.onHide();
      } else {
        toastNotify({ message: response.message, type: "error" });
      }
    } catch (error) {
      toastNotify({ message: error.message, type: "error" });
    }
  };

  return (
    <Modal
      onHide={props.onHide}
      show={props.show}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {theatreId ? "Update" : "Create"} theatre
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row">
          <div className="col-md-12 mb-3">
            <label htmlFor="name" className="form-label">
              Name
            </label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              value={userInput.name}
              onChange={handleInputChange}
            />
          </div>
          <div className="col-md-12 mb-3">
            <label htmlFor="address" className="form-label">
              Address
            </label>
            <textarea
              className="form-control"
              id="address"
              name="address"
              rows="3"
              value={userInput.address}
              onChange={handleInputChange}
            ></textarea>
          </div>

          <div className="col-md-4 mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              className="form-control"
              id="email"
              name="email"
              value={userInput.email}
              onChange={handleInputChange}
            />
          </div>
          <div className="col-md-4 mb-3">
            <label htmlFor="phone" className="form-label">
              Phone
            </label>
            <input
              className="form-control"
              type="tel"
              id="phone"
              name="phone"
              value={userInput.phone}
              onChange={handleInputChange}
            />
          </div>
          <div className="col-md-4 mb-6 d-flex align-items-center">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="isActive"
                name="isActive"
                value={userInput.isActive}
                checked={userInput.isActive}
                onChange={handleInputChange}
              />
              <label className="form-check-label" htmlFor="isActive">
                Active
              </label>
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer className="d-flex flex-row justify-content-center">
        <button onClick={handleSubmit} className="btn btn-outline-success">
          {theatreId ? "Update" : "Submit"}
        </button>
        <button onClick={props.onHide} className="btn btn-outline-primary">
          Close
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default TheatreForm;
