import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const bookingApi = createApi({
  reducerPath: "bookingApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/bookings" }),
  endpoints: (builder) => ({
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
  }),
});

export const { useCreateBookingMutation } = bookingApi;
