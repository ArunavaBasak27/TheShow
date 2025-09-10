import React, { useState } from "react";
import { useLoginUserMutation } from "../api/userApi.js";
import inputHelper from "../helper/inputHelper.js";
import { setLoggedInUser } from "../redux/userSlice.js";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
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
        console.log(response.result);
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
    <div className="container mt-5 border border-gray-200 p-5">
      <h2 className="text-center mb-3">Login</h2>
      <form onSubmit={handleLogin}>
        <div className="row mb-3">
          <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">
            Email
          </label>
          <div className="col-sm-10">
            <input
              type="email"
              className="form-control"
              id="inputEmail3"
              name="email"
              value={userInput.email}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="inputPassword3" className="col-sm-2 col-form-label">
            Password
          </label>
          <div className="col-sm-10">
            <input
              type="password"
              className="form-control"
              id="inputPassword3"
              name="password"
              value={userInput.password}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className="d-flex justify-content-center align-items-center">
          <button
            disabled={loading}
            type="submit"
            className="btn btn-primary form-control w-25"
          >
            Sign in
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
