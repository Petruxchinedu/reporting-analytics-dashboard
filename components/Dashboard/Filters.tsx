"use client";

import { HStack, NativeSelect } from "@chakra-ui/react"; // Use NativeSelect instead
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store"; // Fixed path based on your folder structure
import { setMetric, setRegion, setDateRange } from "../../store/filtersSlice";

export default function DashboardFilters() {
  const dispatch = useDispatch();
  const { metric, region, dateRange } = useSelector(
    (state: RootState) => state.filters
  );

  return (
    <HStack gap="4" mb="6"> {/* v3 uses 'gap' instead of 'spacing' */}
      
      <NativeSelect.Root size="sm" width="200px">
        <NativeSelect.Field 
          value={metric} 
          onChange={(e) => dispatch(setMetric(e.target.value as any))}
        >
          <option value="revenue">Revenue</option>
          <option value="users">Users</option>
          <option value="sessions">Sessions</option>
        </NativeSelect.Field>
        <NativeSelect.Indicator />
      </NativeSelect.Root>

      <NativeSelect.Root size="sm" width="200px">
        <NativeSelect.Field 
          value={region} 
          onChange={(e) => dispatch(setRegion(e.target.value as any))}
        >
          <option value="global">Global</option>
          <option value="africa">Africa</option>
          <option value="europe">Europe</option>
        </NativeSelect.Field>
        <NativeSelect.Indicator />
      </NativeSelect.Root>

      <NativeSelect.Root size="sm" width="200px">
        <NativeSelect.Field 
          value={dateRange} 
          onChange={(e) => dispatch(setDateRange(e.target.value as any))}
        >
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="90d">Last 90 Days</option>
        </NativeSelect.Field>
        <NativeSelect.Indicator />
      </NativeSelect.Root>

    </HStack>
  );
}