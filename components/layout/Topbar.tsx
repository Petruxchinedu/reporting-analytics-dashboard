"use client";

import {
  Box,
  Flex,
  Heading,
  Input,
  IconButton,
  HStack,
  Text,
} from "@chakra-ui/react";
import {
  LuSearch,
  LuBell,
  LuMoon,
  LuSun,
  LuCircleUser,
} from "react-icons/lu";
import { useColorMode } from "../ui/color-mode";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

function Topbar() {
  const { colorMode, toggleColorMode } = useColorMode();
  const { data: session } = useSession();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("query") ?? ""
  );
  const [mounted, setMounted] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('[data-notification-container]')) {
        setShowNotifications(false);
      }
    };

    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showNotifications]);

  const handleSearch = (term: string) => {
    setSearchQuery(term);

    const params = new URLSearchParams(searchParams.toString());
    if (term) params.set("query", term);
    else params.delete("query");

    router.replace(`${pathname}?${params.toString()}`);
  };

  if (!mounted) {
    return <Flex h="70px" />;
  }

  return (
    <Flex
      h="70px"
      align="center"
      justify="space-between"
      px={6}
      bg="white"
      borderBottom="1px solid"
      borderColor="gray.200"
      _dark={{ bg: "gray.900", borderColor: "gray.800" }}
      position="sticky"
      top="0"
      zIndex={100}
    >
      {/* Left */}
      <HStack gap={4}>
        <Heading size="md" fontWeight="semibold">
          Overview
        </Heading>
      </HStack>

      {/* Search */}
      <Box
        display={{ base: "none", md: "block" }}
        maxW="400px"
        w="full"
        mx={8}
      >
        <Box position="relative">
          <Box
            position="absolute"
            left="3"
            top="50%"
            transform="translateY(-50%)"
            color="gray.400"
          >
            <LuSearch size={18} />
          </Box>

          <Input
            placeholder="Search reports..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            pl="10"
            borderRadius="full"
            bg="gray.100"
            border="none"
            _dark={{ bg: "gray.800" }}
            _focus={{
              ring: "2px",
              ringColor: "teal.500",
              bg: "white",
            }}
          />
        </Box>
      </Box>

      {/* Right */}
      <HStack gap={3}>
        {/* Notifications with Dropdown */}
        <Box position="relative" data-notification-container>
          <IconButton
            variant="ghost"
            aria-label="Notifications"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <LuBell size={20} />
          </IconButton>

          {showNotifications && (
            <Box
              position="absolute"
              right="0"
              top="calc(100% + 8px)"
              w="220px"
              bg="white"
              boxShadow="lg"
              borderRadius="md"
              p={4}
              zIndex={1000}
              border="1px solid"
              borderColor="gray.200"
              _dark={{ bg: "gray.800", borderColor: "gray.700" }}
            >
              <Text fontSize="sm">No new notifications</Text>
            </Box>
          )}
        </Box>

        {/* Theme toggle */}
        <IconButton
          variant="ghost"
          aria-label="Toggle theme"
          onClick={toggleColorMode}
        >
          {colorMode === "light" ? <LuMoon size={20} /> : <LuSun size={20} />}
        </IconButton>

        {/* User */}
        <HStack gap={3} pl={2}>
          <Box textAlign="right" display={{ base: "none", sm: "block" }}>
            <Text fontSize="sm" fontWeight="bold">
              {session?.user?.name ?? "User"}
            </Text>
            <Text fontSize="xs" color="gray.500">
              Admin
            </Text>
          </Box>

          <Box
            w="40px"
            h="40px"
            bg="teal.500"
            borderRadius="full"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <LuCircleUser size={24} color="white" />
          </Box>
        </HStack>
      </HStack>
    </Flex>
  );
}

export default Topbar;