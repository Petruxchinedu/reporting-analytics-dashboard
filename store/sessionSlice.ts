import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SessionState {
  user: { email: string; name?: string } | null;
  isAuthenticated: boolean;
}

const initialState: SessionState = {
  user: null,
  isAuthenticated: false,
};

const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<{ email: string; name?: string }>) {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    clearUser(state) {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setUser, clearUser } = sessionSlice.actions;
export default sessionSlice.reducer;
