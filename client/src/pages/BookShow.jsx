import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { useGetMovieByIdQuery } from "../api/movieApi.js";
import { useGetShowByIdQuery } from "../api/showApi.js";
import { useGetTheatreByIdQuery } from "../api/theatreApi.js";
import MainLoader from "../components/common/MainLoader.jsx";
import moment from "moment";
import CheckoutForm from "../components/pages/booking/CheckoutForm.jsx";
import { useSelector } from "react-redux";
import {
  useCreateBookingMutation,
  useInitiatePaymentMutation,
} from "../api/bookingApi.js";
import toastNotify from "../helper/toastNotify.js";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
const BookShow = () => {
  const { movieId, showId, theatreId } = useParams();
  const user = useSelector((state) => state.userStore.user);
  const [modalShow, setModalShow] = React.useState(false);
  const { data: movieData, isLoading: movieLoading } =
    useGetMovieByIdQuery(movieId);

  const { data: showData, isLoading: showLoading } = useGetShowByIdQuery(
    showId,
    {
      refetchOnMountOrArgChange: true,
    },
  );

  const { data: theatreData, isLoading: theatreLoading } =
    useGetTheatreByIdQuery(theatreId, { skip: !theatreId });

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [initiatePayment] = useInitiatePaymentMutation();
  const [createBooking] = useCreateBookingMutation();
  const [clientSecret, setClientSecret] = useState("");
  const appearance = {
    theme: "stripe",
  };
  // Enable the skeleton loader UI for optimal loading.
  const loader = "auto";
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  useEffect(() => {
    async function completeBooking() {
      const transactionId = searchParams.get("payment_intent");
      if (transactionId) {
        const response = await createBooking({ transactionId }).unwrap();
        if (response) {
          navigate("/user");
          toastNotify({ message: "Booking successful", type: "success" });
        } else {
          toastNotify({ message: "Booking failed", type: "error" });
        }
      }
    }

    completeBooking();
  }, [searchParams]);

  const handleBooking = async () => {
    try {
      const response = await initiatePayment({
        showId,
        seats: selectedSeats,
      }).unwrap();
      console.log(response);
      if (response.success) {
        setClientSecret(response.result);
      } else {
        throw new Error(response.message);
      }
      setModalShow(true);
    } catch (error) {
      toastNotify({ message: error.message, type: "error" });
    }
  };
  if (movieLoading || showLoading || theatreLoading) {
    return <MainLoader />;
  } else {
    const movie = movieData?.result;
    const show = showData?.result;
    const theatre = theatreData?.result;

    const totalSeats = show.totalSeats || 0;
    const bookedSeats = show.bookedSeats || [];
    // Assume 10 seats per row (can adjust as needed)
    const seatsPerRow = 15;
    const rows = Math.ceil(totalSeats / seatsPerRow);

    const handleSeatClick = (seatNo) => {
      if (bookedSeats.includes(seatNo)) return; // can't select booked seat
      if (selectedSeats.includes(seatNo)) {
        setSelectedSeats(selectedSeats.filter((s) => s !== seatNo));
      } else {
        setSelectedSeats([...selectedSeats, seatNo]);
      }
    };

    return (
      <div className="container my-3 ">
        {/* Movie and Show Info */}
        <div className="d-flex flex-row justify-content-between align-items-end mb-4">
          <div>
            <h4>{movie.title}</h4>
            <p>
              {theatre.name}, {theatre.address}
            </p>
          </div>
          <div>
            <p className="mb-0">
              Date & Time:{" "}
              <strong>
                {moment(show.date).format("MMM Do YYYY")} at{" "}
                {moment(show.date).format("hh:mm A")}
              </strong>
            </p>
            <p className="mb-0">
              Ticket price: <strong>Rs. {show.ticketPrice}/-</strong>
            </p>
            <p className="mb-0">
              Total seats: <strong>{show.totalSeats}</strong>
            </p>
            <p className="mb-0">
              Available Seats:{" "}
              <strong>{show.totalSeats - show.bookedSeats.length}</strong>
            </p>
          </div>
        </div>

        {/* Seating Layout */}
        <div className="text-center mb-3">
          <div className="bg-secondary text-white py-1 rounded">
            Screen this side
          </div>
        </div>

        {/* Scrollable Grid Container */}
        <div className="overflow-auto w-100 d-flex justify-content-start">
          <div
            className="d-grid gap-2 mx-auto"
            style={{
              gridTemplateColumns: "repeat(15, 1fr)", // 15 seats per row
              width: "600px", // fixed block width
            }}
          >
            {Array.from({ length: totalSeats }, (_, index) => {
              const seatNo = index + 1;
              const isBooked = bookedSeats.includes(seatNo.toString());
              const isSelected = selectedSeats.includes(seatNo);

              return (
                <button
                  key={seatNo}
                  className={`btn btn-sm ${
                    isBooked
                      ? "btn-danger"
                      : isSelected
                        ? "btn-success"
                        : "btn-outline-secondary"
                  }`}
                  style={{ width: "40px", height: "40px", fontSize: "0.8rem" }}
                  onClick={() => handleSeatClick(seatNo)}
                  disabled={isBooked}
                >
                  {seatNo}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Seats Summary */}
        <div className="mt-4 text-center">
          <h5>Selected Seats: {selectedSeats.join(", ") || "None"}</h5>
          <h6>Total Price: Rs. {selectedSeats.length * show.ticketPrice}/-</h6>
          <button
            className="btn btn-success mt-2"
            onClick={handleBooking}
            disabled={selectedSeats.length === 0 || !user}
          >
            Proceed to Book
          </button>
        </div>
        {clientSecret && (
          <Elements
            options={{ clientSecret, appearance, loader }}
            stripe={stripePromise}
          >
            <CheckoutForm
              show={modalShow}
              onHide={() => setModalShow(false)}
              successUrl={window.location.href}
              ticketPrice={show.ticketPrice * selectedSeats.length}
            />
          </Elements>
        )}
      </div>
    );
  }
};

export default BookShow;
