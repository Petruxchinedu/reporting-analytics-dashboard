"use client";

import { 
  Box, Flex, Heading, Input, IconButton, HStack, Text, Menu,
} from "@chakra-ui/react";
import { 
  LuSearch, LuBell, LuMoon, LuSun, LuCircleUser, LuDot 
} from "react-icons/lu";
import { useColorMode } from "../ui/color-mode"; 
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export default function Topbar() {
  const { colorMode, toggleColorMode } = useColorMode();
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Initialize search state from URL so it doesn't clear on refresh
  const [searchQuery, setSearchQuery] = useState(searchParams.get("query") || "");
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const handleSearch = (term: string) => {
    setSearchQuery(term);
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    // Updates the URL without a full page reload
    router.replace(`${pathname}?${params.toString()}`);
  };

  if (!mounted) return <Flex h="70px" />; 

  return (
    <Flex
      h="70px" align="center" justify="space-between" px={6}
      bg="white" _dark={{ bg: "gray.900" }}
      borderBottom="1px solid" borderColor="gray.200" _darkBorderColor="gray.800"
      position="sticky" top="0" zIndex="100"
    >
      <HStack gap={4}>
        <Heading size="md" fontWeight="semibold">Overview</Heading>
      </HStack>

      {/* Functional Search Bar */}
      <Box display={{ base: "none", md: "block" }} maxW="400px" w="full" mx={8}>
        <Box position="relative">
          <Box position="absolute" left="3" top="50%" transform="translateY(-50%)" zIndex="1" color="gray.400">
            <LuSearch size={18} />
          </Box>
          <Input
            placeholder="Search reports..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            pl="10" borderRadius="full" bg="gray.100" _dark={{ bg: "gray.800" }}
            border="none" _focus={{ ring: "2px", ringColor: "teal.500", bg: "white" }}
          />
        </Box>
      </Box>

      <HStack gap={3}>
        <Menu.Root portalled>
          <Menu.Trigger asChild>
            <IconButton variant="ghost" aria-label="Notifications"><LuBell size={20} /></IconButton>
          </Menu.Trigger>
          <Menu.Content minW="200px" bg="white" _dark={{ bg: "gray.800" }} boxShadow="md">
             <Menu.Item value="1" p={3}><Text fontSize="sm">No new notifications</Text></Menu.Item>
          </Menu.Content>
        </Menu.Root>

        <IconButton variant="ghost" aria-label="Toggle Theme" onClick={toggleColorMode}>
          {colorMode === "light" ? <LuMoon size={20} /> : <LuSun size={20} />}
        </IconButton>

        <HStack gap={3} pl={2}>
          <Box textAlign="right" display={{ base: "none", sm: "block" }}>
            <Text fontSize="sm" fontWeight="bold">{session?.user?.name || "User"}</Text>
            <Text fontSize="xs" color="gray.500">Admin</Text>
          </Box>
          <Box w="40px" h="40px" bg="teal.500" borderRadius="full" display="flex" alignItems="center" justifyContent="center">
            <LuCircleUser size={24} color="white" />
          </Box>
        </HStack>
      </HStack>
    </Flex>
  );
}