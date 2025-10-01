import React from "react";
import { Link, useParams } from "react-router";
import { useGetMovieByIdQuery } from "../api/movieApi.js";
import { useGetShowsByMovieAndDateQuery } from "../api/showApi.js";
import moment from "moment";
import { generateShowDates } from "../helper/generateShowDates.js";

const ChooseShow = () => {
  const { movieId, date } = useParams();
  const { data: movie, isLoading: movieLoading } =
    useGetMovieByIdQuery(movieId);

  const { data: showData, isLoading: showLoading } =
    useGetShowsByMovieAndDateQuery({
      movieId: movieId,
      date: moment(date).format("YYYY-MM-DD"),
    });

  const theatreAndShowMapper = (data = []) => {
    const obj = data.reduce((acc, { _id, date, theatre }) => {
      const theatreId = theatre._id;
      const showTime = moment(date).format("hh:mm A");

      const showEntry = { _id, time: showTime };

      if (!acc[theatreId]) {
        acc[theatreId] = { ...theatre, shows: [showEntry] };
      } else {
        acc[theatreId].shows.push(showEntry);
      }

      return acc;
    }, {});
    return Object.values(obj);
  };
  const theatresWithShows = theatreAndShowMapper(showData?.result);
  const showDates = generateShowDates();
  if (movieLoading || showLoading)
    return <div className="text-center my-5">Loading...</div>;

  return (
    <div className="container my-5">
      <h2 className="text-secondary text-center mb-4">{movie.result?.title}</h2>
      <div className="d-flex flex-row flex-wrap gap-2 justify-content-center mb-2">
        {showDates.map((showDate, index) => {
          return (
            <Link
              to={`/movie/${movieId}/shows/${showDate.value}`}
              className={`btn btn${showDate.value == date ? "" : "-outline"}-warning`}
              key={index}
            >
              {showDate.date} {showDate.month}({showDate.week})
            </Link>
          );
        })}
      </div>
      {theatresWithShows.length === 0 && (
        <div className="text-center my-5">No shows available</div>
      )}

      {theatresWithShows.map((theatre, index) => (
        <div key={index} className="card mb-3 w-80 mx-auto">
          <div className="card-body">
            <div className="row align-items-center">
              <div className="col-md-3 fw-semibold text-secondary">
                {theatre.name}
              </div>
              <div className="col-md-9">
                <div
                  className="d-flex flex-wrap gap-2"
                  aria-label={`Showtimes for ${theatre.name}`}
                >
                  {theatre.shows.map((show) => (
                    <Link
                      to={`/movie/${movieId}/theatre/${theatre._id}/show/${show._id}`}
                      key={show._id}
                      className="btn btn-outline-secondary"
                    >
                      {show.time}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChooseShow;
