import React from "react";
import { useParams } from "react-router";
import { useGetMovieByIdQuery } from "../api/movieApi.js";
import MainLoader from "../components/common/MainLoader.jsx";
import { convertMinutes } from "../helper/convertMinutes.js";

const MovieDetails = () => {
  const { movieId } = useParams();
  const { data, isLoading } = useGetMovieByIdQuery(movieId);

  if (isLoading) {
    return <MainLoader />;
  }

  const movie = data.result;

  return (
    <div className="container my-5">
      <div className="card shadow-lg border-0 rounded-4 overflow-hidden">
        <div className="row g-0">
          <div className="col-md-4">
            <img
              src={movie.posterPath}
              className="img-fluid h-100 object-fit-cover rounded-start"
              alt={movie.title}
            />
          </div>
          <div className="col-md-8">
            <div className="card-body d-flex flex-column justify-content-between h-100 p-4">
              <div>
                <h2 className="card-title fw-bold mb-3">{movie.title}</h2>
                <p className="card-text text-muted mb-4">{movie.description}</p>
                <div className="d-flex flex-wrap gap-3 mb-4">
                  <span className="badge bg-secondary">{movie.genre}</span>
                  <span className="text-muted">
                    <i className="bi bi-clock me-1"></i>
                    {convertMinutes(movie.duration)}
                  </span>
                </div>
              </div>
              <div className="text-end">
                <button className="btn btn-success btn-lg px-4">
                  Book Show
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
