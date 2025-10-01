import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { useGetAllMoviesQuery } from "../../../api/movieApi.js";
import { useGetTheatreByIdQuery } from "../../../api/theatreApi.js";
import MainLoader from "../../common/MainLoader.jsx";
import inputHelper from "../../../helper/inputHelper.js";
import {
  useCreateShowMutation,
  useGetShowByIdQuery,
  useUpdateShowMutation,
} from "../../../api/showApi.js";
import toastNotify from "../../../helper/toastNotify.js";
import moment from "moment";

const ShowForm = ({ show, onHide, theatreId, showId }) => {
  const { data: movies = [], isLoading: moviesLoading } =
    useGetAllMoviesQuery();
  const { data: theatre, isLoading: theatreLoading } = useGetTheatreByIdQuery(
    theatreId,
    {
      skip: !theatreId,
    },
  );
  const { data: showData, isLoading: showLoading } = useGetShowByIdQuery(
    showId,
    {
      skip: !showId,
    },
  );
  const [createShow] = useCreateShowMutation();
  const [updateShow] = useUpdateShowMutation();
  const initialState = {
    movie: "",
    date: "",
    totalSeats: "",
    ticketPrice: "",
  };
  const [userInput, setUserInput] = useState(initialState);

  useEffect(() => {
    if (show) {
      if (!showId && !showLoading) {
        setUserInput(initialState);
      } else if (showData && !moviesLoading && !showLoading) {
        setUserInput({
          ...showData?.result,
          date: moment
            .utc(showData?.result.date)
            .local()
            .format("YYYY-MM-DDTHH:mm"),
        });
      }
    }
  }, [show, showLoading, showData, showId, moviesLoading]);
  console.log(userInput);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const showObj = {
        ...userInput,
        theatre: theatreId,
        date: new Date(userInput.date), // JS Date auto converts local → UTC
      };
      let response;
      if (showId) {
        response = await updateShow(showObj).unwrap();
      } else {
        response = await createShow(showObj).unwrap();
      }
      if (response.success) {
        toastNotify({ message: response.message, type: "success" });
        setUserInput(initialState);
        onHide();
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      toastNotify({
        message: error.message || "Something went wrong",
        type: "error",
      });
    }
  };
  const handleChange = (e) => {
    const tempData = inputHelper(e, userInput);
    setUserInput(tempData);
  };

  if (!moviesLoading && !theatreLoading && movies && theatre) {
    return (
      <Modal
        show={show}
        onHide={onHide}
        size="lg"
        aria-labelledby="create-show-modal"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="create-show-modal">
            Create Show for {theatre?.result.name || "Selected Theatre"}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="mb-3">
            <label htmlFor="formGroupExampleInput" className="form-label">
              Movie
            </label>
            <select
              className="form-select"
              name={"movie"}
              value={userInput.movie}
              onChange={handleChange}
            >
              <option value="">--Select--</option>
              {movies.result.map((movie) => {
                return (
                  <option key={movie._id} value={movie._id}>
                    {movie.title}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="showTime" className="form-label">
              Show Date & time
            </label>
            <input
              type="datetime-local"
              className="form-control"
              name="date"
              value={userInput.date}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="formGroupExampleInput2" className="form-label">
              Total Seats
            </label>
            <input
              type="number"
              className="form-control"
              id="seat"
              min={1}
              placeholder="Enter Total Seats"
              name="totalSeats"
              value={userInput.totalSeats}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="formGroupExampleInput2" className="form-label">
              Ticket Price
            </label>
            <input
              type="number"
              className="form-control"
              id="seat"
              min={1}
              placeholder="Enter Ticket Price"
              name="ticketPrice"
              value={userInput.ticketPrice}
              onChange={handleChange}
            />
          </div>
        </Modal.Body>

        <Modal.Footer>
          <button
            className="btn btn-primary w-25 form-control"
            onClick={onSubmit}
          >
            Submit
          </button>
          <button
            className="btn btn-secondary w-25 form-control"
            onClick={onHide}
          >
            Cancel
          </button>
        </Modal.Footer>
      </Modal>
    );
  } else {
    return <MainLoader />;
  }
};

export default ShowForm;
