import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const bookingApi = createApi({
  reducerPath: "bookingApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/bookings" }),
  endpoints: (builder) => ({
    getBookingsForUser: builder.query({
      query: ({ page, limit } = {}) => {
        const isPaginated = page !== undefined || limit !== undefined;

        const queryParams = isPaginated
          ? `?page=${page || 1}&limit=${limit || 5}`
          : ""; // no query params = fetch all

        return {
          url: `/user/${queryParams}`,
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        };
      },
    }),
    getBookingsForPartner: builder.query({
      query: ({ page, limit } = {}) => {
        const isPaginated = page !== undefined || limit !== undefined;

        const queryParams = isPaginated
          ? `?page=${page || 1}&limit=${limit || 5}`
          : ""; // no query params = fetch all

        return {
          url: `/partner/${queryParams}`,
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        };
      },
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
