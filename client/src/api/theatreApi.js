import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const theatreApi = createApi({
  reducerPath: "theatreApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/theatres" }),
  endpoints: (builder) => ({
    getAllTheatres: builder.query({
      query: () => ({
        url: "/",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      providesTags: ["theatres"],
    }),
    getTheatreById: builder.query({
      query: (theatreId) => ({
        url: `/${theatreId}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      providesTags: ["theatres"],
    }),
    getTheatresByOwner: builder.query({
      query: () => ({
        url: "/user",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      providesTags: ["theatres"],
    }),
    createTheatre: builder.mutation({
      query: (theatreObj) => ({
        url: "/",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: theatreObj,
      }),
      invalidatesTags: ["theatres"],
    }),
    updateTheatre: builder.mutation({
      query: (theatreObj) => ({
        url: `/${theatreObj._id}`,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: theatreObj,
      }),
      invalidatesTags: ["theatres"],
    }),
    changeTheatreStatus: builder.mutation({
      query: (theatreId) => ({
        url: `/${theatreId}`,
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["theatres"],
    }),
    deleteTheatre: builder.mutation({
      query: (theatreId) => ({
        url: `/${theatreId}`,
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["theatres"],
    }),
  }),
});

export const {
  useGetAllTheatresQuery,
  useGetTheatreByIdQuery,
  useGetTheatresByOwnerQuery,
  useCreateTheatreMutation,
  useUpdateTheatreMutation,
  useChangeTheatreStatusMutation,
  useDeleteTheatreMutation,
} = theatreApi;
