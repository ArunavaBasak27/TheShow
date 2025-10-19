// src/components/common/DataTable.jsx
import React from "react";
import { Table } from "react-bootstrap";
import MainLoader from "./MainLoader.jsx";

const DataTable = ({
  columns = [],
  data = [],
  isLoading = false,
  onEdit,
  onDelete,
  emptyMessage = "No records found",
}) => {
  if (isLoading) return <MainLoader />;

  if (!data || data.length === 0)
    return (
      <div className="text-center py-5 text-muted">
        <i className="bi bi-database fs-1 d-block mb-3"></i>
        <p>{emptyMessage}</p>
      </div>
    );

  return (
    <div className="table-responsive">
      <Table bordered hover className="align-middle mb-0">
        <thead className="table-light">
          <tr>
            {columns.map((col) => (
              <th key={col.key} style={{ width: col.width || "auto" }}>
                {col.label}
              </th>
            ))}
            {(onEdit || onDelete) && (
              <th style={{ width: "140px" }} className="text-center">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row._id}>
              {columns.map((col) => (
                <td key={col.key}>
                  {typeof col.render === "function"
                    ? col.render(row[col.key], row)
                    : row[col.key]}
                </td>
              ))}

              {(onEdit || onDelete) && (
                <td className="text-center">
                  <div className="d-flex gap-2 justify-content-center">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(row._id)}
                        className="btn btn-sm btn-warning"
                        title="Edit"
                      >
                        <i className="bi bi-pencil-square"></i>
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(row._id)}
                        className="btn btn-sm btn-danger"
                        title="Delete"
                      >
                        <i className="bi bi-trash-fill"></i>
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default DataTable;
