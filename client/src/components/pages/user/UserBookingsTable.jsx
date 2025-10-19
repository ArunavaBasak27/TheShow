import React, { useState } from "react";
import { useGetBookingsForUserQuery } from "../../../api/bookingApi.js";
import MainLoader from "../../common/MainLoader.jsx";
import BookingList from "../booking/BookingList.jsx";
import Pagination from "../../common/Pagination.jsx";

const UserBookingsTable = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useGetBookingsForUserQuery({ page });

  if (isLoading) {
    return <MainLoader />;
  } else {
    return (
      <>
        <BookingList bookings={data?.result} />
        {data?.total_pages > 1 && (
          <div className="d-flex justify-content-center mt-4">
            <Pagination
              totalPages={data.total_pages}
              onPageChange={(page) => setPage(page)}
            />
          </div>
        )}
      </>
    );
  }
};

export default UserBookingsTable;
