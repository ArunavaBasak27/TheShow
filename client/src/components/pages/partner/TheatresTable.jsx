import React, { useState } from "react";
import { Table } from "react-bootstrap";
import MainLoader from "../../common/MainLoader.jsx";
import {
  useDeleteTheatreMutation,
  useGetTheatresByOwnerQuery,
} from "../../../api/theatreApi.js";
import TheatreForm from "./TheatreForm.jsx";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";

const TheatresTable = () => {
  const user = useSelector((state) => state.userStore.user);
  const { data, isLoading } = useGetTheatresByOwnerQuery(user.id);
  const [deleteTheatre] = useDeleteTheatreMutation();
  const [modalShow, setModalShow] = useState(false);
  const [theatreId, setTheatreId] = useState(null);
  if (isLoading) {
    return <MainLoader />;
  }

  const handleEdit = (theatreId) => {
    setModalShow(true);
    setTheatreId(theatreId);
  };
  const handleDelete = (theatreId) => {
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
          const response = await deleteTheatre(theatreId).unwrap();
          if (response.success) {
            await Swal.fire({
              position: "top-end",
              icon: "success",
              title: "Deleted",
              text: response.message,
              showConfirmButton: false,
              timer: 1500,
            });
            setModalShow(false);
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
            title: "Delete failed",
            text: error.message,
            showConfirmButton: false,
            timer: 1500,
          });
        }
      }
    });
  };
  const handleCreate = () => {
    setModalShow(true);
    setTheatreId(null);
  };
  return (
    <div className="container m-3 p-3">
      <button className="btn btn-outline-primary" onClick={handleCreate}>
        <i className="bi bi-plus"></i> Add Theatre
      </button>
      <Table className="mt-5" bordered hover size="sm" responsive="sm">
        <thead>
          <tr>
            <th>Name</th>
            <th>Address</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.result &&
            data.result.map((theatre, index) => {
              return (
                <tr key={index}>
                  <td>{theatre.name}</td>
                  <td>{theatre.address}</td>
                  <td>{theatre.phone}</td>
                  <td>{theatre.email}</td>
                  <td>
                    <div className="d-flex flex-row gap-2">
                      <button
                        onClick={() => handleEdit(theatre._id)}
                        className="btn btn-outline-warning"
                      >
                        <i className="bi bi-pencil-square"></i>
                      </button>
                      <button
                        onClick={() => handleDelete(theatre._id)}
                        className="btn btn-outline-danger"
                      >
                        <i className="bi bi-trash-fill"></i>
                      </button>
                      {theatre.isActive && theatre.isApproved && (
                        <button
                          onClick={() => handleDelete(theatre._id)}
                          className="btn btn-outline-danger"
                        >
                          <i className="bi bi-plus"></i>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </Table>

      <TheatreForm
        show={modalShow}
        onHide={() => setModalShow(false)}
        theatreId={theatreId}
      />
    </div>
  );
};

export default TheatresTable;
