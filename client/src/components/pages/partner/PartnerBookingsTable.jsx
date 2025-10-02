import React from "react";
import { useGetBookingsForPartnerQuery } from "../../../api/bookingApi.js";
import BookingList from "../booking/BookingList.jsx";
import MainLoader from "../../common/MainLoader.jsx";

const PartnerBookingsTable = () => {
  const { data, isLoading } = useGetBookingsForPartnerQuery();

  if (isLoading) {
    return <MainLoader />;
  } else {
    return <BookingList bookings={data?.result} />;
  }
};

export default PartnerBookingsTable;
