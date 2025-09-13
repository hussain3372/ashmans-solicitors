import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthState } from "../../shared/types/auth";

const initialState = {
  offences: {},
};

const offencesSlice = createSlice({
  name: "offence",
  initialState,
  reducers: {
    setOffences: (state, action: PayloadAction<AuthState>) => {
      state.offences = action.payload;
    },
  },
});

export const { setOffences } = offencesSlice.actions;

export default offencesSlice.reducer;
