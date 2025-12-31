"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Box,
  Heading,
  Text,
  Stack,
  HStack,
  Switch,
  Button,
  Spinner,
  Center,
  Field,
  Separator,
} from "@chakra-ui/react";
import DashboardLayout from "../components/layout/DashboardLayout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchUserSettings, updateUserSettings } from "../lib/api/userSettings";
import { toaster } from "../components/ui/toaster";
import { useColorMode } from "../components/ui/color-mode";

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { colorMode, setColorMode } = useColorMode();

  // Local state for the switch to make it feel instant (Optimistic UI)
  const [notifsEnabled, setNotifsEnabled] = useState(false);

  // 1. Load settings from Database
  const { data, isLoading, error } = useQuery({
    queryKey: ["user-settings"],
    queryFn: fetchUserSettings,
  });

  // 2. Sync Local UI when data arrives from database
  useEffect(() => {
    if (data) {
      setNotifsEnabled(data.notificationsEnabled);
      if (data.theme) setColorMode(data.theme);
    }
  }, [data, setColorMode]);

  // 3. Update settings Mutation
  const mutation = useMutation({
    mutationFn: updateUserSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-settings"] });
      toaster.create({
        title: "Settings Saved",
        description: "Preferences synced successfully.",
        type: "success",
      });
    },
    onError: () => {
      // Revert local state if DB update fails
      setNotifsEnabled(!notifsEnabled);
      toaster.create({
        title: "Sync Error",
        description: "Failed to update database.",
        type: "error",
      });
    },
  });

  const handleToggleNotifs = (details: { checked: boolean }) => {
    setNotifsEnabled(details.checked); // 1. Instant UI update
    mutation.mutate({ notificationsEnabled: details.checked }); // 2. Background DB update
  };

  const handleThemeChange = (newTheme: string) => {
    setColorMode(newTheme); // 1. Instant CSS change
    mutation.mutate({ theme: newTheme }); // 2. Background DB update
  };

  // Route Protection
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading" || isLoading) {
    return (
      <Center h="100vh">
        <Stack align="center" gap={4}>
          <Spinner size="xl" color="teal.500" />
          <Text fontWeight="medium" color="gray.500">Loading your profile...</Text>
        </Stack>
      </Center>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <Center h="60vh">
          <Text color="red.500">Error connecting to settings service.</Text>
        </Center>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Box maxW="2xl">
        <Heading size="2xl" mb={2} fontWeight="black">Settings</Heading>
        <Text mb={8} color="gray.500">Manage account preferences and interface settings.</Text>

        <Stack gap={10}>
          {/* Appearance Section */}
          <Box>
            <Heading size="md" mb={4}>Appearance</Heading>
            <Box p={6} bg="white" _dark={{ bg: "gray.900" }} borderRadius="2xl" border="1px solid" borderColor="gray.100" _darkBorderColor="gray.800">
              <Field.Root>
                <Field.Label mb={3}>Interface Theme</Field.Label>
                <HStack gap={3}>
                  {["light", "dark", "system"].map((t) => (
                    <Button
                      key={t}
                      size="sm"
                      px={6}
                      borderRadius="lg"
                      variant={colorMode === t ? "solid" : "outline"}
                      colorPalette={colorMode === t ? "teal" : "gray"}
                      onClick={() => handleThemeChange(t)}
                    >
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </Button>
                  ))}
                </HStack>
              </Field.Root>
            </Box>
          </Box>

          <Separator />

          {/* Notifications Section */}
          <Box>
            <Heading size="md" mb={4}>Notifications</Heading>
            <Box p={6} bg="white" _dark={{ bg: "gray.900" }} borderRadius="2xl" border="1px solid" borderColor="gray.100" _darkBorderColor="gray.800">
              <Field.Root>
                <HStack justify="space-between" align="center" width="full">
                  <Box>
                    <Field.Label mb={0} fontSize="md">Email Notifications</Field.Label>
                    <Text fontSize="sm" color="gray.500">Get updates on your weekly analytics summary.</Text>
                  </Box>
                  
                  <Switch.Root 
                    colorPalette="teal"
                    size="lg"
                    checked={notifsEnabled} // Uses local state for instant response
                    onCheckedChange={handleToggleNotifs}
                  >
                    <Switch.Control>
                      <Switch.Thumb />
                    </Switch.Control>
                  </Switch.Root>
                </HStack>
              </Field.Root>
            </Box>
          </Box>

          {/* Security Section */}
          <Box>
            <Heading size="md" mb={4}>Security</Heading>
            <Box p={6} bg="white" _dark={{ bg: "gray.900" }} borderRadius="2xl" border="1px solid" borderColor="gray.100" _darkBorderColor="gray.800">
              <Text fontSize="sm" color="gray.500">Signed in as:</Text>
              <Text fontWeight="bold" fontSize="md">{session?.user?.email}</Text>
            </Box>
          </Box>
        </Stack>
      </Box>
    </DashboardLayout>
  );
}