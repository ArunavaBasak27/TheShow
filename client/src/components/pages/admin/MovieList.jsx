import React, { useState } from "react";
import { Table } from "react-bootstrap";
import moment from "moment";
import Swal from "sweetalert2";

import MovieForm from "./MovieForm.jsx";
import Pagination from "../../common/Pagination.jsx";
import MainLoader from "../../common/MainLoader.jsx";

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

  // const handleSearch = (e) => {
  //   console.log(e.target.value);
  //   setPage(1);
  // };

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

  if (isLoading) return <MainLoader />;

  return (
    <div className="container py-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
        <h4 className="fw-bold mb-0">Movie List</h4>
        <button
          className="btn btn-outline-primary"
          style={{ minWidth: "150px" }}
          onClick={() => {
            setMovieId(null);
            setModalShow(true);
          }}
        >
          <i className="bi bi-plus-lg me-2"></i> Add Movie
        </button>
      </div>
      {/*<div className="row  mb-2">*/}
      {/*  <div className="col-md-4 col-12 offset-md-8 ">*/}
      {/*    <input*/}
      {/*      className="form-control"*/}
      {/*      placeholder="Search...."*/}
      {/*      onChange={handleSearch}*/}
      {/*    />*/}
      {/*  </div>*/}
      {/*</div>*/}
      <div className="table-responsive">
        <Table bordered hover className="align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th style={{ width: "100px" }}>Poster</th>
              <th style={{ width: "15%" }}>Title</th>
              <th style={{ width: "30%" }}>Description</th>
              <th style={{ width: "10%" }}>Duration</th>
              <th style={{ width: "12%" }}>Genre</th>
              <th style={{ width: "10%" }}>Language</th>
              <th style={{ width: "12%" }}>Release Date</th>
              <th style={{ width: "140px" }} className="text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {data?.result?.map((movie) => (
              <tr key={movie._id}>
                <td className="text-center p-2">
                  <img
                    src={movie.posterPath}
                    alt={movie.title}
                    className="img-fluid rounded shadow-sm"
                    style={{
                      width: "60px",
                      height: "90px",
                      objectFit: "cover",
                    }}
                  />
                </td>
                <td className="fw-semibold">{movie.title}</td>
                <td>
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
                    title={movie.description}
                  >
                    {movie.description}
                  </div>
                </td>
                <td>{movie.duration} min</td>
                <td>{movie.genre}</td>
                <td>{movie.language}</td>
                <td>{moment(movie.releaseDate).format("MMM DD, YYYY")}</td>
                <td>
                  <div className="d-flex gap-2 justify-content-center">
                    <button
                      onClick={() => handleEdit(movie._id)}
                      className="btn btn-sm btn-warning"
                      title="Edit"
                    >
                      <i className="bi bi-pencil-square"></i>
                    </button>
                    <button
                      onClick={() => handleDelete(movie._id)}
                      className="btn btn-sm btn-danger"
                      title="Delete"
                    >
                      <i className="bi bi-trash-fill"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {data?.result?.length === 0 && (
        <div className="text-center py-5 text-muted">
          <i className="bi bi-film fs-1 d-block mb-3"></i>
          <p>No movies found. Add your first movie to get started!</p>
        </div>
      )}

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
