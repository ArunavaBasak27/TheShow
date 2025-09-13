import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import inputHelper from "../../../helper/inputHelper.js";
import {
  useCreateMovieMutation,
  useGetMovieByIdQuery,
  useUpdateMovieMutation,
} from "../../../api/movieApi.js";
import toastNotify from "../../../helper/toastNotify.js";
import moment from "moment";

const MovieForm = (props) => {
  const movieId = props.movieId;
  const initialValues = {
    title: "",
    description: "",
    duration: "",
    language: "",
    genre: "",
    releaseDate: "",
    posterPath: "",
  };
  const { data, isLoading } = useGetMovieByIdQuery(movieId);
  const [userInput, setUserInput] = useState(initialValues);
  useEffect(() => {
    if (props.show) {
      if (!movieId) {
        // Reset form for "Add Movie"
        setUserInput(initialValues);
      } else if (!isLoading && data?.result) {
        // Populate form for "Update Movie"
        setUserInput({
          ...data.result,
          releaseDate: moment(data.result.releaseDate).format("YYYY-MM-DD"),
        });
      }
    }
  }, [props.show, movieId, data, isLoading]);
  const handleInputChange = (e) => {
    const tempData = inputHelper(e, userInput);
    setUserInput(tempData);
  };

  const [createMovie] = useCreateMovieMutation();
  const [updateMovie] = useUpdateMovieMutation();
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      let response;
      if (movieId) {
        response = await updateMovie(userInput).unwrap();
      } else {
        response = await createMovie(userInput).unwrap();
      }
      if (response.success) {
        toastNotify({ message: response.message, type: "success" });
        setUserInput(initialValues);
        props.onHide();
      } else {
        toastNotify({ message: response.message, type: "error" });
      }
    } catch (error) {
      toastNotify({ message: error.message, type: "error" });
    }
  };
  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          <span className="text-center">
            {movieId ? "Update" : "Add"} Movie
          </span>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row">
          <div className="col-md-12">
            <div className="mb-3">
              <label htmlFor="title" className="form-label">
                Title
              </label>
              <input
                type="text"
                className="form-control"
                id="title"
                name="title"
                placeholder="Enter title"
                value={userInput.title}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="col-md-12">
            <div className="mb-3">
              <label htmlFor="description" className="form-label">
                Description
              </label>
              <textarea
                type="text"
                className="form-control"
                id="description"
                name="description"
                placeholder="Enter description"
                value={userInput.description}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="col-md-4">
            <div className="mb-3">
              <label htmlFor="duration" className="form-label">
                Duration
              </label>
              <input
                type="number"
                min={1}
                className="form-control"
                id="duration"
                name="duration"
                placeholder="Enter duration"
                value={userInput.duration}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="col-md-4">
            <div className="mb-3">
              <label htmlFor="language" className="form-label">
                Language
              </label>
              <select
                className="form-select"
                id="language"
                name="language"
                value={userInput.language}
                onChange={handleInputChange}
              >
                <option value={""}>--Select Language--</option>
                <option value={"English"}>English</option>
                <option value={"Hindi"}>Hindi</option>
                <option value={"Punjabi"}>Punjabi</option>
                <option value={"Bengali"}>Bengali</option>
                <option value={"Marathi"}>Marathi</option>
                <option value={"Kannada"}>Kannada</option>
                <option value={"Malayalam"}>Malayalam</option>
                <option value={"Telugu"}>Telugu</option>
              </select>
            </div>
          </div>
          <div className="col-md-4">
            <div className="mb-3">
              <label htmlFor="releaseDate" className="form-label">
                Release Date
              </label>
              <input
                type="date"
                className="form-control"
                id="releaseDate"
                name="releaseDate"
                value={userInput.releaseDate}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="col-md-4">
            <div className="mb-3">
              <label htmlFor="genre" className="form-label">
                Genre
              </label>
              <select
                className="form-select"
                id="genre"
                name="genre"
                value={userInput.genre}
                onChange={handleInputChange}
              >
                <option value={""}>--Select Genre--</option>
                <option value={"Action"}>Action</option>
                <option value={"Thriller"}>Thriller</option>
                <option value={"Horror"}>Horror</option>
                <option value={"Romance"}>Romance</option>
                <option value={"Fiction"}>Fiction</option>
              </select>
            </div>
          </div>
          <div className="col-md-8">
            <div className="mb-3">
              <label htmlFor="posterPath" className="form-label">
                Poster Path
              </label>
              <input
                type="text"
                className="form-control"
                id="posterPath"
                name="posterPath"
                placeholder="Enter poster URL"
                value={userInput.posterPath}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer className="d-flex flex-row justify-content-center">
        <button onClick={handleSubmit} className="btn btn-outline-success">
          {movieId ? "Update" : "Submit"}
        </button>
        <button onClick={props.onHide} className="btn btn-outline-primary">
          Close
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default MovieForm;
