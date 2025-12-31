import { configureStore } from "@reduxjs/toolkit";
import sessionReducer from "./sessionSlice";
import filtersReducer from "./filtersSlice";
import authReducer from "./authSlice"; // New slice for user authentication

export const store = configureStore({
  reducer: {
    session: sessionReducer,
    filters: filtersReducer,
    auth: authReducer, // Added auth slice
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
