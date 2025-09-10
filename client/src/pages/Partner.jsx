import React from "react";
import withPartnerAuth from "../components/hoc/withPartnerAuth.jsx";

const Partner = () => {
  return (
    <div>
      <h2>Partner</h2>
    </div>
  );
};

export default withPartnerAuth(Partner);
