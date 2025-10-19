import React, { useState } from "react";
import moment from "moment";
import Swal from "sweetalert2";
import MovieForm from "./MovieForm.jsx";
import Pagination from "../../common/Pagination.jsx";
import MainLoader from "../../common/MainLoader.jsx";
import DataTable from "../../common/DataTable.jsx";

import {
  useDeleteMovieMutation,
  useGetAllMoviesQuery,
} from "../../../api/movieApi.js";

const MovieList = () => {
  const [page, setPage] = useState(1);
  const [modalShow, setModalShow] = useState(false);
  const [movieId, setMovieId] = useState(null);

  const { data, isLoading } = useGetAllMoviesQuery({ page });
  const [deleteMovie] = useDeleteMovieMutation();

  const handleEdit = (id) => {
    setMovieId(id);
    setModalShow(true);
  };

  const handleDelete = (id) => {
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
        const response = await deleteMovie(id).unwrap();
        Swal.fire({
          position: "top-end",
          icon: response.success ? "success" : "error",
          title: response.success ? "Deleted" : "Delete failed",
          text: response.message,
          showConfirmButton: false,
          timer: 1500,
        });
      }
    });
  };

  const columns = [
    {
      key: "posterPath",
      label: "Poster",
      width: "100px",
      render: (val, row) => (
        <img
          src={val}
          alt={row.title}
          className="img-fluid rounded shadow-sm"
          style={{
            width: "60px",
            height: "90px",
            objectFit: "cover",
          }}
        />
      ),
    },
    { key: "title", label: "Title", width: "15%" },
    {
      key: "description",
      label: "Description",
      width: "30%",
      render: (val) => (
        <div
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            lineHeight: "1.4em",
            maxHeight: "4.2em",
          }}
          title={val}
        >
          {val}
        </div>
      ),
    },
    {
      key: "duration",
      label: "Duration",
      render: (val) => `${val} min`,
    },
    { key: "genre", label: "Genre" },
    { key: "language", label: "Language" },
    {
      key: "releaseDate",
      label: "Release Date",
      render: (val) => moment(val).format("MMM DD, YYYY"),
    },
  ];

  if (isLoading) return <MainLoader />;

  return (
    <div className="container py-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
        <h4 className="fw-bold mb-0">Movie List</h4>
        <button
          className="btn btn-outline-primary"
          onClick={() => {
            setMovieId(null);
            setModalShow(true);
          }}
        >
          <i className="bi bi-plus-lg me-2"></i> Add Movie
        </button>
      </div>

      <DataTable
        columns={columns}
        data={data?.result || []}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        emptyMessage="No movies found. Add your first movie to get started!"
      />

      {data?.total_pages > 1 && (
        <div className="d-flex justify-content-center mt-4">
          <Pagination
            totalPages={data.total_pages}
            onPageChange={(page) => setPage(page)}
          />
        </div>
      )}

      <MovieForm
        show={modalShow}
        onHide={() => setModalShow(false)}
        movieId={movieId}
      />
    </div>
  );
};

export default MovieList;
