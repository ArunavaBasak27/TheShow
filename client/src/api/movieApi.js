import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const movieApi = createApi({
  reducerPath: "movieApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/movies" }),
  endpoints: (builder) => ({
    getAllMovies: builder.query({
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
          url: queryString ? `/?${queryString}` : `/`,
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        };
      },
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
