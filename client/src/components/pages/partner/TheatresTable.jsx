import React, { useState } from "react";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";

import MainLoader from "../../common/MainLoader.jsx";
import TheatreForm from "./TheatreForm.jsx";

import {
  useDeleteTheatreMutation,
  useGetTheatresByOwnerQuery,
} from "../../../api/theatreApi.js";
import Pagination from "../../common/Pagination.jsx";
import DataTable from "../../common/DataTable.jsx";
import { Link } from "react-router";
import { useTableSearch } from "../../hooks/useTableSearch.js";
import SearchBar from "../../common/SearchBar.jsx";

const TheatresTable = () => {
  const {
    page,
    searchTerm,
    debouncedSearch,
    handleSearch,
    handleClearSearch,
    setPage,
  } = useTableSearch(1, 500);

  const user = useSelector((state) => state.userStore.user);

  const { data, isLoading, isFetching } = useGetTheatresByOwnerQuery({
    userId: user.id,
    page,
    search: debouncedSearch,
  });

  const [deleteTheatre] = useDeleteTheatreMutation();
  const [modalShow, setModalShow] = useState(false);
  const [theatreId, setTheatreId] = useState(null);

  const handleEdit = (theatreId) => {
    setTheatreId(theatreId);
    setModalShow(true);
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

  const handleCreate = () => {
    setTheatreId(null);
    setModalShow(true);
  };

  if (isLoading || isFetching) {
    return <MainLoader />;
  }

  const columns = [
    {
      key: "name",
      label: "Name",
      width: "18%",
    },
    {
      key: "address",
      label: "Address",
      width: "25%",
    },
    {
      key: "phone",
      label: "Phone",
      width: "12%",
    },
    {
      key: "email",
      label: "Email",
      width: "18%",
    },
    {
      key: "isApproved",
      label: "Status",
      width: "12%",
      render: (val) => {
        return val ? (
          <span className="badge bg-success">Approved</span>
        ) : (
          <span className="badge bg-warning text-dark">Pending Approval</span>
        );
      },
    },
    {
      key: "isActive",
      label: "Shows",
      width: "12%",
      render: (val, row) => {
        return val && row.isApproved ? (
          <Link
            to={`/partner/theatre/${row._id}/shows`}
            className="btn btn-sm btn-outline-success"
            title="Manage Shows"
          >
            <i className="bi bi-film me-1"></i> Shows
          </Link>
        ) : (
          <span className="text-muted small">
            {!row.isApproved ? "Awaiting Approval" : "Inactive"}
          </span>
        );
      },
    },
  ];
  return (
    <div className="container py-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
        <h4 className="fw-bold mb-0">My Theatres</h4>
        <button
          className="btn btn-outline-primary"
          style={{ minWidth: "150px" }}
          onClick={handleCreate}
        >
          <i className="bi bi-plus-lg me-2"></i> Add Theatre
        </button>
      </div>

      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={handleSearch}
        onClear={handleClearSearch}
        placeholder="Search by title, description, genre, or language..."
        resultsCount={data?.total_items}
        resultsQuery={debouncedSearch}
      />

      <DataTable
        columns={columns}
        data={data?.result || []}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        emptyMessage="No theatres found. Add your first theatre to get started!"
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
      <TheatreForm
        show={modalShow}
        onHide={() => setModalShow(false)}
        theatreId={theatreId}
      />
    </div>
  );
};

export default TheatresTable;
