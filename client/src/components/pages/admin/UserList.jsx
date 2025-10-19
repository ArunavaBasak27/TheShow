import React from "react";
import Swal from "sweetalert2";
import MainLoader from "../../common/MainLoader.jsx";
import Pagination from "../../common/Pagination.jsx";
import DataTable from "../../common/DataTable.jsx";

import {
  useGetAllUsersQuery,
  useVerifyUserMutation,
} from "../../../api/userApi.js";
import { useTableSearch } from "../../hooks/useTableSearch.js";
import SearchBar from "../../common/SearchBar.jsx";

const UserList = () => {
  const {
    page,
    searchTerm,
    debouncedSearch,
    handleSearch,
    handleClearSearch,
    setPage,
  } = useTableSearch(1, 500);

  const { data, isLoading, isFetching } = useGetAllUsersQuery({
    page,
    search: debouncedSearch,
  });
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

  // Define column structure for DataTable
  const columns = [
    { key: "name", label: "Name", width: "20%" },
    {
      key: "address",
      label: "Address",
      width: "30%",
      render: (val) => (
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
          title={val}
        >
          {val}
        </div>
      ),
    },
    { key: "phone", label: "Phone", width: "15%" },
    { key: "email", label: "Email", width: "20%" },
    {
      key: "isVerified",
      label: "Status",
      width: "15%",
      render: (val) => (
        <span className={`badge bg-${val ? "success" : "warning"}`}>
          {val ? "Verified" : "Unverified"}
        </span>
      ),
    },
    {
      key: "Action",
      label: "Action",
      width: "15%",
      render: (_, row) => (
        <div className="d-flex flex-row align-items-center justify-content-center">
          <button
            onClick={() => toggleUserVerify(row)}
            className={`btn btn-sm btn-outline-${
              row.isVerified ? "danger" : "success"
            }`}
            title={row.isVerified ? "Unverify User" : "Verify User"}
            style={{ minWidth: "80px" }}
          >
            {row.isVerified ? (
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
      ),
    },
  ];

  if (isLoading || isFetching) return <MainLoader />;

  return (
    <div className="container py-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
        <h4 className="fw-bold mb-0">User List</h4>
      </div>

      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={handleSearch}
        onClear={handleClearSearch}
        placeholder="Search by name, phone or email..."
        resultsCount={data?.total_items}
        resultsQuery={debouncedSearch}
      />

      <DataTable
        columns={columns}
        data={data?.result || []}
        isLoading={isLoading}
        emptyMessage="No users found."
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
    </div>
  );
};

export default UserList;
