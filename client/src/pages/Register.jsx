import React, { useState } from "react";
import inputHelper from "../helper/inputHelper.js";
import { useRegisterUserMutation } from "../api/userApi.js";
import toastNotify from "../helper/toastNotify.js";
import { useNavigate } from "react-router";
import MainLoader from "../components/common/MainLoader.jsx";

const Register = () => {
  const initialState = {
    name: "",
    phone: "",
    email: "",
    role: "",
    password: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  };
  const [userInput, setUserInput] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [registerUser] = useRegisterUserMutation();
  const handleInputChange = (e) => {
    const tempData = inputHelper(e, userInput);
    setUserInput(tempData);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await registerUser(userInput).unwrap();
      if (response.success) {
        toastNotify({ message: response.message, type: "success" });
        navigate("/login");
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
  } else
    return (
      <div className="container mt-5 border border-gray-200 p-4">
        <h2>Register</h2>
        <form className="row g-3">
          <div className="col-md-6">
            <label htmlFor="name" className="form-label">
              Name
            </label>
            <input
              type="email"
              className="form-control"
              id="name"
              name="name"
              value={userInput.name}
              onChange={handleInputChange}
            />
          </div>

          <div className="col-md-6">
            <label htmlFor="phone" className="form-label">
              Phone
            </label>
            <input
              type="text"
              className="form-control"
              id="phone"
              name="phone"
              value={userInput.phone}
              onChange={handleInputChange}
            />
          </div>

          <div className="col-md-6">
            <label htmlFor="inputEmail4" className="form-label">
              Email
            </label>
            <input
              type="email"
              className="form-control"
              id="inputEmail4"
              name="email"
              value={userInput.email}
              onChange={handleInputChange}
            />
          </div>

          <div className="col-md-6">
            <label htmlFor="inputPassword4" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              name="password"
              id="inputPassword4"
              value={userInput.password}
              onChange={handleInputChange}
            />
          </div>

          <div className="col-md-6">
            <label htmlFor="inputAddress" className="form-label">
              Address
            </label>
            <input
              type="text"
              className="form-control"
              id="inputAddress"
              name="address"
              placeholder="1234 Main St"
              value={userInput.address}
              onChange={handleInputChange}
            />
          </div>

          <div className="col-md-6">
            <label htmlFor="role" className="form-label">
              Role
            </label>
            <select
              id="role"
              className="form-select"
              name="role"
              value={userInput.role}
              onChange={handleInputChange}
            >
              <option value="">--Select Role--</option>
              <option value="user">User</option>
              <option value="partner">Partner</option>
            </select>
          </div>

          <div className="col-md-4">
            <label htmlFor="inputCity" className="form-label">
              City
            </label>
            <input
              type="text"
              className="form-control"
              id="inputCity"
              name="city"
              value={userInput.city}
              onChange={handleInputChange}
            />
          </div>

          <div className="col-md-4">
            <label htmlFor="inputState" className="form-label">
              State
            </label>
            <input
              id="inputState"
              className="form-control"
              name="state"
              value={userInput.state}
              onChange={handleInputChange}
            />
          </div>

          <div className="col-md-4">
            <label htmlFor="inputZip" className="form-label">
              Zip
            </label>
            <input
              type="text"
              className="form-control"
              id="inputZip"
              name="zip"
              value={userInput.zip}
              onChange={handleInputChange}
            />
          </div>

          <div className="col-12 d-flex justify-content-center align-items-center">
            <button
              disabled={loading}
              onClick={handleRegister}
              type="submit"
              className="btn btn-primary form-control w-25"
            >
              Register
            </button>
          </div>
        </form>
      </div>
    );
};

export default Register;
