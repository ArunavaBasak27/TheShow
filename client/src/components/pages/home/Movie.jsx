import React from "react";
import { convertMinutes } from "../../../helper/convertMinutes.js";
import { Link } from "react-router";

const Movie = ({ movie }) => {
  return (
    <div className="col">
      <div className="card h-100 shadow border-0" style={{ maxWidth: "280px" }}>
        <Link to={`/movie/${movie._id}`}>
          <img
            src={movie.posterPath || "https://placehold.co/280x400"}
            alt="Movie Poster"
            className="card-img-top"
            style={{ height: "400px", objectFit: "cover" }}
          />
        </Link>

        <div className="card-body p-3">
          <h3 className="card-title fw-bold fs-5 mb-2">{movie.title}</h3>
          <p className="card-text text-muted fs-6 mb-3">
            {movie.genre} | Duration: {convertMinutes(movie.duration)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Movie;
