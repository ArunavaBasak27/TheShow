import React from "react";
import {
  useGetAllUsersQuery,
  useVerifyUserMutation,
} from "../../../api/userApi.js";
import MainLoader from "../../common/MainLoader.jsx";
import { Table } from "react-bootstrap";
import Swal from "sweetalert2";

const UserList = () => {
  const { data, isLoading } = useGetAllUsersQuery();
  const [verifyUser] = useVerifyUserMutation();
  if (isLoading) {
    return <MainLoader />;
  }
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
        icon: "success",
        title: error.message,
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };
  return (
    <div>
      <h2></h2>
      <Table className="mt-5" hover size="sm" responsive="sm">
        <thead>
          <tr>
            <th>Name</th>
            <th>Address</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody className="table-group-divider">
          {data?.result.map((user, index) => {
            return (
              <tr key={index}>
                <td>{user.name}</td>
                <td>{user.address}</td>
                <td>{user.phone}</td>
                <td>{user.email}</td>
                <td>
                  <button
                    onClick={() => toggleUserVerify(user)}
                    className={`btn btn-outline-${user.isVerified ? "danger" : "success"}`}
                  >
                    {user.isVerified ? (
                      <i className="bi bi-ban"></i>
                    ) : (
                      <i className="bi bi-check"></i>
                    )}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
};

export default UserList;
