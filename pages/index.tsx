"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Box, Heading, Text, Spinner, Center } from "@chakra-ui/react";
import DashboardLayout from "../components/layout/DashboardLayout";
import { useQuery } from "@tanstack/react-query";
import { fetchChartOverview } from "../lib/api/charts";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import LineChart from "../components/Charts/LineChart";
import DashboardFilters from "../components/Dashboard/Filters";

export default function IndexPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  /**
   * 🔐 Route protection
   * If user is not authenticated → redirect to login
   */
  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  /**
   * 🌍 Global dashboard filters (Redux)
   */
  const { metric, region, dateRange } = useSelector(
    (state: RootState) => state.filters
  );

  /**
   * 📊 Analytics data fetching (React Query)
   */
  const { data, isLoading, error } = useQuery({
    queryKey: ["dashboard-overview", metric, region, dateRange],
    queryFn: () => fetchChartOverview(metric, dateRange, region),
    enabled: status === "authenticated", // ⛔ prevent calls before auth
    staleTime: 1000 * 60, // 1 minute cache
  });

  /**
   * ⏳ Session loading state
   */
  if (status === "loading") {
    return (
      <Center h="100vh">
        <Spinner size="xl" color="teal.500" />
        <Text ml={4}>Verifying session...</Text>
      </Center>
    );
  }

  /**
   * ⛔ While redirecting, render nothing
   */
  if (status === "unauthenticated") return null;

  /**
   * ✅ Authenticated dashboard
   */
  return (
    <DashboardLayout>
      <Box p={4}>
        <Heading size="lg" mb={1}>
          Welcome, {session?.user?.name || session?.user?.email}
        </Heading>

        <Text color="gray.600" _dark={{ color: "gray.400" }} mb={6}>
          Analytics overview for your account
        </Text>

        {/* 🔎 Filters */}
        <DashboardFilters />

        {/* 📈 Chart */}
        {isLoading ? (
          <Spinner color="teal.500" />
        ) : error ? (
          <Text color="red.500" fontWeight="bold">
            Failed to load analytics data.
          </Text>
        ) : (
          <Box
            bg="white"
            _dark={{ bg: "gray.800" }}
            p={6}
            borderRadius="2xl"
            boxShadow="sm"
          >
            <LineChart
              labels={data.labels}
              data={data.data}
              title={data.metric.toUpperCase()}
            />
          </Box>
        )}
      </Box>
    </DashboardLayout>
  );
}
