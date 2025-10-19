import React, { useState } from "react";
import { Table } from "react-bootstrap";
import { useParams } from "react-router";
import moment from "moment";
import Swal from "sweetalert2";

import MainLoader from "../../common/MainLoader.jsx";
import ShowForm from "./ShowForm.jsx";

import {
  useDeleteShowMutation,
  useGetShowsByTheatreQuery,
} from "../../../api/showApi.js";
import Pagination from "../../common/Pagination.jsx";

const ShowsList = () => {
  const [page, setPage] = useState(1);

  const { theatreId } = useParams();
  const { data, isLoading } = useGetShowsByTheatreQuery({ theatreId, page });
  const [showId, setShowId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteShow] = useDeleteShowMutation();

  const handleEdit = (showId) => {
    setShowId(showId);
    setIsModalOpen(true);
  };

  const handleDelete = async (showId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await deleteShow({
            _id: showId,
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
    });
  };

  if (isLoading) {
    return <MainLoader />;
  }

  const shows = data?.result || [];

  return (
    <div className="container py-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
        <h4 className="fw-bold mb-0">
          Shows for {data?.result[0].theatre.name}
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

      <div className="table-responsive">
        <Table bordered hover className="align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th style={{ width: "20%" }}>Movie</th>
              <th style={{ width: "18%" }}>Theatre</th>
              <th style={{ width: "12%" }}>Date</th>
              <th style={{ width: "12%" }}>Time</th>
              <th style={{ width: "12%" }}>Total Seats</th>
              <th style={{ width: "12%" }}>Ticket Price</th>
              <th style={{ width: "140px" }} className="text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {shows.length > 0 ? (
              shows.map((show) => (
                <tr key={show._id}>
                  <td className="fw-semibold">{show.movie.title}</td>
                  <td>{show.theatre.name}</td>
                  <td>{moment(show.date).format("MMM DD, YYYY")}</td>
                  <td>
                    <span className="badge bg-primary">
                      {moment(show.date).format("hh:mm A")}
                    </span>
                  </td>
                  <td>
                    <i className="bi bi-people me-1"></i>
                    {show.totalSeats}
                  </td>
                  <td className="text-success fw-semibold">
                    ₹{show.ticketPrice}
                  </td>
                  <td>
                    <div className="d-flex gap-2 justify-content-center">
                      <button
                        onClick={() => handleEdit(show._id)}
                        className="btn btn-sm btn-warning"
                        title="Edit"
                      >
                        <i className="bi bi-pencil-square"></i>
                      </button>
                      <button
                        onClick={() => handleDelete(show._id)}
                        className="btn btn-sm btn-danger"
                        title="Delete"
                      >
                        <i className="bi bi-trash-fill"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-5 text-muted">
                  <div>
                    <i className="bi bi-film fs-1 d-block mb-3"></i>
                    <p className="mb-0">
                      No shows found. Add your first show to get started!
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
      {data?.total_pages > 1 && (
        <div className="d-flex justify-content-center mt-4">
          <Pagination
            totalPages={data.total_pages}
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
