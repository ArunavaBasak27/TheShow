import React, { useState } from "react";
import MainLoader from "../../common/MainLoader.jsx";
import { Table } from "react-bootstrap";
import { useParams } from "react-router";
import {
  useDeleteShowMutation,
  useGetShowsByTheatreQuery,
} from "../../../api/showApi.js";
import ShowForm from "./ShowForm.jsx";
import moment from "moment";
import Swal from "sweetalert2";

const ShowsList = () => {
  const { theatreId } = useParams();
  const { data, isLoading } = useGetShowsByTheatreQuery(theatreId);
  const [showId, setShowId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteShow] = useDeleteShowMutation();
  const handleEdit = (showId) => {
    setIsModalOpen(true);
    setShowId(showId);
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
        const response = await deleteShow({
          _id: showId,
          theatre: theatreId,
        }).unwrap();
        console.log(response);
        try {
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
            await Swal.fire({
              position: "top-end",
              icon: "Cancelled",
              title: "Delete failed",
              text: response.message,
              showConfirmButton: false,
              timer: 1500,
            });
          }
        } catch (error) {
          await Swal.fire({
            position: "top-end",
            icon: "Cancelled",
            title: error.message,
            text: response.message,
            showConfirmButton: false,
            timer: 1500,
          });
        }
      }
    });
  };
  if (isLoading) {
    return <MainLoader />;
  } else {
    const shows = data?.result;
    console.log(shows);
    return (
      <div className="container p-3">
        <div className="row">
          <div className="col-6">Shows List</div>
          <div className="col-6 text-end">
            <button
              onClick={() => {
                setShowId(null);
                setIsModalOpen(true);
              }}
              className="btn btn-outline-primary"
            >
              <i className="bi bi-plus"></i> Add Shows
            </button>
          </div>
        </div>
        <Table className="mt-3" bordered hover size="sm" responsive="sm">
          <thead>
            <tr>
              <th>Movie</th>
              <th>Theatre</th>
              <th>Date</th>
              <th>Time</th>
              <th>Total Seats</th>
              <th>Ticket Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {shows.map((show, index) => {
              return (
                <tr key={index}>
                  <td>{show.movie.title}</td>
                  <td>{show.theatre.name}</td>
                  <td>{moment(show.date).format("DD/MM/YYYY")}</td>
                  <td>{moment(show.date).format("hh:mm A")}</td>
                  <td>{show.totalSeats}</td>
                  <td>{show.ticketPrice}</td>
                  <td>
                    <div className="d-flex flex-row gap-2">
                      <button
                        onClick={() => handleEdit(show._id)}
                        className="btn btn-outline-warning"
                      >
                        <i className="bi bi-pencil-square"></i>
                      </button>
                      <button
                        onClick={() => handleDelete(show._id)}
                        className="btn btn-outline-danger"
                      >
                        <i className="bi bi-trash-fill"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>

        <ShowForm
          show={isModalOpen}
          onHide={() => setIsModalOpen(false)}
          theatreId={theatreId}
          showId={showId}
        />
      </div>
    );
  }
};

export default ShowsList;
