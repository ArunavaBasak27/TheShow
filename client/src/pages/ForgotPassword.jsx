import React, { useState } from "react";
import inputHelper from "../helper/inputHelper.js";
import { useForgotPasswordMutation } from "../api/userApi.js";
import toastNotify from "../helper/toastNotify.js";
import { Link, useNavigate } from "react-router";

const ForgotPassword = () => {
  const initialState = {
    email: "",
  };
  const [userInput, setUserInput] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [forgotPassword] = useForgotPasswordMutation();
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await forgotPassword(userInput).unwrap();
      if (response.success) {
        toastNotify({ message: response.message, type: "success" });
        navigate("/reset-password");
      } else {
        throw new Error(response.message);
      }
    } catch (e) {
      toastNotify({ message: e.message, type: "error" });
    }
    setLoading(false);
  };
  const handleInputChange = (e) => {
    const tempData = inputHelper(e, userInput);
    setUserInput(tempData);
  };

  return (
    <div className="container mt-5 d-flex justify-content-center">
      <div
        className="border border-gray-300 p-4 rounded shadow-sm w-100"
        style={{ maxWidth: "500px" }}
      >
        <h2 className="text-center mb-4">Forgot Password</h2>
        <form onSubmit={handleSubmit}>
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

          <div className="d-grid">
            <button
              disabled={loading}
              type="submit"
              className="btn btn-primary"
            >
              Send OTP
            </button>
          </div>
          <div className="mb-3 text-center">
            Already have OTP?
            <Link
              to="/reset-password"
              className="text-decoration-none text-primary"
            >
              Reset Password
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
