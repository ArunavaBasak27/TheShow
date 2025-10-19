import React from "react";
import { useGetBookingsForPartnerQuery } from "../../../api/bookingApi.js";
import BookingList from "../booking/BookingList.jsx";
import MainLoader from "../../common/MainLoader.jsx";
import Pagination from "../../common/Pagination.jsx";
import { useTableSearch } from "../../hooks/useTableSearch.js";
import SearchBar from "../../common/SearchBar.jsx";

const PartnerBookingsTable = () => {
  const {
    page,
    searchTerm,
    debouncedSearch,
    handleSearch,
    handleClearSearch,
    setPage,
  } = useTableSearch(1, 500);

  const { data, isLoading, isFetching } = useGetBookingsForPartnerQuery({
    page,
    search: debouncedSearch,
  });

  if (isLoading || isFetching) {
    return <MainLoader />;
  } else {
    return (
      <div className="container py-4">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
          <h4 className="fw-bold mb-0">Booking List</h4>
        </div>

        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={handleSearch}
          onClear={handleClearSearch}
          placeholder="Search by title, description, genre, or language..."
          resultsCount={data?.total_items}
          resultsQuery={debouncedSearch}
        />

        <BookingList bookings={data?.result} />

        {data?.total_pages > 1 && (
          <div className="d-flex justify-content-center mt-4">
            <Pagination
              totalPages={data.total_pages}
              currentPage={page}
              onPageChange={(page) => setPage(page)}
            />
          </div>
        )}
      </div>
    );
  }
};

export default PartnerBookingsTable;
