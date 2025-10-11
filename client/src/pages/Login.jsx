import React, { useState } from "react";
import { useLoginUserMutation } from "../api/userApi.js";
import inputHelper from "../helper/inputHelper.js";
import { setLoggedInUser } from "../redux/userSlice.js";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router";
import toastNotify from "../helper/toastNotify.js";
import MainLoader from "../components/common/MainLoader.jsx";

const Login = () => {
  const [loginUser] = useLoginUserMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const initialState = {
    email: "",
    password: "",
  };
  const [userInput, setUserInput] = useState(initialState);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const tempData = inputHelper(e, userInput);
    setUserInput(tempData);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await loginUser(userInput).unwrap();
      if (response.success) {
        dispatch(setLoggedInUser(response.result));
        toastNotify({ message: "Logged in successfully", type: "success" });
        navigate("/");
      } else {
        toastNotify({ message: response.message, type: "error" });
      }
    } catch (error) {
      toastNotify({ message: error.message, type: "error" });
    }
    setLoading(false);
  };

  if (loading) {
    return <MainLoader />;
  }

  return (
    <div className="container mt-5 d-flex justify-content-center">
      <div
        className="border border-gray-300 p-4 rounded shadow-sm w-100"
        style={{ maxWidth: "500px" }}
      >
        <h2 className="text-center mb-4">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label htmlFor="inputEmail3" className="form-label">
              Email
            </label>
            <input
              type="email"
              className="form-control"
              id="inputEmail3"
              name="email"
              value={userInput.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-2">
            <label htmlFor="inputPassword3" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="inputPassword3"
              name="password"
              value={userInput.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              required
            />
          </div>
          <div className="mb-3 text-end">
            <Link
              to="/forgot-password"
              className="text-decoration-none text-primary"
            >
              Forgot Password?
            </Link>
          </div>
          <div className="d-grid">
            <button
              disabled={loading}
              type="submit"
              className="btn btn-primary"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
