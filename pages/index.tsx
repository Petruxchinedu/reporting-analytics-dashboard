import { useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { Box, Heading, Text, Spinner, Center } from "@chakra-ui/react";
import DashboardLayout from "../components/layout/DashboardLayout";
import { useQuery } from "@tanstack/react-query";
import { fetchChartOverview } from "../lib/api/charts";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import LineChart from "../components/Charts/LineChart";
import DashboardFilters from "../components/Dashboard/Filters";

function IndexPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  const { metric, region, dateRange } = useSelector(
    (state: RootState) => state.filters
  );

  const { data, isLoading, error } = useQuery({
    queryKey: ["dashboard-overview", metric, region, dateRange],
    queryFn: () => fetchChartOverview(metric, dateRange, region),
    enabled: status === "authenticated",
    staleTime: 1000 * 60,
  });

  if (status === "loading") {
    return (
      <Center h="100vh">
        <Spinner size="xl" color="teal.500" />
        <Text ml={4}>Verifying session...</Text>
      </Center>
    );
  }

  if (status === "unauthenticated") {
    return null; // Will redirect via useEffect
  }

  return (
    <DashboardLayout>
      <Box p={4}>
        <Heading size="lg" mb={1}>
          Welcome, {session?.user?.name || session?.user?.email}
        </Heading>

        <Text color="gray.600" _dark={{ color: "gray.400" }} mb={6}>
          Analytics overview for your account
        </Text>

        <DashboardFilters />

        {isLoading ? (
          <Spinner color="teal.500" />
        ) : error ? (
          <Text color="red.500" fontWeight="bold">
            Failed to load analytics data.
          </Text>
        ) : data ? (
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
        ) : null}
      </Box>
    </DashboardLayout>
  );
}

// Add this to make it server-side only
export async function getServerSideProps(context: any) {
  // Check if user is authenticated via cookies
  const { req } = context;
  const token = req.cookies['next-auth.session-token'] || req.cookies['__Secure-next-auth.session-token'];
  
  // If no token, redirect to login immediately on server
  if (!token) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  return { props: {} };
}

export default IndexPage;