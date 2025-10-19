import React, { useState } from "react";
import { Table } from "react-bootstrap";
import Swal from "sweetalert2";

import MainLoader from "../../common/MainLoader.jsx";

import {
  useGetAllUsersQuery,
  useVerifyUserMutation,
} from "../../../api/userApi.js";
import Pagination from "../../common/Pagination.jsx";

const UserList = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useGetAllUsersQuery({ page });
  const [verifyUser] = useVerifyUserMutation();

  const toggleUserVerify = async (userObj) => {
    try {
      const userId = userObj._id;
      const status = userObj.isVerified ? "unverify" : "verify";
      await Swal.fire({
        title: `Are you sure you want to ${status} ${userObj.name.split(" ")[0]}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: `Yes, ${status}!`,
      }).then(async (result) => {
        if (result.isConfirmed) {
          const response = await verifyUser(userId).unwrap();
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
        <h4 className="fw-bold mb-0">User List</h4>
      </div>

      <div className="table-responsive">
        <Table bordered hover className="align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th style={{ width: "20%" }}>Name</th>
              <th style={{ width: "30%" }}>Address</th>
              <th style={{ width: "15%" }}>Phone</th>
              <th style={{ width: "20%" }}>Email</th>
              <th style={{ width: "15%" }}>Status</th>
              <th style={{ width: "140px" }} className="text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {data?.result?.length > 0 ? (
              data.result.map((user) => (
                <tr key={user._id}>
                  <td className="fw-semibold">{user.name}</td>
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
                      title={user.address}
                    >
                      {user.address}
                    </div>
                  </td>
                  <td>{user.phone}</td>
                  <td>{user.email}</td>
                  <td>
                    <span
                      className={`badge bg-${user.isVerified ? "success" : "warning"}`}
                    >
                      {user.isVerified ? "Verified" : "Unverified"}
                    </span>
                  </td>
                  <td>
                    <div className="d-flex gap-2 justify-content-center">
                      <button
                        onClick={() => toggleUserVerify(user)}
                        className={`btn btn-sm btn-outline-${user.isVerified ? "danger" : "success"}`}
                        title={
                          user.isVerified ? "Unverify User" : "Verify User"
                        }
                        style={{ minWidth: "80px" }}
                      >
                        {user.isVerified ? (
                          <>
                            <i className="bi bi-ban me-1"></i> Unverify
                          </>
                        ) : (
                          <>
                            <i className="bi bi-check-lg me-1"></i> Verify
                          </>
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-5 text-muted">
                  <div>
                    <i className="bi bi-people fs-1 d-block mb-3"></i>
                    <p className="mb-0">No users found.</p>
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
    </div>
  );
};

export default UserList;
