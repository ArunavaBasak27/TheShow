import React from "react";
import { useGetAllMoviesQuery } from "../api/movieApi.js";
import MainLoader from "../components/common/MainLoader.jsx";
import Movie from "../components/pages/home/Movie.jsx";
import Pagination from "../components/common/Pagination.jsx";
import { useTableSearch } from "../components/hooks/useTableSearch.js";
import SearchBar from "../components/common/SearchBar.jsx";

const Home = () => {
  const {
    page,
    searchTerm,
    debouncedSearch,
    handleSearch,
    handleClearSearch,
    setPage,
  } = useTableSearch(1, 500);

  const { data, isLoading } = useGetAllMoviesQuery({
    page,
    search: debouncedSearch,
  });
  if (isLoading) {
    return <MainLoader />;
  }
  return (
    <div className="d-flex flex-column align-items-center justify-content-center mb-3">
      <div className="container py-5">
        <h1 className="text-center mb-5 fw-bold">Now Showing</h1>
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={handleSearch}
          onClear={handleClearSearch}
          placeholder="Search by title, description, genre, or language..."
          resultsCount={data?.total_items}
          resultsQuery={debouncedSearch}
        />

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
