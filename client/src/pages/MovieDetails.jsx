import React from "react";
import { Link, useParams } from "react-router";
import { useGetMovieByIdQuery } from "../api/movieApi.js";
import MainLoader from "../components/common/MainLoader.jsx";
import { convertMinutes } from "../helper/convertMinutes.js";
import moment from "moment";

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
          {/* Movie Poster */}
          <div className="col-md-4">
            <img
              src={movie.posterPath || "https://placehold.co/400x600"}
              className="img-fluid h-100 object-fit-cover rounded-start"
              alt={movie.title}
            />
          </div>

          {/* Movie Details */}
          <div className="col-md-8">
            <div className="card-body d-flex flex-column justify-content-between h-100 p-4">
              <div>
                <h2 className="card-title fw-bold mb-3">{movie.title}</h2>

                <p className="card-text text-muted mb-4">{movie.description}</p>

                {/* Info Section */}
                <div className="d-flex flex-wrap align-items-center gap-3 mb-4">
                  <span className="badge bg-secondary fs-6">{movie.genre}</span>
                  <span className="badge bg-info text-dark fs-6 text-capitalize">
                    {movie.language}
                  </span>
                  <span className="text-muted d-flex align-items-center">
                    <i className="bi bi-clock me-1"></i>
                    {convertMinutes(movie.duration)}
                  </span>
                </div>
              </div>

              {/* Book Button */}
              <div className="text-end">
                <Link
                  to={`/movie/${movie._id}/shows/${moment(
                    new Date().setDate(new Date().getDate() + 1),
                  ).format("YYYYMMDD")}`}
                  className="btn btn-success btn-lg px-4"
                >
                  Book Show
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
