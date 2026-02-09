import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type MetricType = "revenue" | "users" | "sessions";
export type RegionType = "global" | "us" | "eu" | "asia";
export type DateRangeType = "7d" | "30d" | "90d";

interface FiltersState {
  metric: MetricType;
  region: RegionType;
  dateRange: DateRangeType;
}

const initialState: FiltersState = {
  metric: "revenue",
  region: "global",
  dateRange: "7d",
};

const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setMetric(state, action: PayloadAction<MetricType>) {
      state.metric = action.payload;
    },
    setRegion(state, action: PayloadAction<RegionType>) {
      state.region = action.payload;
    },
    setDateRange(state, action: PayloadAction<DateRangeType>) {
      state.dateRange = action.payload;
    },
  },
});

export const {
  setMetric,
  setRegion,
  setDateRange,
} = filtersSlice.actions;

export default filtersSlice.reducer;
