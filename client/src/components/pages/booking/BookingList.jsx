import React from "react";
import moment from "moment";
import DataTable from "../../common/DataTable.jsx";

const BookingList = ({ bookings = [] }) => {
  const columns = [
    {
      key: "user",
      label: "Customer Name",
      width: "15%",
      render: (val) => <span className="fw-semibold">{val.name}</span>,
    },
    {
      key: "user",
      label: "Email",
      width: "18%",
      render: (val) => val.email,
    },
    {
      key: "user",
      label: "Phone",
      width: "12%",
      render: (val) => val.phone,
    },
    {
      key: "show",
      label: "Theatre",
      width: "15%",
      render: (val) => val.theatre.name,
    },
    {
      key: "show",
      label: "Movie",
      width: "15%",
      render: (val) => <span className="fw-semibold">{val.movie.title}</span>,
    },
    {
      key: "show",
      label: "Show Timings",
      width: "15%",
      render: (val) => (
        <div>
          <div className="mb-1">
            <i className="bi bi-calendar-event me-1 text-primary"></i>
            <span>{moment(val.date).format("MMM DD, YYYY")}</span>
          </div>
          <div>
            <i className="bi bi-clock me-1 text-success"></i>
            <span className="fw-semibold">
              {moment(val.date).format("hh:mm A")}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "seats",
      label: "Booked Seats",
      width: "10%",
      render: (val) => (
        <div className="d-flex flex-wrap gap-1">
          {val.map((seat, idx) => (
            <span key={idx} className="badge bg-success">
              {seat}
            </span>
          ))}
        </div>
      ),
    },
  ];

  return (
    <div className="container py-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
        <h4 className="fw-bold mb-0">Booking List</h4>
      </div>

      <DataTable
        columns={columns}
        data={bookings}
        emptyMessage="No bookings found."
      />
    </div>
  );
};

export default BookingList;
