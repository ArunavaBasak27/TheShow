import React from "react";
import withAdminAuth from "../components/hoc/withAdminAuth.jsx";

const Admin = () => {
  return (
    <div>
      <h2>Admin panel</h2>
    </div>
  );
};

export default withAdminAuth(Admin);
