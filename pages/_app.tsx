import { ChakraProvider, createSystem, defineConfig, defaultConfig } from "@chakra-ui/react";
import { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { store } from "../store";
import { Provider as ReduxProvider } from "react-redux";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "../components/ui/toaster";
import { ColorModeProvider } from "../components/ui/color-mode";
import { useState } from "react";
import { useRouter } from "next/router";

const config = defineConfig({
  theme: {
    tokens: {
      colors: {
        brand: {
          50: { value: "#e6fffa" },
          500: { value: "#319795" },
          900: { value: "#171923" },
        },
      },
      fonts: {
        heading: { value: `'Inter', sans-serif` },
        body: { value: `'Inter', sans-serif` },
      },
    },
  },
});

const system = createSystem(defaultConfig, config);

export default function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const [queryClient] = useState(() => new QueryClient());
  const router = useRouter();

  // Skip all providers for 404 page to avoid build errors
  if (router.pathname === '/404' || router.pathname === '/_error') {
    return <Component {...pageProps} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ReduxProvider store={store}>
        <SessionProvider session={session}>
          <ChakraProvider value={system}>
            <ColorModeProvider>
              <Component {...pageProps} />
              <Toaster />
            </ColorModeProvider>
          </ChakraProvider>
        </SessionProvider>
      </ReduxProvider>
    </QueryClientProvider>
  );
}