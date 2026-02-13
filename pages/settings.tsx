import { useEffect, useState } from "react";
import { useRouter } from "next/router"; // Changed
import { useSession } from "next-auth/react";
import {
  Box,
  Heading,
  Text,
  Stack,
  HStack,
  Switch as ChakraSwitch,
  Button,
  Spinner,
  Center,
  Separator,
} from "@chakra-ui/react";
import DashboardLayout from "../components/layout/DashboardLayout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchUserSettings, updateUserSettings } from "../lib/api/userSettings";
import { toaster } from "../components/ui/toaster";
import { useColorMode } from "../components/ui/color-mode";

function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { colorMode, setColorMode } = useColorMode();

  const [notifsEnabled, setNotifsEnabled] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ["user-settings"],
    queryFn: fetchUserSettings,
  });

  useEffect(() => {
    if (data) {
      setNotifsEnabled(data.notificationsEnabled);
      if (data.theme) setColorMode(data.theme);
    }
  }, [data, setColorMode]);

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
      setNotifsEnabled(!notifsEnabled);
      toaster.create({
        title: "Sync Error",
        description: "Failed to update database.",
        type: "error",
      });
    },
  });

  const handleToggleNotifs = (details: { checked: boolean }) => {
    setNotifsEnabled(details.checked);
    mutation.mutate({ notificationsEnabled: details.checked });
  };

  const handleThemeChange = (newTheme: string) => {
    setColorMode(newTheme);
    mutation.mutate({ theme: newTheme });
  };

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
            <Box 
              p={6} 
              bg="white" 
              borderRadius="xl" 
              border="1px solid" 
              borderColor="gray.100" 
              _dark={{ bg: "gray.900", borderColor: "gray.800" }}
            >
              <Stack gap={3}>
                <Text fontSize="sm" fontWeight="medium">Interface Theme</Text>
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
              </Stack>
            </Box>
          </Box>

          <Separator />

          {/* Notifications Section */}
          <Box>
            <Heading size="md" mb={4}>Notifications</Heading>
            <Box 
              p={6} 
              bg="white" 
              borderRadius="2xl" 
              border="1px solid" 
              borderColor="gray.100" 
              _dark={{ bg: "gray.900", borderColor: "gray.800" }}
            >
              <HStack justify="space-between" align="center" width="full">
                <Box>
                  <Text fontSize="md" fontWeight="medium" mb={1}>Email Notifications</Text>
                  <Text fontSize="sm" color="gray.500">Get updates on your weekly analytics summary.</Text>
                </Box>
                
                <ChakraSwitch.Root
                  colorPalette="teal"
                  size="lg"
                  checked={notifsEnabled}
                  onCheckedChange={handleToggleNotifs}
                >
                  <ChakraSwitch.HiddenInput />
                  <ChakraSwitch.Control />
                  <ChakraSwitch.Thumb />
                </ChakraSwitch.Root>
              </HStack>
            </Box>
          </Box>

          {/* Security Section */}
          <Box>
            <Heading size="md" mb={4}>Security</Heading>
            <Box 
              p={6} 
              bg="white" 
              borderRadius="2xl" 
              border="1px solid" 
              borderColor="gray.100" 
              _dark={{ bg: "gray.900", borderColor: "gray.800" }}
            >
              <Text fontSize="sm" color="gray.500">Signed in as:</Text>
              <Text fontWeight="bold" fontSize="md">{session?.user?.email}</Text>
            </Box>
          </Box>
        </Stack>
      </Box>
    </DashboardLayout>
  );
}

export async function getServerSideProps() {
  return { props: {} };
}

export default SettingsPage;