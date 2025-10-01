import { configureStore } from "@reduxjs/toolkit";
import { userSlice } from "./userSlice.js";
import { userApi } from "../api/userApi.js";
import { movieApi } from "../api/movieApi.js";
import { theatreApi } from "../api/theatreApi.js";
import { showApi } from "../api/showApi.js";

export const store = configureStore({
  reducer: {
    userStore: userSlice.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [movieApi.reducerPath]: movieApi.reducer,
    [theatreApi.reducerPath]: theatreApi.reducer,
    [showApi.reducerPath]: showApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(userApi.middleware)
      .concat(movieApi.middleware)
      .concat(theatreApi.middleware)
      .concat(showApi.middleware),
});
