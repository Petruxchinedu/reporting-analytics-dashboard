import { Box, Stack, Text, Icon,Flex, Link as ChakraLink } from "@chakra-ui/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LuLayoutDashboard, 
  LuChartBar, 
  LuFileText, 
  LuSettings 
} from "react-icons/lu"; // Lucide icons look great with v3

const navItems = [
  { label: "Dashboard", href: "/", icon: LuLayoutDashboard },
  { label: "Analytics", href: "/analytics", icon: LuChartBar },
  { label: "Reports", href: "/reports", icon: LuFileText },
  { label: "Settings", href: "/settings", icon: LuSettings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <Box
      h="full"
      w="full"
      p={4}
    >
      {/* Brand / Logo Area */}
      <Flex align="center" gap={3} px={3} mb={10}>
        <Box bg="teal.600" p={1.5} borderRadius="lg">
          <Icon color="white" fontSize="xl" as={LuLayoutDashboard} />
        </Box>
        <Text fontSize="xl" fontWeight="bold" letterSpacing="tight">
          SaaS Admin
        </Text>
      </Flex>

      {/* Navigation Links */}
      <Stack gap={1}>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          
          return (
            <ChakraLink
              key={item.href}
              asChild
              textDecoration="none"
              _hover={{ textDecoration: "none" }}
            >
              <Link href={item.href}>
                <Box
                  display="flex"
                  alignItems="center"
                  gap={3}
                  px={3}
                  py={2.5}
                  borderRadius="lg"
                  transition="all 0.2s"
                  fontWeight="medium"
                  fontSize="sm"
                  bg={isActive ? "teal.50" : "transparent"}
                  color={isActive ? "teal.700" : "gray.600"}
                  _dark={{
                    bg: isActive ? "teal.900/30" : "transparent",
                    color: isActive ? "teal.200" : "gray.400",
                  }}
                  _hover={{
                    bg: isActive ? "teal.50" : "gray.100",
                    color: isActive ? "teal.700" : "gray.900",
                    _dark: {
                      bg: isActive ? "teal.900/30" : "gray.800",
                      color: isActive ? "teal.200" : "gray.100",
                    }
                  }}
                >
                  <Icon as={item.icon} fontSize="lg" />
                  {item.label}
                </Box>
              </Link>
            </ChakraLink>
          );
        })}
      </Stack>
    </Box>
  );
}