import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useEffect } from "react";

const withAuth = (WrappedComponent) => {
  return (props) => {
    const user = useSelector((state) => state.userStore.user);
    const navigate = useNavigate();
    useEffect(() => {
      if (!user) {
        navigate("/login");
      } else if (!["admin", "user"].includes(user.role)) {
        navigate("/accessDenied");
      }
    }, []);
    if (!user) {
      return null; // Or null if you prefer
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
