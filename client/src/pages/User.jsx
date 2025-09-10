import React from "react";
import withAuth from "../components/hoc/withAuth.jsx";

const User = () => {
  return (
    <div>
      <h2>User</h2>
    </div>
  );
};

export default withAuth(User);
