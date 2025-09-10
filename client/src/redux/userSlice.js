import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    setLoggedInUser: (state, action) => {
      console.log(action.payload);
      state.user = action.payload;
    },
  },
});

export const { setLoggedInUser } = userSlice.actions;
