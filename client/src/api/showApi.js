import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const showApi = createApi({
  reducerPath: "showApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/shows" }),
  endpoints: (builder) => ({
    createShow: builder.mutation({
      query: (showObj) => ({
        url: `/${showObj.theatre}`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: showObj,
      }),
      invalidatesTags: ["shows"],
    }),
    updateShow: builder.mutation({
      query: (showObj) => ({
        url: `/${showObj._id}/theatre/${showObj.theatre}`,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: showObj,
      }),
      invalidatesTags: ["shows"],
    }),
    deleteShow: builder.mutation({
      query: (showObj) => ({
        url: `/${showObj._id}/theatre/${showObj.theatre}`,
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["shows"],
    }),
    getAllShows: builder.query({
      query: () => ({
        url: "/",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      providesTags: ["shows"],
    }),
    getShowById: builder.query({
      query: (showId) => ({
        url: `/${showId}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      providesTags: ["shows"],
    }),
    getShowsByTheatre: builder.query({
      query: ({ theatreId, page, limit } = {}) => {
        const isPaginated = page !== undefined || limit !== undefined;
        const queryParams = isPaginated
          ? `?theatre=${theatreId}&page=${page || 1}&limit=${limit || 4}`
          : `?theatre=${theatreId}`;
        return {
          url: `/${queryParams}`,
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        };
      },
      providesTags: ["shows"],
    }),
    getShowsByMovieAndDate: builder.query({
      query: ({ movieId, date }) => ({
        url: `?movie=${movieId}&date=${date}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      providesTags: ["shows"],
    }),
  }),
});

export const {
  useCreateShowMutation,
  useUpdateShowMutation,
  useDeleteShowMutation,
  useGetShowByIdQuery,
  useGetShowsByMovieAndDateQuery,
  useGetShowsByTheatreQuery,
} = showApi;
