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

const TheatresTable = () => {
  const [page, setPage] = useState(1);
  const user = useSelector((state) => state.userStore.user);
  const { data, isLoading } = useGetTheatresByOwnerQuery({
    userId: user.id,
    page,
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

      <DataTable
        columns={columns}
        data={data?.result || []}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        emptyMessage="No theatres found. Add your first theatre to get started!"
      />
      {/*<div className="table-responsive">*/}
      {/*  <Table bordered hover className="align-middle mb-0">*/}
      {/*    <thead className="table-light">*/}
      {/*      <tr>*/}
      {/*        <th style={{ width: "18%" }}>Name</th>*/}
      {/*        <th style={{ width: "25%" }}>Address</th>*/}
      {/*        <th style={{ width: "12%" }}>Phone</th>*/}
      {/*        <th style={{ width: "18%" }}>Email</th>*/}
      {/*        <th style={{ width: "12%" }}>Status</th>*/}
      {/*        <th style={{ width: "15%" }} className="text-center">*/}
      {/*          Shows*/}
      {/*        </th>*/}
      {/*        <th style={{ width: "140px" }} className="text-center">*/}
      {/*          Actions*/}
      {/*        </th>*/}
      {/*      </tr>*/}
      {/*    </thead>*/}
      {/*    <tbody>*/}
      {/*      {theatres.length > 0 ? (*/}
      {/*        theatres.map((theatre) => (*/}
      {/*          <tr key={theatre._id}>*/}
      {/*            <td className="fw-semibold">{theatre.name}</td>*/}
      {/*            <td>*/}
      {/*              <div*/}
      {/*                style={{*/}
      {/*                  display: "-webkit-box",*/}
      {/*                  WebkitLineClamp: 2,*/}
      {/*                  WebkitBoxOrient: "vertical",*/}
      {/*                  overflow: "hidden",*/}
      {/*                  textOverflow: "ellipsis",*/}
      {/*                  lineHeight: "1.4em",*/}
      {/*                  maxHeight: "2.8em",*/}
      {/*                }}*/}
      {/*                title={theatre.address}*/}
      {/*              >*/}
      {/*                {theatre.address}*/}
      {/*              </div>*/}
      {/*            </td>*/}
      {/*            <td>{theatre.phone}</td>*/}
      {/*            <td>{theatre.email}</td>*/}
      {/*            <td>*/}
      {/*              {theatre.isApproved ? (*/}
      {/*                <span className="badge bg-success">Approved</span>*/}
      {/*              ) : (*/}
      {/*                <span className="badge bg-warning text-dark">*/}
      {/*                  Pending Approval*/}
      {/*                </span>*/}
      {/*              )}*/}
      {/*            </td>*/}
      {/*            <td className="text-center">*/}
      {/*              {theatre.isActive && theatre.isApproved ? (*/}
      {/*                <Link*/}
      {/*                  to={`/partner/theatre/${theatre._id}/shows`}*/}
      {/*                  className="btn btn-sm btn-outline-success"*/}
      {/*                  title="Manage Shows"*/}
      {/*                >*/}
      {/*                  <i className="bi bi-film me-1"></i> Shows*/}
      {/*                </Link>*/}
      {/*              ) : (*/}
      {/*                <span className="text-muted small">*/}
      {/*                  {!theatre.isApproved ? "Awaiting Approval" : "Inactive"}*/}
      {/*                </span>*/}
      {/*              )}*/}
      {/*            </td>*/}
      {/*            <td>*/}
      {/*              <div className="d-flex gap-2 justify-content-center">*/}
      {/*                <button*/}
      {/*                  onClick={() => handleEdit(theatre._id)}*/}
      {/*                  className="btn btn-sm btn-warning"*/}
      {/*                  title="Edit"*/}
      {/*                >*/}
      {/*                  <i className="bi bi-pencil-square"></i>*/}
      {/*                </button>*/}
      {/*                <button*/}
      {/*                  onClick={() => handleDelete(theatre._id)}*/}
      {/*                  className="btn btn-sm btn-danger"*/}
      {/*                  title="Delete"*/}
      {/*                >*/}
      {/*                  <i className="bi bi-trash-fill"></i>*/}
      {/*                </button>*/}
      {/*              </div>*/}
      {/*            </td>*/}
      {/*          </tr>*/}
      {/*        ))*/}
      {/*      ) : (*/}
      {/*        <tr>*/}
      {/*          <td colSpan="7" className="text-center py-5 text-muted">*/}
      {/*            <div>*/}
      {/*              <i className="bi bi-building fs-1 d-block mb-3"></i>*/}
      {/*              <p className="mb-0">*/}
      {/*                No theatres found. Add your first theatre to get started!*/}
      {/*              </p>*/}
      {/*            </div>*/}
      {/*          </td>*/}
      {/*        </tr>*/}
      {/*      )}*/}
      {/*    </tbody>*/}
      {/*  </Table>*/}
      {/*</div>*/}
      {data?.total_pages > 1 && (
        <div className="d-flex justify-content-center mt-4">
          <Pagination
            totalPages={data.total_pages}
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
