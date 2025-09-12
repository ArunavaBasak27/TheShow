import React from "react";
import useAuth from "../components/hooks/useAuth.js";

const User = () => {
  const user = useAuth(["admin", "user"]);
  if (!user) return null;
  return (
    <div>
      <h2>User</h2>
    </div>
  );
};

export default User;
