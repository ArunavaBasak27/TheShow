import React from "react";
import { Table } from "react-bootstrap";

const BookingsTable = () => {
  return (
    <div>
      <Table className="mt-5" bordered hover size="sm" responsive="sm">
        <thead>
          <tr>
            <th>Customer Name</th>
            <th>Theatre Name</th>
            <th>Movie Name</th>
            <th>Show Timings</th>
            <th>Booked Seats</th>
          </tr>
        </thead>
      </Table>
    </div>
  );
};

export default BookingsTable;
