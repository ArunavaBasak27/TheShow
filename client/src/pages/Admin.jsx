import React from "react";
import { Nav, Tab } from "react-bootstrap";
import MovieList from "../components/pages/admin/MovieList.jsx";
import TheatreList from "../components/pages/admin/TheatreList.jsx";
import useAuth from "../components/hooks/useAuth.js";

const Admin = () => {
  const user = useAuth(["admin"]);
  if (!user) return null;

  return (
    <div className="container m-3">
      <Tab.Container defaultActiveKey="movies">
        <Nav variant="tabs">
          <Nav.Item>
            <Nav.Link eventKey="movies">Movies</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="theatres">Theatres</Nav.Link>
          </Nav.Item>
        </Nav>
        <Tab.Content>
          <Tab.Pane eventKey="movies">
            <MovieList />
          </Tab.Pane>
          <Tab.Pane eventKey="theatres">
            <TheatreList />
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </div>
  );
};

// export default Admin;
export default Admin;
