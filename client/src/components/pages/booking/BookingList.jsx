import React from "react";
import { Table } from "react-bootstrap";
import moment from "moment";

const BookingList = ({ bookings = [] }) => {
  console.log(bookings);
  return (
    <div>
      <Table className="mt-5" hover size="sm" responsive="sm">
        <thead>
          <tr>
            <th>Customer Name</th>
            <th>Customer Email</th>
            <th>Customer Phone</th>
            <th>Theatre Name</th>
            <th>Movie Name</th>
            <th>Show Timings</th>
            <th>Booked Seats</th>
          </tr>
        </thead>
        <tbody className="table-group-divider">
          {bookings.map((booking, index) => {
            return (
              <tr key={index}>
                <td>{booking.user.name}</td>
                <td>{booking.user.email}</td>
                <td>{booking.user.phone}</td>
                <td>{booking.show.theatre.name}</td>
                <td>{booking.show.movie.title}</td>
                <td>
                  {moment(booking.show.date).format("DD-MM-YYYY")} at{" "}
                  {moment(booking.show.date).format("hh:mm A")}
                </td>
                <td>{booking.seats.join(",")}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
};

export default BookingList;
