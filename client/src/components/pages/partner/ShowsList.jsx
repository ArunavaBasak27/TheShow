import React, { useState } from "react";
import { useParams } from "react-router";
import moment from "moment";
import Swal from "sweetalert2";
import ShowForm from "./ShowForm.jsx";
import DataTable from "../../common/DataTable.jsx";
import Pagination from "../../common/Pagination.jsx";

import {
  useDeleteShowMutation,
  useGetShowsByTheatreQuery,
} from "../../../api/showApi.js";

const ShowsList = () => {
  const [page, setPage] = useState(1);
  const { theatreId } = useParams();
  const { data, isLoading } = useGetShowsByTheatreQuery({ theatreId, page });
  const [showId, setShowId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteShow] = useDeleteShowMutation();

  const handleEdit = (id) => {
    setShowId(id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const response = await deleteShow({
          _id: id,
          theatre: theatreId,
        }).unwrap();
        if (response.success) {
          await Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Deleted",
            text: response.message,
            showConfirmButton: false,
            timer: 1500,
          });
        } else {
          throw new Error(response.message);
        }
      } catch (error) {
        await Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Delete failed",
          text: error.message || "Something went wrong!",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    }
  };

  const shows = data?.result || [];

  const columns = [
    {
      key: "movie",
      label: "Movie",
      width: "20%",
      render: (val) => <span className="fw-semibold">{val.title}</span>,
    },
    {
      key: "theatre",
      label: "Theatre",
      width: "18%",
      render: (val) => val.name,
    },
    {
      key: "date",
      label: "Date",
      width: "12%",
      render: (val) => moment(val).format("MMM DD, YYYY"),
    },
    {
      key: "date",
      label: "Time",
      width: "12%",
      render: (val) => (
        <span className="badge bg-primary">
          {moment(val).format("hh:mm A")}
        </span>
      ),
    },
    {
      key: "totalSeats",
      label: "Total Seats",
      width: "12%",
      render: (val) => (
        <>
          <i className="bi bi-people me-1"></i>
          {val}
        </>
      ),
    },
    {
      key: "ticketPrice",
      label: "Ticket Price",
      width: "12%",
      render: (val) => <span className="text-success fw-semibold">₹{val}</span>,
    },
  ];

  return (
    <div className="container py-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
        <h4 className="fw-bold mb-0">
          {/* Shows for {data?.result[0].theatre.name} */}
        </h4>
        <button
          className="btn btn-outline-primary"
          style={{ minWidth: "150px" }}
          onClick={() => {
            setShowId(null);
            setIsModalOpen(true);
          }}
        >
          <i className="bi bi-plus-lg me-2"></i> Add Show
        </button>
      </div>

      <DataTable
        columns={columns}
        data={shows}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        emptyMessage="No shows found. Add your first show to get started!"
      />

      {data?.total_pages > 1 && (
        <div className="d-flex justify-content-center mt-4">
          <Pagination
            totalPages={data.total_pages}
            currentPage={page}
            onPageChange={(page) => setPage(page)}
          />
        </div>
      )}

      <ShowForm
        show={isModalOpen}
        onHide={() => setIsModalOpen(false)}
        theatreId={theatreId}
        showId={showId}
      />
    </div>
  );
};

export default ShowsList;
