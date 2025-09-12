import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const movieApi = createApi({
  reducerPath: "movieApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/movies" }),
  endpoints: (builder) => ({
    getAllMovies: builder.query({
      query: () => ({
        url: "/",
        method: "GET",
        headers: {
          contentType: "application/json",
        },
      }),
      providesTags: ["movies"],
    }),
    getMovieById: builder.query({
      query: (movieId) => ({
        url: `/${movieId}`,
        method: "GET",
        headers: {
          contentType: "application/json",
        },
      }),
      providesTags: ["movies"],
    }),
    createMovie: builder.mutation({
      query: (movieObj) => ({
        url: `/`,
        method: "POST",
        headers: {
          contentType: "application/json",
        },
        body: movieObj,
      }),
      invalidatesTags: ["movies"],
    }),
    updateMovie: builder.mutation({
      query: (movieObj) => ({
        url: `/${movieObj._id}`,
        method: "PUT",
        headers: {
          contentType: "application/json",
        },
        body: movieObj,
      }),
      invalidatesTags: ["movies"],
    }),
    deleteMovie: builder.mutation({
      query: (movieId) => ({
        url: `/${movieId}`,
        method: "DELETE",
        headers: {
          contentType: "application/json",
        },
      }),
      invalidatesTags: ["movies"],
    }),
  }),
});

export const {
  useGetAllMoviesQuery,
  useGetMovieByIdQuery,
  useCreateMovieMutation,
  useUpdateMovieMutation,
  useDeleteMovieMutation,
} = movieApi;
