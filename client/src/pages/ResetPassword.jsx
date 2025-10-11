import React, { useState } from "react";
import { useResetPasswordMutation } from "../api/userApi.js";
import { useNavigate } from "react-router";
import toastNotify from "../helper/toastNotify.js";
import inputHelper from "../helper/inputHelper.js";

const ResetPassword = () => {
  const initialState = {
    otp: "",
    password: "",
  };
  const [userInput, setUserInput] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [resetPassword] = useResetPasswordMutation();
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await resetPassword(userInput).unwrap();
      if (response.success) {
        toastNotify({ message: response.message, type: "success" });
        navigate("/login");
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
        <h2 className="text-center mb-4">Reset Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="otp" className="form-label">
              OTP
            </label>
            <input
              type="password"
              className="form-control"
              id="otp"
              name="otp"
              value={userInput.otp}
              onChange={handleInputChange}
              placeholder="Enter your otp"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              value={userInput.password}
              onChange={handleInputChange}
              placeholder="Enter new password"
              required
            />
          </div>
          <div className="d-grid">
            <button
              disabled={loading}
              type="submit"
              className="btn btn-primary"
            >
              Reset Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
