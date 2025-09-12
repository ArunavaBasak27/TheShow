import React, { useState } from "react";
import { Table } from "react-bootstrap";
import MovieForm from "./MovieForm.jsx";

const MovieList = () => {
  const [modalShow, setModalShow] = useState(false);

  return (
    <div className="container m-3 p-3">
      <button
        className="btn btn-outline-primary"
        onClick={() => setModalShow(true)}
      >
        <i className="bi bi-plus"></i> Add Movie
      </button>
      <Table responsive="sm">
        <thead>
          <tr>
            <th>#</th>
            <th>Table heading</th>
            <th>Table heading</th>
            <th>Table heading</th>
            <th>Table heading</th>
            <th>Table heading</th>
            <th>Table heading</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>Table cell</td>
            <td>Table cell</td>
            <td>Table cell</td>
            <td>Table cell</td>
            <td>Table cell</td>
            <td>Table cell</td>
          </tr>
        </tbody>
      </Table>

      <MovieForm show={modalShow} onHide={() => setModalShow(false)} />
    </div>
  );
};

export default MovieList;
