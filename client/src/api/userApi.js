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
    getAllUsers: builder.query({
      query: () => ({
        method: "GET",
        url: "/users",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      providesTags: ["user"],
    }),
    verifyUser: builder.mutation({
      query: (userId) => ({
        method: "PATCH",
        url: `/${userId}`,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["user"],
    }),
    forgotPassword: builder.mutation({
      query: (userObj) => ({
        method: "POST",
        url: "/forgotPassword",
        headers: {
          "Content-Type": "application/json",
        },
        body: userObj,
      }),
    }),
    resetPassword: builder.mutation({
      query: (userObj) => ({
        method: "POST",
        url: "/resetPassword",
        headers: {
          "Content-Type": "application/json",
        },
        body: userObj,
      }),
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useLogoutUserMutation,
  useVerifyUserMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useCurrentUserQuery,
  useGetAllUsersQuery,
} = userApi;
