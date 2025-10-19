import React, { useState } from "react";
import moment from "moment";
import Swal from "sweetalert2";
import MovieForm from "./MovieForm.jsx";
import Pagination from "../../common/Pagination.jsx";
import MainLoader from "../../common/MainLoader.jsx";
import DataTable from "../../common/DataTable.jsx";
import SearchBar from "../../common/SearchBar.jsx";

import { useTableSearch } from "../../hooks/useTableSearch";
import {
  useDeleteMovieMutation,
  useGetAllMoviesQuery,
} from "../../../api/movieApi.js";

const MovieList = () => {
  const [modalShow, setModalShow] = useState(false);
  const [movieId, setMovieId] = useState(null);

  const {
    page,
    searchTerm,
    debouncedSearch,
    handleSearch,
    handleClearSearch,
    setPage,
  } = useTableSearch(1, 500);

  //  Destructure isFetching to show loader on refetch (e.g., clear)
  const { data, isLoading, isFetching } = useGetAllMoviesQuery({
    page,
    search: debouncedSearch,
  });
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
        try {
          const response = await deleteMovie(id).unwrap();
          Swal.fire({
            position: "top-end",
            icon: response.success ? "success" : "error",
            title: response.success ? "Deleted" : "Delete failed",
            text: response.message,
            showConfirmButton: false,
            timer: 1500,
          });
          if (response.success) {
            setPage(1); // Reset to page 1 after delete
          }
        } catch (error) {
          Swal.fire({
            position: "top-end",
            icon: "error",
            title: "Delete failed",
            text: error?.data?.message || "An error occurred",
            showConfirmButton: false,
            timer: 1500,
          });
        }
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

  // UPDATED: Show loader on initial load OR refetch (covers clear races)
  if (isLoading || isFetching) return <MainLoader />;

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
        isLoading={false} // UPDATED: Pass false; parent handles via isFetching
        onEdit={handleEdit}
        onDelete={handleDelete}
        emptyMessage={
          debouncedSearch
            ? `No movies found matching "${debouncedSearch}"`
            : "No movies found. Add your first movie to get started!"
        }
      />

      {data?.total_pages > 1 && (
        <div className="d-flex justify-content-center mt-4">
          <Pagination
            totalPages={data.total_pages}
            currentPage={page}
            onPageChange={setPage}
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
