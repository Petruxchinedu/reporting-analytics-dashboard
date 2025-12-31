"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Box,
  SimpleGrid,
  Heading,
  Text,
  Flex,
  Badge,
  Spinner,
  Center,
  HStack,
} from "@chakra-ui/react";
import DashboardLayout from "../components/layout/DashboardLayout";
import { useQuery } from "@tanstack/react-query";
import {
  LuTrendingUp,
  LuFileText,
  LuActivity,
  LuCircleHelp,
} from "react-icons/lu";

/**
 * Maps backend stat "type" → UI icon
 * Backend owns meaning
 * Frontend owns presentation
 */
const IconMap: Record<string, any> = {
  reports: LuFileText,
  pending: LuActivity,
  generated: LuTrendingUp,
};

export default function AnalyticsPage() {
  const { status } = useSession();
  const router = useRouter();

  // Route protection
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

 // Fetch analytics data
const { data, isLoading, error } = useQuery({
  queryKey: ["analytics-data"],
  queryFn: async () => {
    // This calls pages/api/analytics/index.ts
    const res = await fetch("/api/analytics"); 
    if (!res.ok) {
      throw new Error("Failed to fetch analytics data");
    }
    return res.json();
  },
  refetchOnWindowFocus: true, // Refresh when you switch back to the tab
});

  // Loading state
  if (status === "loading" || isLoading) {
    return (
      <Center h="100vh">
        <HStack gap={4}>
          <Spinner size="xl" color="teal.500" />
          <Text fontWeight="medium">Loading analytics...</Text>
        </HStack>
      </Center>
    );
  }

  // Error state
  if (error || !data?.stats) {
    return (
      <DashboardLayout>
        <Center h="60vh">
          <Text color="red.500" fontWeight="medium">
            Failed to load analytics data.
          </Text>
        </Center>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Box>
        <Heading size="lg" mb={2}>
          Analytics Overview
        </Heading>

        <Text color="gray.500" mb={8}>
          Deep dive into your performance metrics and generated reports.
        </Text>

        <SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
          {data.stats.map((stat: any, i: number) => {
            const IconComponent = IconMap[stat.type] || LuCircleHelp;

            return (
              <Box
                key={i}
                p={6}
                bg="white"
                _dark={{ bg: "gray.900" }}
                borderRadius="2xl"
                boxShadow="sm"
                border="1px solid"
                borderColor="gray.100"
                _darkBorderColor="gray.800"
              >
                <Flex justify="space-between" align="center" mb={4}>
                  <Box
                    p={2}
                    bg="teal.50"
                    _dark={{ bg: "teal.900/30" }}
                    borderRadius="lg"
                    color="teal.600"
                  >
                    <IconComponent size={20} />
                  </Box>

                  <Badge
                    colorPalette={
                      stat.type === "pending" ? "orange" : "green"
                    }
                    variant="subtle"
                  >
                    {stat.change}
                  </Badge>
                </Flex>

                <Text
                  fontSize="sm"
                  color="gray.500"
                  fontWeight="medium"
                >
                  {stat.label}
                </Text>

                <Heading size="xl" mt={1}>
                  {stat.value}
                </Heading>
              </Box>
            );
          })}
        </SimpleGrid>
      </Box>
    </DashboardLayout>
  );
}
