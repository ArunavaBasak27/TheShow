import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const bookingApi = createApi({
  reducerPath: "bookingApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/bookings" }),
  endpoints: (builder) => ({
    getBookingsForUser: builder.query({
      query: ({ page, limit, search } = {}) => {
        const isPaginated = page !== undefined || limit !== undefined;

        const params = new URLSearchParams();

        if (isPaginated) {
          params.append("page", page || 1);
          params.append("limit", limit || 4);
        }

        if (search) {
          params.append("search", search);
        }

        const queryString = params.toString();

        return {
          url: `/user/?${queryString}`,
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        };
      },
    }),
    getBookingsForPartner: builder.query({
      query: ({ user, page, limit, search } = {}) => {
        const isPaginated = page !== undefined || limit !== undefined;

        const params = new URLSearchParams();

        if (isPaginated) {
          params.append("page", page || 1);
          params.append("limit", limit || 4);
        }

        if (search) {
          params.append("search", search);
        }

        const queryString = params.toString();

        return {
          url: `/partner/?${queryString}`,
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
