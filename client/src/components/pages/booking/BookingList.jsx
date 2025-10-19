import React from "react";
import { Table } from "react-bootstrap";
import moment from "moment";

const BookingList = ({ bookings = [] }) => {
  return (
    <div className="container py-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
        <h4 className="fw-bold mb-0">Booking List</h4>
      </div>

      <div className="table-responsive">
        <Table bordered hover className="align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th style={{ width: "15%" }}>Customer Name</th>
              <th style={{ width: "18%" }}>Email</th>
              <th style={{ width: "12%" }}>Phone</th>
              <th style={{ width: "15%" }}>Theatre</th>
              <th style={{ width: "15%" }}>Movie</th>
              <th style={{ width: "15%" }}>Show Timings</th>
              <th style={{ width: "10%" }}>Booked Seats</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length > 0 ? (
              bookings.map((booking) => (
                <tr key={booking._id || booking.id}>
                  <td className="fw-semibold">{booking.user.name}</td>
                  <td>{booking.user.email}</td>
                  <td>{booking.user.phone}</td>
                  <td>{booking.show.theatre.name}</td>
                  <td className="fw-semibold">{booking.show.movie.title}</td>
                  <td>
                    <div>
                      <div className="mb-1">
                        <i className="bi bi-calendar-event me-1 text-primary"></i>
                        <span>
                          {moment(booking.show.date).format("MMM DD, YYYY")}
                        </span>
                      </div>
                      <div>
                        <i className="bi bi-clock me-1 text-success"></i>
                        <span className="fw-semibold">
                          {moment(booking.show.date).format("hh:mm A")}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="d-flex flex-wrap gap-1">
                      {booking.seats.map((seat, idx) => (
                        <span key={idx} className="badge bg-success">
                          {seat}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-5 text-muted">
                  <div>
                    <i className="bi bi-ticket-perforated fs-1 d-block mb-3"></i>
                    <p className="mb-0">No bookings found.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default BookingList;
