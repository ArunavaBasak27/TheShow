import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

const withPartnerAuth = (WrappedComponent) => {
  return (props) => {
    const user = useSelector((state) => state.userStore.user);
    const navigate = useNavigate();
    useEffect(() => {
      if (!user) {
        navigate("/login");
      } else if (!["admin", "partner"].includes(user.role)) {
        navigate("/accessDenied");
      }
    }, []);
    if (!user) {
      return null;
    }
    return <WrappedComponent {...props} />;
  };
};

export default withPartnerAuth;
