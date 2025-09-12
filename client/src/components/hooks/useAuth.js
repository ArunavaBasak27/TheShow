import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { useCurrentUserQuery } from "../../api/userApi.js";

const useAuth = (allowedRoles) => {
  const { data, isLoading } = useCurrentUserQuery();
  const user = useSelector((state) => state.userStore.user);
  const navigate = useNavigate();
  useEffect(() => {
    if (!user && !isLoading && !data?.result) {
      navigate("/login");
    } else if (user && allowedRoles && !allowedRoles.includes(user.role)) {
      console.log(user.role);
      navigate("/accessDenied");
    }
  }, [allowedRoles, user, navigate, data, isLoading]);
  return user;
};

export default useAuth;
