import React from "react";
import { useGetBookingsForUserQuery } from "../../../api/bookingApi.js";
import MainLoader from "../../common/MainLoader.jsx";
import BookingList from "../booking/BookingList.jsx";

const UserBookingsTable = () => {
  const { data, isLoading } = useGetBookingsForUserQuery();

  if (isLoading) {
    return <MainLoader />;
  } else {
    return <BookingList bookings={data?.result} />;
  }
};

export default UserBookingsTable;
