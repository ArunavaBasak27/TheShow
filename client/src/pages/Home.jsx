import React, { useState } from "react";
import { useGetAllMoviesQuery } from "../api/movieApi.js";
import MainLoader from "../components/common/MainLoader.jsx";
import Movie from "../components/pages/home/Movie.jsx";
import Pagination from "../components/common/Pagination.jsx";

const Home = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useGetAllMoviesQuery({ page });
  if (isLoading) {
    return <MainLoader />;
  }
  return (
    <div className="d-flex flex-column align-items-center justify-content-center mb-3">
      <div className="container py-5">
        <h1 className="text-center mb-5 fw-bold">Now Showing</h1>
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
          {data.result?.map((movie, index) => {
            return <Movie movie={movie} key={index} />;
          })}
        </div>
      </div>
      <Pagination
        onPageChange={(page) => setPage(page)}
        currentPage={page}
        totalPages={data.total_pages}
      />
    </div>
  );
};
export default Home;
