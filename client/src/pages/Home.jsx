import React from "react";
import { useGetAllMoviesQuery } from "../api/movieApi.js";
import MainLoader from "../components/common/MainLoader.jsx";
import Movie from "../components/pages/home/Movie.jsx";

const Home = () => {
  const { data, isLoading } = useGetAllMoviesQuery();
  if (isLoading) {
    return <MainLoader />;
  }
  return (
    <div className="container py-5">
      <h1 className="text-center mb-5 fw-bold">Now Showing</h1>
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
        {data.result?.map((movie, index) => {
          return <Movie movie={movie} key={index} />;
        })}
      </div>
    </div>
  );
};
export default Home;
