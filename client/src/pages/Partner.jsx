import React from "react";
import useAuth from "../components/hooks/useAuth.js";
import { Nav, Tab } from "react-bootstrap";
import TheatresTable from "../components/pages/partner/TheatresTable.jsx";
import BookingsTable from "../components/pages/partner/BookingsTable.jsx";

const Partner = () => {
  const user = useAuth(["partner"]);
  if (!user) return null;

  return (
    <div className="container m-3">
      <Tab.Container defaultActiveKey="theatres">
        <Nav variant="tabs">
          <Nav.Item>
            <Nav.Link eventKey="theatres">Theatres</Nav.Link>
          </Nav.Item>

          <Nav.Item>
            <Nav.Link eventKey="bookings">Bookings</Nav.Link>
          </Nav.Item>
        </Nav>
        <Tab.Content>
          <Tab.Pane eventKey="theatres">
            <TheatresTable />
          </Tab.Pane>

          <Tab.Pane eventKey="bookings">
            <BookingsTable />
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </div>
  );
};

export default Partner;
