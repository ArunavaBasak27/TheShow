import { configureStore } from "@reduxjs/toolkit";
import { userSlice } from "./userSlice.js";
import { userApi } from "../api/userApi.js";

export const store = configureStore({
  reducer: {
    userStore: userSlice.reducer,
    [userApi.reducerPath]: userApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(userApi.middleware),
});
