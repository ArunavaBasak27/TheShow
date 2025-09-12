import { configureStore } from "@reduxjs/toolkit";
import { userSlice } from "./userSlice.js";
import { userApi } from "../api/userApi.js";
import { movieApi } from "../api/movieApi.js";

export const store = configureStore({
  reducer: {
    userStore: userSlice.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [movieApi.reducerPath]: movieApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(userApi.middleware)
      .concat(movieApi.middleware),
});
