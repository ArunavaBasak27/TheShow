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
      query: ({ theatreId, page, limit, search } = {}) => {
        const isPaginated = page !== undefined || limit !== undefined;

        const params = new URLSearchParams();
        params.append("theatre", theatreId);

        if (isPaginated) {
          params.append("page", page || 1);
          params.append("limit", limit || 4);
        }
        if (search) {
          params.append("search", search);
        }

        const queryString = params.toString();

        return {
          url: `/?${queryString}`,
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
