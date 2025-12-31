"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Center, Spinner, Stack, Heading, Text, Button, Icon } from "@chakra-ui/react";
import { LuCircleCheck, LuCircleX } from "react-icons/lu";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    if (token) {
      fetch(`/api/auth/verify?token=${token}`)
        .then((res) => res.ok ? setStatus("success") : setStatus("error"))
        .catch(() => setStatus("error"));
    }
  }, [token]);

  return (
    <Center h="100vh" bg="gray.50">
      <Stack align="center" gap={6} p={10} bg="white" borderRadius="2xl" shadow="xl" maxW="400px" textAlign="center">
        {status === "loading" && <Spinner size="xl" color="teal.500" />}
        
        {status === "success" && (
          <>
            <Icon as={LuCircleCheck} color="green.500" boxSize="60px" />
            <Heading size="lg">Email Verified!</Heading>
            <Text color="gray.500">Your account is now active. You can proceed to login.</Text>
            <Button colorPalette="teal" w="full" onClick={() => router.push("/login")}>Go to Login</Button>
          </>
        )}

        {status === "error" && (
          <>
            <Icon as={LuCircleX} color="red.500" boxSize="60px" />
            <Heading size="lg">Verification Failed</Heading>
            <Text color="gray.500">The link is invalid or has expired.</Text>
            <Button variant="outline" w="full" onClick={() => router.push("/signup")}>Back to Signup</Button>
          </>
        )}
      </Stack>
    </Center>
  );
}