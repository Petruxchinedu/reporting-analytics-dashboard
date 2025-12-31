"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Stack, Heading, Input, Field, Center } from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { toaster } from "../components/ui/toaster";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  
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
      toaster.create({ title: "Success", description: "Password updated!", type: "success" });
      router.push("/login");
    },
  });

  if (!token) return <Center h="100vh">Invalid reset link.</Center>;

  return (
    <Center h="100vh" bg="gray.50">
      <Stack w="full" maxW="md" p={8} bg="white" borderRadius="xl" shadow="lg" gap={6}>
        <Heading size="lg">Set New Password</Heading>
        <form onSubmit={(e) => {
          e.preventDefault();
          if (password !== confirmPassword) return alert("No match!");
          mutation.mutate(password);
        }}>
          <Stack gap={4}>
            <Field.Root>
              <Field.Label>New Password</Field.Label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </Field.Root>
            <Field.Root>
              <Field.Label>Confirm New Password</Field.Label>
              <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            </Field.Root>
            <Button type="submit" colorPalette="teal" loading={mutation.isPending}>
              Update Password
            </Button>
          </Stack>
        </form>
      </Stack>
    </Center>
  );
}