import React from "react";
import useAuth from "../components/hooks/useAuth.js";
import { Nav, Tab } from "react-bootstrap";
import UserBookingsTable from "../components/pages/user/UserBookingsTable.jsx";

const User = () => {
  const user = useAuth(["admin", "user", "partner"]);
  if (!user) return null;

  return (
    <div className="container m-3">
      <Tab.Container defaultActiveKey="bookings">
        <Nav variant="tabs">
          <Nav.Item>
            <Nav.Link eventKey="bookings">Bookings</Nav.Link>
          </Nav.Item>
        </Nav>
        <Tab.Content>
          <Tab.Pane eventKey="bookings">
            <UserBookingsTable />
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </div>
  );
};

export default User;
