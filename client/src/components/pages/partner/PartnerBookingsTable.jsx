import React, { useState } from "react";
import { useGetBookingsForPartnerQuery } from "../../../api/bookingApi.js";
import BookingList from "../booking/BookingList.jsx";
import MainLoader from "../../common/MainLoader.jsx";
import Pagination from "../../common/Pagination.jsx";

const PartnerBookingsTable = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useGetBookingsForPartnerQuery({ page });

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

export default PartnerBookingsTable;
