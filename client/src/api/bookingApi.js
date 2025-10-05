import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const bookingApi = createApi({
  reducerPath: "bookingApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/bookings" }),
  endpoints: (builder) => ({
    getBookingsForUser: builder.query({
      query: () => ({
        url: "/user",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
    getBookingsForPartner: builder.query({
      query: () => ({
        url: "/partner",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
    createBooking: builder.mutation({
      query: (bookingObj) => ({
        url: "/",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: bookingObj,
      }),
    }),
    initiatePayment: builder.mutation({
      query: (bookingObj) => ({
        url: "/initiatePayment",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: bookingObj,
      }),
    }),
  }),
});

export const {
  useGetBookingsForUserQuery,
  useGetBookingsForPartnerQuery,
  useCreateBookingMutation,
  useInitiatePaymentMutation,
} = bookingApi;
