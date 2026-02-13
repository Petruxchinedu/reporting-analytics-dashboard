"use client";

import { Toaster as ChakraToaster, createToaster } from "@chakra-ui/react";

export const toaster = createToaster({
  placement: "bottom-end",
  pauseOnPageIdle: true,
});

export function Toaster() {
  return <ChakraToaster />;
}