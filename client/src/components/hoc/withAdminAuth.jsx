import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

const withAdminAuth = (WrappedComponent) => {
  return (props) => {
    const user = useSelector((state) => state.userStore.user);
    const navigate = useNavigate();
    useEffect(() => {
      if (!user) {
        console.log("redirect to login");
        navigate("/login");
      } else if (user.role !== "admin") {
        navigate("/accessDenied");
      }
    }, [user]);
    if (!user || user.role !== "admin") {
      return null;
    }
    return <WrappedComponent {...props} />;
  };
};

export default withAdminAuth;
