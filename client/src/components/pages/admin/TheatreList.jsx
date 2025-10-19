import React, { useState } from "react";
import Swal from "sweetalert2";

import MainLoader from "../../common/MainLoader.jsx";

import {
  useChangeTheatreStatusMutation,
  useGetAllTheatresQuery,
} from "../../../api/theatreApi.js";
import Pagination from "../../common/Pagination.jsx";
import DataTable from "../../common/DataTable.jsx";

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

  const columns = [
    {
      key: "name",
      label: "Name",
      width: "18%",
    },
    {
      key: "address",
      label: "Address",
      width: "22%",
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
      key: "owner",
      label: "Owner",
      width: "15%",
      render: (value) => {
        return <span>{value.name}</span>;
      },
    },
    {
      key: "action",
      label: "Action",
      width: "15%",
      render: (value, row) => {
        return (
          <div className="d-flex gap-2 justify-content-center">
            <button
              onClick={() => changeApproval(row)}
              className={`btn btn-sm btn-outline-${row.isApproved ? "danger" : "success"}`}
              title={row.isApproved ? "Block Theatre" : "Approve Theatre"}
              style={{ minWidth: "80px" }}
            >
              {row.isApproved ? (
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
        );
      },
    },
  ];

  return (
    <div className="container py-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
        <h4 className="fw-bold mb-0">Theatre List</h4>
      </div>

      <DataTable
        columns={columns}
        data={data?.result || []}
        isLoading={isLoading}
        emptyMessage="No theatres found. Add your first theatre to get started!"
      />

      {data?.total_pages > 1 && (
        <div className="d-flex justify-content-center mt-4">
          <Pagination
            totalPages={data.total_pages}
            onPageChange={(page) => setPage(page)}
          />
        </div>
      )}
      {/*</div>*/}
    </div>
  );
};

export default TheatreList;
