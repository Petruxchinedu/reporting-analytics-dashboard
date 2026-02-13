import { useEffect } from "react";
import { useRouter } from "next/router"; // Changed from next/navigation
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

const renderIcon = (type: string) => {
  const iconProps = { size: 20 };
  
  switch (type) {
    case "reports":
      return <LuFileText {...iconProps} />;
    case "pending":
      return <LuActivity {...iconProps} />;
    case "generated":
      return <LuTrendingUp {...iconProps} />;
    default:
      return <LuCircleHelp {...iconProps} />;
  }
};

function AnalyticsPage() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["analytics-data"],
    queryFn: async () => {
      const res = await fetch("/api/analytics");
      if (!res.ok) {
        throw new Error("Failed to fetch analytics data");
      }
      return res.json();
    },
    refetchOnWindowFocus: true,
    enabled: status === "authenticated",
  });

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
          {data.stats.map((stat: any, i: number) => (
            <Box
              key={i}
              p={6}
              bg="white"
              borderRadius="2xl"
              boxShadow="sm"
              border="1px solid"
              borderColor="gray.100"
              _dark={{ bg: "gray.900", borderColor: "gray.800" }}
            >
              <Flex justify="space-between" align="center" mb={4}>
                <Box
                  p={2}
                  bg="teal.50"
                  _dark={{ bg: "teal.900/30" }}
                  borderRadius="lg"
                  color="teal.600"
                >
                  {renderIcon(stat.type)}
                </Box>

                <Badge
                  colorPalette={stat.type === "pending" ? "orange" : "green"}
                  variant="subtle"
                >
                  {stat.change}
                </Badge>
              </Flex>

              <Text fontSize="sm" color="gray.500" fontWeight="medium">
                {stat.label}
              </Text>

              <Heading size="xl" mt={1}>
                {stat.value}
              </Heading>
            </Box>
          ))}
        </SimpleGrid>
      </Box>
    </DashboardLayout>
  );
}

export async function getServerSideProps() {
  return { props: {} };
}

export default AnalyticsPage;