"use client";

import { useState } from "react";
import { Box, Button, Flex, Stack, Heading, Text, Input, Field } from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { toaster } from "../components/ui/toaster";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");

  const mutation = useMutation({
    mutationFn: async (email: string) => {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      return res.json();
    },
    onSuccess: () => {
      toaster.create({ 
        title: "Check your inbox", 
        description: "If an account exists, you will receive a reset link.", 
        type: "success" 
      });
    },
  });

  return (
    <Flex minH="100vh" align="center" justify="center" bg="gray.50" _dark={{ bg: "gray.900" }}>
      <Stack gap={8} w="full" maxW="md" p={8} bg="white" _dark={{ bg: "gray.800" }} borderRadius="2xl" shadow="xl">
        <Stack textAlign="center">
          <Heading size="xl">Reset Password</Heading>
          <Text color="gray.500">Enter your email to receive a reset link</Text>
        </Stack>

        <form onSubmit={(e) => { e.preventDefault(); mutation.mutate(email); }}>
          <Stack gap={4}>
            <Field.Root>
              <Field.Label>Email Address</Field.Label>
              <Input type="email" placeholder="name@company.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </Field.Root>
            <Button type="submit" colorPalette="teal" size="lg" loading={mutation.isPending}>
              Send Reset Link
            </Button>
          </Stack>
        </form>
      </Stack>
    </Flex>
  );
}