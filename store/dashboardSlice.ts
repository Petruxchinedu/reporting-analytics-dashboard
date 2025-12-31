import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface DashboardState {
  filters: { [key: string]: any };
  chartData: any[];
}

const initialState: DashboardState = {
  filters: {},
  chartData: [],
};

export const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<{ [key: string]: any }>) => {
      state.filters = action.payload;
    },
    setChartData: (state, action: PayloadAction<any[]>) => {
      state.chartData = action.payload;
    },
  },
});

export const { setFilters, setChartData } = dashboardSlice.actions;
export default dashboardSlice.reducer;
