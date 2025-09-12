import React from "react";
import useAuth from "../components/hooks/useAuth.js";

const Partner = () => {
  const user = useAuth(["partner"]);
  if (!user) return null;

  return (
    <div>
      <h2>Partner</h2>
    </div>
  );
};

export default Partner;
