"use client";

import { Box, Flex, Separator, Stack } from "@chakra-ui/react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { LogoutButton } from "./LogouButton"; // We will create this below

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <Flex 
      minH="100vh" 
      bg="gray.50" 
      _dark={{ bg: "gray.950" }}
    >
      {/* Sidebar Area */}
      <Box 
        display={{ base: "none", md: "flex" }} 
        flexDirection="column"
        w="280px" 
        position="fixed"
        h="100vh"
        borderEndWidth="1px"
        bg="white"
        _dark={{ bg: "gray.900", borderEndColor: "gray.800" }}
      >
        <Flex direction="column" h="full" p={4}>
          <Box flex="1">
            <Sidebar />
          </Box>
          
          <Separator my={4} />
          
          {/* Logout button stays at the bottom of the sidebar */}
          <LogoutButton />
        </Flex>
      </Box>

      {/* Main Container - added ml to account for fixed sidebar */}
      <Flex direction="column" flex="1" minW={0} ml={{ base: 0, md: "280px" }}>
        <Box 
          position="sticky" 
          top="0" 
          zIndex="docked" 
          bg="white/80" 
          backdropFilter="blur(10px)"
          _dark={{ bg: "gray.900/80" }}
        >
          <Topbar />
          <Separator />
        </Box>

        <Box
          as="main"
          p={{ base: 4, md: 8 }}
          flex="1"
          mx="auto"
          w="full"
          maxW="8xl"
        >
          {children}
        </Box>
      </Flex>
    </Flex>
  );
}