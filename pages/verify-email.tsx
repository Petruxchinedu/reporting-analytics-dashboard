import { useEffect, useState } from "react";
import { useRouter } from "next/router"; // Changed from next/navigation
import { Center, Spinner, Stack, Heading, Text, Button, Box } from "@chakra-ui/react";
import { LuCircleCheck, LuCircleX } from "react-icons/lu";

function VerifyEmailPage() {
  const router = useRouter();
  const { token } = router.query; // Get token from query params
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    if (token && typeof token === 'string') {
      fetch(`/api/auth/verify?token=${token}`)
        .then((res) => res.ok ? setStatus("success") : setStatus("error"))
        .catch(() => setStatus("error"));
    } else if (router.isReady && !token) {
      // Only set error if router is ready and still no token
      setStatus("error");
    }
  }, [token, router.isReady]);

  return (
    <Center h="100vh" bg="gray.50" _dark={{ bg: "gray.900" }}>
      <Stack 
        align="center" 
        gap={6} 
        p={10} 
        bg="white" 
        _dark={{ bg: "gray.800" }} 
        borderRadius="2xl" 
        shadow="xl" 
        maxW="400px" 
        textAlign="center"
      >
        {status === "loading" && (
          <>
            <Spinner size="xl" color="teal.500" />
            <Text>Verifying your email...</Text>
          </>
        )}
        
        {status === "success" && (
          <>
            <Box color="green.500">
              <LuCircleCheck size={60} />
            </Box>
            <Heading size="lg">Email Verified!</Heading>
            <Text color="gray.500">Your account is now active. You can proceed to login.</Text>
            <Button colorPalette="teal" w="full" onClick={() => router.push("/login?verified=true")}>
              Go to Login
            </Button>
          </>
        )}

        {status === "error" && (
          <>
            <Box color="red.500">
              <LuCircleX size={60} />
            </Box>
            <Heading size="lg">Verification Failed</Heading>
            <Text color="gray.500">The link is invalid or has expired.</Text>
            <Button variant="outline" w="full" onClick={() => router.push("/signup")}>
              Back to Signup
            </Button>
          </>
        )}
      </Stack>
    </Center>
  );
}

export async function getServerSideProps() {
  return { props: {} };
}

export default VerifyEmailPage;