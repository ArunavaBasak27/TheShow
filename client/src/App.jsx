import Header from "./components/layout/Header.jsx";
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
import Footer from "./components/layout/Footer.jsx";
import User from "./pages/User.jsx";
import AccessDenied from "./pages/AccessDenied.jsx";
import MovieDetails from "./pages/MovieDetails.jsx";
import ChooseShow from "./pages/ChooseShow.jsx";
import ShowsList from "./components/pages/partner/ShowsList.jsx";
import BookShow from "./pages/BookShow.jsx";

function App() {
  const { data, isLoading } = useCurrentUserQuery();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isLoading) {
      dispatch(setLoggedInUser(data?.result));
    }
  }, [data, isLoading, dispatch]);

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <main className="flex-grow-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/partner" element={<Partner />} />
          <Route
            path="/partner/theatre/:theatreId/shows"
            element={<ShowsList />}
          />
          <Route path="/user" element={<User />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/movie/:movieId" element={<MovieDetails />} />
          <Route path="/movie/:movieId/shows/:date" element={<ChooseShow />} />
          <Route
            path="/movie/:movieId/theatre/:theatreId/show/:showId"
            element={<BookShow />}
          />
          <Route path="/accessDenied" element={<AccessDenied />} />
          <Route path="*" element={<h2>Error</h2>} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
