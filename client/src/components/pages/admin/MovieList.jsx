import React, { useState } from "react";
import { Table } from "react-bootstrap";
import MovieForm from "./MovieForm.jsx";
import {
  useDeleteMovieMutation,
  useGetAllMoviesQuery,
} from "../../../api/movieApi.js";
import MainLoader from "../../common/MainLoader.jsx";
import moment from "moment";
import Swal from "sweetalert2";

const MovieList = () => {
  const [modalShow, setModalShow] = useState(false);
  const { data, isLoading } = useGetAllMoviesQuery();
  const [deleteMovie] = useDeleteMovieMutation();
  const [movieId, setMovieId] = useState(null);
  if (isLoading) {
    return <MainLoader />;
  }

  const handleEdit = (movieId) => {
    setMovieId(movieId);
    setModalShow(true);
  };

  const handleDelete = (movieId) => {
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
        const response = await deleteMovie(movieId).unwrap();
        if (response.success) {
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Deleted",
            text: response.message,
            showConfirmButton: false,
            timer: 1500,
          });
        } else {
          Swal.fire({
            position: "top-end",
            icon: "Cancelled",
            title: "Delete failed",
            text: response.message,
            showConfirmButton: false,
            timer: 1500,
          });
        }
      }
    });
  };
  return (
    <div className="container m-3 p-3">
      <button
        className="btn btn-outline-primary"
        onClick={() => {
          setMovieId(null);
          setModalShow(true);
        }}
      >
        <i className="bi bi-plus"></i> Add Movie
      </button>

      <Table className="mt-5" bordered hover size="sm" responsive="sm">
        <thead>
          <tr>
            <th>Poster</th>
            <th>Title</th>
            <th>Description</th>
            <th>Duration</th>
            <th>Genre</th>
            <th>Language</th>
            <th>Release Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.result.map((movie, index) => {
            return (
              <tr key={index}>
                <td>
                  <img src={movie.posterPath} width={100} height={150} />
                </td>
                <td>{movie.title}</td>
                <td>{movie.description}</td>
                <td>{movie.duration}</td>
                <td>{movie.language}</td>
                <td>{movie.genre}</td>
                <td>{moment(movie.releaseDate).format("YYYY-MM-DD")}</td>
                <td>
                  <div className="d-flex flex-row gap-2">
                    <button
                      onClick={() => handleEdit(movie._id)}
                      className="btn btn-outline-warning"
                    >
                      <i className="bi bi-pencil-square"></i>
                    </button>
                    <button
                      onClick={() => handleDelete(movie._id)}
                      className="btn btn-outline-danger"
                    >
                      <i className="bi bi-trash-fill"></i>
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>

      <MovieForm
        show={modalShow}
        onHide={() => setModalShow(false)}
        movieId={movieId}
      />
    </div>
  );
};

export default MovieList;
