import React from "react";
import { Modal } from "react-bootstrap";
import Swal from "sweetalert2";
import { useCreateBookingMutation } from "../../../api/bookingApi.js";
import { useNavigate, useParams } from "react-router";

const ConfirmBooking = ({ show, onHide, seats }) => {
  const [createBooing] = useCreateBookingMutation();
  const { showId } = useParams();
  const navigate = useNavigate();
  const handleSubmit = async () => {
    try {
      const response = await createBooing({ show: showId, seats }).unwrap();
      if (response.success) {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Booking successful",
          showConfirmButton: false,
          timer: 1500,
        });
        onHide();
        navigate("/");
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: error.message,
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };
  return (
    <div>
      <Modal show={show} onHide={onHide} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Confirm Booking
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            You have chosen seats : <strong>{seats.join(",")}</strong>
          </p>
          <em>Are you sure to you want to book these seats?</em>
        </Modal.Body>
        <Modal.Footer className="d-flex flex-row justify-content-center">
          <button onClick={handleSubmit} className="btn btn-outline-success">
            Confirm
          </button>
          <button onClick={onHide} className="btn btn-outline-primary">
            Cancel
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ConfirmBooking;
