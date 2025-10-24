import React from "react";
import { convertMinutes } from "../../../helper/convertMinutes.js";
import { Link } from "react-router";

const Movie = ({ movie }) => {
  return (
    <div className="col">
      <div
        className="card h-100 border-0 shadow-sm rounded-3 overflow-hidden"
        style={{
          maxWidth: "280px",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
        }}
      >
        <Link
          to={`/movie/${movie._id}`}
          className="text-decoration-none text-dark"
        >
          <div
            className="position-relative"
            style={{ overflow: "hidden", borderRadius: "0.5rem 0.5rem 0 0" }}
          >
            <img
              src={movie.posterPath || "https://placehold.co/280x400"}
              alt={`${movie.title} Poster`}
              className="card-img-top"
              style={{
                height: "400px",
                width: "100%",
                objectFit: "cover",
                transition: "transform 0.3s ease",
              }}
              onError={(e) => {
                e.target.src = "https://placehold.co/280x400";
              }}
            />
          </div>

          <div className="card-body p-3">
            <h3
              className="card-title fw-semibold fs-5 mb-2 text-truncate"
              title={movie.title}
            >
              {movie.title}
            </h3>

            <p className="card-text text-muted mb-2 small">
              <span className="fw-medium text-dark">{movie.genre}</span> •{" "}
              <span className="text-capitalize">{movie.language}</span>
            </p>

            <p className="card-text text-secondary small mb-0">
              <i className="bi bi-clock me-1"></i> Duration:{" "}
              {convertMinutes(movie.duration)}
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Movie;
