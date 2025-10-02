import React from "react";
import useAuth from "../components/hooks/useAuth.js";
import { Nav, Tab } from "react-bootstrap";
import TheatresTable from "../components/pages/partner/TheatresTable.jsx";
import PartnerBookingsTable from "../components/pages/partner/PartnerBookingsTable.jsx";

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
            <PartnerBookingsTable />
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </div>
  );
};

export default Partner;
