import React from "react";
import { Link } from "react-router";
import { useLogoutUserMutation } from "../api/userApi.js";
import { useDispatch, useSelector } from "react-redux";
import { setLoggedInUser } from "../redux/userSlice.js";

const Header = () => {
  const [logoutUser] = useLogoutUserMutation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.userStore.user);

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      const response = await logoutUser();
      if (response.data.success) {
        dispatch(setLoggedInUser(null));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg bg-dark navbar-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          The Show
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/admin">
                Admin Panel
              </Link>
            </li>
          </ul>

          <div className="d-flex align-items-center gap-3">
            {user && user.id ? (
              <>
                <span className="text-light">Hello, {user.name}</span>
                <button
                  onClick={handleLogout}
                  className="btn btn-outline-warning"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link className="btn btn-outline-primary" to="/login">
                  Login
                </Link>
                <Link className="btn btn-outline-secondary" to="/register">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
