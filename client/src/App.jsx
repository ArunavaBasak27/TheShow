import Header from "./components/Header.jsx";
import { Route, Routes } from "react-router";
import Home from "./pages/Home.jsx";
import Admin from "./pages/Admin.jsx";
import Partner from "./pages/Partner.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import { useEffect } from "react";
import { useCurrentUserQuery } from "./api/userApi.js";
import { useDispatch } from "react-redux";
import { setLoggedInUser } from "./redux/userSlice.js";

function App() {
  const { data, isLoading } = useCurrentUserQuery();
  const dispatch = useDispatch();
  useEffect(() => {
    if (!isLoading) {
      dispatch(setLoggedInUser(data.result));
    }
  }, [data, isLoading, dispatch]);

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/partner" element={<Partner />} />
        <Route path="/user" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<h2>Error</h2>} />
      </Routes>
    </>
  );
}

export default App;
