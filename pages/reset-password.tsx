import { useState } from "react";
import { useRouter } from "next/router"; // Changed from next/navigation
import { Button, Stack, Heading, Input, Center, Text } from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { toaster } from "../components/ui/toaster";

function ResetPasswordPage() {
  const router = useRouter();
  const { token } = router.query; // Get token from query params

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const mutation = useMutation({
    mutationFn: async (newPassword: string) => {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password: newPassword }),
      });
      if (!res.ok) throw new Error("Failed to reset");
      return res.json();
    },
    onSuccess: () => {
      toaster.create({
        title: "Success",
        description: "Password updated!",
        type: "success",
      });
      router.push("/login");
    },
  });

  if (!token) {
    return (
      <Center h="100vh" bg="gray.50" _dark={{ bg: "gray.900" }}>
        <Text fontSize="lg" fontWeight="medium">Invalid reset link.</Text>
      </Center>
    );
  }

  return (
    <Center h="100vh" bg="gray.50" _dark={{ bg: "gray.900" }}>
      <Stack
        w="full"
        maxW="md"
        p={8}
        bg="white"
        _dark={{ bg: "gray.800" }}
        borderRadius="xl"
        shadow="lg"
        gap={6}
      >
        <Heading size="lg">Set New Password</Heading>

        <form
          onSubmit={(e) => {
            e.preventDefault();

            if (password !== confirmPassword) {
              toaster.create({
                title: "Error",
                description: "Passwords do not match!",
                type: "error",
              });
              return;
            }

            mutation.mutate(password);
          }}
        >
          <Stack gap={4}>
            <Stack gap={1.5}>
              <Text fontSize="sm" fontWeight="medium">
                New Password
              </Text>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter new password"
              />
            </Stack>

            <Stack gap={1.5}>
              <Text fontSize="sm" fontWeight="medium">
                Confirm New Password
              </Text>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Confirm new password"
              />
            </Stack>

            <Button
              type="submit"
              colorPalette="teal"
              loading={mutation.isPending}
            >
              Update Password
            </Button>
          </Stack>
        </form>
      </Stack>
    </Center>
  );
}

export async function getServerSideProps() {
  return { props: {} };
}

export default ResetPasswordPage;