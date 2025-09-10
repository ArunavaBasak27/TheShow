import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userApi = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: "/api/user" }),
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (userData) => ({
        method: "POST",
        url: "/register",
        headers: {
          "Content-Type": "application/json",
        },
        body: userData,
      }),
    }),
    loginUser: builder.mutation({
      query: (userData) => ({
        method: "POST",
        url: "/login",
        headers: {
          "Content-Type": "application/json",
        },
        body: userData,
      }),
    }),
    logoutUser: builder.mutation({
      query: () => ({
        method: "POST",
        url: "/logout",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
    currentUser: builder.query({
      query: () => ({
        method: "GET",
        url: "/",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useLogoutUserMutation,
  useCurrentUserQuery,
} = userApi;
