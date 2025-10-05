import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";

const CheckoutForm = ({ show, onHide, successUrl, ticketPrice }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: successUrl,
      },
    });

    if (error?.type === "card_error" || error?.type === "validation_error") {
      setMessage(error.message);
    } else {
      setMessage("An unexpected error occurred.");
    }

    setIsLoading(false);
  };

  const paymentElementOptions = {
    layout: "tabs",
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Booking</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form id="payment-form" onSubmit={handleSubmit} className="px-2 py-3">
          <PaymentElement
            id="payment-element"
            options={paymentElementOptions}
            className="mb-4"
          />

          <button
            type="submit"
            className={`btn btn-success w-100 ${isLoading || !stripe || !elements ? "disabled" : ""}`}
            disabled={isLoading || !stripe || !elements}
            id="submit"
          >
            {isLoading ? (
              <div
                className="spinner-border spinner-border-sm text-light"
                role="status"
                aria-hidden="true"
              ></div>
            ) : (
              `Proceed to pay Rs.${ticketPrice}`
            )}
          </button>

          {message && (
            <div
              id="payment-message"
              className="alert alert-danger mt-3 text-center"
              role="alert"
            >
              {message}
            </div>
          )}
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default CheckoutForm;
