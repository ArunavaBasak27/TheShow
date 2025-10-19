import React, { useState } from "react";
import { Table } from "react-bootstrap";
import Swal from "sweetalert2";

import MainLoader from "../../common/MainLoader.jsx";

import {
  useChangeTheatreStatusMutation,
  useGetAllTheatresQuery,
} from "../../../api/theatreApi.js";
import Pagination from "../../common/Pagination.jsx";

const TheatreList = () => {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useGetAllTheatresQuery({ page });
  const [toggleStatus] = useChangeTheatreStatusMutation();
  const changeApproval = async (theatreObj) => {
    try {
      const theatreId = theatreObj._id;
      const status = theatreObj.isApproved ? "block" : "approve";
      await Swal.fire({
        title: `Are you sure you want to ${status}?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: `Yes, ${status} it!`,
      }).then(async (result) => {
        if (result.isConfirmed) {
          const response = await toggleStatus(theatreId).unwrap();
          if (response.success) {
            await Swal.fire({
              position: "top-end",
              icon: "success",
              title: response.message,
              showConfirmButton: false,
              timer: 1500,
            });
          } else {
            throw new Error(response.message);
          }
        }
      });
    } catch (error) {
      await Swal.fire({
        position: "top-end",
        icon: "error",
        title: error.message || "Something went wrong!",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  if (isLoading) {
    return <MainLoader />;
  }

  return (
    <div className="container py-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
        <h4 className="fw-bold mb-0">Theatre List</h4>
      </div>

      <div className="table-responsive">
        <Table bordered hover className="align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th style={{ width: "18%" }}>Name</th>
              <th style={{ width: "22%" }}>Address</th>
              <th style={{ width: "12%" }}>Phone</th>
              <th style={{ width: "18%" }}>Email</th>
              <th style={{ width: "15%" }}>Owner</th>
              <th style={{ width: "15%" }}>Status</th>
              <th style={{ width: "140px" }} className="text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {data?.result?.length > 0 ? (
              data.result.map((theatre) => (
                <tr key={theatre._id}>
                  <td className="fw-semibold">{theatre.name}</td>
                  <td>
                    <div
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        lineHeight: "1.4em",
                        maxHeight: "2.8em",
                      }}
                      title={theatre.address}
                    >
                      {theatre.address}
                    </div>
                  </td>
                  <td>{theatre.phone}</td>
                  <td>{theatre.email}</td>
                  <td>{theatre.owner?.name || "N/A"}</td>
                  <td>
                    <span
                      className={`badge bg-${theatre.isActive ? "success" : "danger"}`}
                    >
                      {theatre.isActive ? "Open" : "Closed"}
                    </span>
                  </td>
                  <td>
                    <div className="d-flex gap-2 justify-content-center">
                      <button
                        onClick={() => changeApproval(theatre)}
                        className={`btn btn-sm btn-outline-${theatre.isApproved ? "danger" : "success"}`}
                        title={
                          theatre.isApproved
                            ? "Block Theatre"
                            : "Approve Theatre"
                        }
                        style={{ minWidth: "80px" }}
                      >
                        {theatre.isApproved ? (
                          <>
                            <i className="bi bi-ban me-1"></i> Block
                          </>
                        ) : (
                          <>
                            <i className="bi bi-check-lg me-1"></i> Approve
                          </>
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-5 text-muted">
                  <div>
                    <i className="bi bi-building fs-1 d-block mb-3"></i>
                    <p className="mb-0">No theatres found.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </Table>

        {data?.total_pages > 1 && (
          <div className="d-flex justify-content-center mt-4">
            <Pagination
              totalPages={data.total_pages}
              onPageChange={(page) => setPage(page)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TheatreList;
