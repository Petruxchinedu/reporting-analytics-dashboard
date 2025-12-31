"use client";

import { Button, Icon, Text } from "@chakra-ui/react";
import { signOut } from "next-auth/react";
import { LuLogOut } from "react-icons/lu";

export function LogoutButton() {
  return (
    <Button
      variant="ghost"
      colorPalette="red"
      width="full"
      justifyContent="flex-start"
      gap={3}
      borderRadius="xl"
      size="lg"
      _hover={{ bg: "red.50", _dark: { bg: "red.900/20" } }}
      onClick={() => signOut({ callbackUrl: "/login" })}
    >
      <LuLogOut />
      <Text fontWeight="bold">Sign Out</Text>
    </Button>
  );
}