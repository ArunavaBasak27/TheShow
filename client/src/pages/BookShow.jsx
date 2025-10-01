import React, { useState } from "react";
import { useParams } from "react-router";
import { useGetMovieByIdQuery } from "../api/movieApi.js";
import { useGetShowByIdQuery } from "../api/showApi.js";
import { useGetTheatreByIdQuery } from "../api/theatreApi.js";
import MainLoader from "../components/common/MainLoader.jsx";
import moment from "moment";

const BookShow = () => {
  const { movieId, showId, theatreId } = useParams();
  const { data: movieData, isLoading: movieLoading } =
    useGetMovieByIdQuery(movieId);

  const { data: showData, isLoading: showLoading } =
    useGetShowByIdQuery(showId);

  const { data: theatreData, isLoading: theatreLoading } =
    useGetTheatreByIdQuery(theatreId, { skip: !theatreId });

  const [selectedSeats, setSelectedSeats] = useState([]);

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

        {/* Seating Arrangement */}
        <div className="text-center mb-2">
          <div className="bg-secondary text-white py-1 rounded">
            Screen this side
          </div>
        </div>
        <div className="d-flex flex-column align-items-center">
          {Array.from({ length: rows }, (_, rowIndex) => (
            <div key={rowIndex} className="d-flex mb-2">
              {Array.from(
                { length: seatsPerRow },
                (_, seatIndex) => rowIndex * seatsPerRow + seatIndex + 1,
              )
                .filter((seatNo) => seatNo <= totalSeats)
                .map((seatNo) => {
                  const isBooked = bookedSeats.includes(seatNo);
                  const isSelected = selectedSeats.includes(seatNo);

                  return (
                    <button
                      key={seatNo}
                      className={`btn mx-1 ${
                        isBooked
                          ? "btn-danger"
                          : isSelected
                            ? "btn-success"
                            : "btn-outline-secondary"
                      }`}
                      style={{ width: "40px", height: "40px", padding: "6px" }}
                      onClick={() => handleSeatClick(seatNo)}
                      disabled={isBooked}
                    >
                      {seatNo}
                    </button>
                  );
                })}
            </div>
          ))}
        </div>

        {/* Selected Seats Summary */}
        <div className="mt-4 text-center">
          <h5>Selected Seats: {selectedSeats.join(", ") || "None"}</h5>
          <h6>Total Price: Rs. {selectedSeats.length * show.ticketPrice}/-</h6>
          <button
            className="btn btn-primary mt-2"
            disabled={selectedSeats.length === 0}
          >
            Proceed to Book
          </button>
        </div>
      </div>
    );
  }
};

export default BookShow;
