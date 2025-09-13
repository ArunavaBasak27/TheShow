import React from "react";
import {
  useChangeTheatreStatusMutation,
  useGetAllTheatresQuery,
} from "../../../api/theatreApi.js";
import MainLoader from "../../common/MainLoader.jsx";
import { Table } from "react-bootstrap";
import Swal from "sweetalert2";

const TheatreList = () => {
  const { data, isLoading } = useGetAllTheatresQuery();
  const [toggleStatus] = useChangeTheatreStatusMutation();

  if (isLoading) {
    return <MainLoader />;
  }
  const changeApproval = async (theatreObj) => {
    try {
      const theatreId = theatreObj._id;
      const status = theatreObj.isApproved ? "block" : "approve";
      await Swal.fire({
        title: `Are you sure you want to ${status} ?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: `Yes, ${status} it!`,
      }).then(async (result) => {
        if (result.isConfirmed) {
          const response = await toggleStatus(theatreId).unwrap();
          console.log(response);
          if (response.success) {
            await Swal.fire({
              position: "top-end",
              icon: "success",
              title: response.message,
              showConfirmButton: false,
              timer: 1500,
            });
          } else {
            await Swal.fire({
              position: "top-end",
              icon: "error",
              title: response.message,
              showConfirmButton: false,
              timer: 1500,
            });
          }
        }
      });
    } catch (error) {
      await Swal.fire({
        position: "top-end",
        icon: "error",
        title: error.message,
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };
  return (
    <div className="container m-3">
      <Table className="mt-5" bordered hover size="sm" responsive="sm">
        <thead>
          <tr>
            <th>Name</th>
            <th>Address</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Owner</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.result &&
            data.result.map((theatre, index) => (
              <tr key={index}>
                <td>{theatre.name}</td>
                <td>{theatre.address}</td>
                <td>{theatre.phone}</td>
                <td>{theatre.email}</td>
                <td>{theatre.owner.name}</td>
                <td>{theatre.isActive ? "Open" : "Closed"}</td>
                <td className="text-center">
                  <button
                    onClick={() => changeApproval(theatre)}
                    className={`btn btn-outline-${theatre.isApproved ? "danger" : "success"}`}
                  >
                    {theatre.isApproved ? (
                      <i className="bi bi-ban"></i>
                    ) : (
                      <i className="bi bi-check"></i>
                    )}
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
    </div>
  );
};

export default TheatreList;
