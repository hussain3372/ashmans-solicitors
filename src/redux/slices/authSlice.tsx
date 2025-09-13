import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthState } from "../../shared/types/auth";

const initialState = {
  name: "",
  email: "",
  profilePicture: "",
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<AuthState>) => {
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.profilePicture = action.payload.profilePicture;
      state.user = action.payload;
    },

    setUserLogo: (state, action: PayloadAction<AuthState["profilePicture"]>) => {
      state.profilePicture = action.payload;
    },
  },
});

export const selectMe = (state) => state.auth.user;

export const { setUser, setUserLogo } = authSlice.actions;

export default authSlice.reducer;
