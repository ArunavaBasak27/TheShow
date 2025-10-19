import React from "react";
import moment from "moment";
import DataTable from "../../common/DataTable.jsx";
import { useSelector } from "react-redux";

const BookingList = ({ bookings = [] }) => {
  const user = useSelector((state) => state.userStore.user);
  let columns = [
    {
      key: "createdAt",
      label: "Booking date",
      width: "10%",
      render: (val) => (
        <span className="text-secondary">
          {moment(val).format("MMM DD, YYYY hh:mm A")}
        </span>
      ),
    },
    {
      key: "Customer Name",
      label: "Customer Name",
      width: "10%",
      render: (val, row) => (
        <span className="fw-semibold">{row.user.name}</span>
      ),
    },
    {
      key: "Customer Email",
      label: "Email",
      width: "10%",
      render: (val, row) => row.user.email,
    },
    {
      key: "user",
      label: "Phone",
      width: "10%",
      render: (val) => val.phone,
    },
    {
      key: "Theatre name",
      label: "Theatre",
      width: "10%",
      render: (val, row) => row.show.theatre.name,
    },
    {
      key: "Movie name",
      label: "Movie",
      width: "15%",
      render: (val, row) => (
        <span className="fw-semibold">{row.show.movie.title}</span>
      ),
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

  if (user?.role === "user") {
    columns = columns.filter(
      (col) => !["Customer Name", "Email", "Phone"].includes(col.label),
    );
  }

  return (
    <DataTable
      columns={columns}
      data={bookings}
      emptyMessage="No bookings found."
    />
  );
};

export default BookingList;
