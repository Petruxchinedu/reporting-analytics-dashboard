import { useState } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Button,
  Flex,
  Stack,
  Heading,
  Text,
  Input,
  IconButton,
  HStack,
  Link as ChakraLink,
} from "@chakra-ui/react";
// REMOVE: import { motion, AnimatePresence } from "framer-motion";
import { LuEye, LuEyeOff, LuCircleAlert, LuArrowRight, LuCircleCheck } from "react-icons/lu";
import { signIn } from "next-auth/react";
import { toaster } from "../components/ui/toaster";
import { ThemeToggle } from "../components/ui/theme-toggle";

// REMOVE these lines:
// const MotionFlex = motion.create(Flex);
// const MotionStack = motion.create(Stack);

function LoginPage() {
  const router = useRouter();
  const { status, verified } = router.query;
  
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  
  const isPending = status === "pending";
  const isVerified = verified === "true";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      toaster.create({
        title: "Login Failed",
        description: result.error,
        type: "error",
      });
      setLoading(false);
    } else {
      toaster.create({ title: "Welcome back!", type: "success" });
      router.push("/"); 
    }
  };

  return (
    <Flex minH="100vh" direction={{ base: "column", lg: "row" }} bg="white" _dark={{ bg: "gray.950" }}>
      <Flex 
        flex="1.2" 
        bg="teal.600" 
        display={{ base: "none", lg: "flex" }} 
        align="center" 
        justify="center" 
        p={12} 
        position="relative" 
        overflow="hidden"
      >
        <Box 
          position="absolute" top="-10%" left="-10%" w="500px" h="500px" 
          bg="teal.500" borderRadius="full" filter="blur(100px)" opacity="0.4" 
        />
        
        {/* CHANGED: MotionStack → Stack */}
        <Stack gap={8} maxW="440px" zIndex={1}>
          <Heading size="4xl" color="white" fontWeight="black" lineHeight="shorter">
            Experience the
            <Text as="span" color="teal.200" display="block">next generation</Text>
            of reporting.
          </Heading>
          <Text fontSize="xl" color="teal.50">
            Secure, fast, and beautifully designed for modern teams.
          </Text>
        </Stack>
      </Flex>

      <Flex flex="1" align="center" justify="center" p={6} position="relative">
        <Box position="absolute" top="6" right="6">
          <ThemeToggle />
        </Box>

        {/* CHANGED: MotionFlex → Flex */}
        <Flex direction="column" w="full" maxW="md">
          <Stack gap={8}>
            <Stack>
              <Heading size="3xl" fontWeight="black" letterSpacing="tight">Sign In</Heading>
              <Text color="gray.500">Enter your credentials to continue.</Text>
            </Stack>

            {/* CHANGED: AnimatePresence → conditional rendering */}
            {isPending && (
              <Stack 
                p={4} bg="orange.50" _dark={{ bg: "orange.950/20" }} 
                borderRadius="xl" border="1px solid" borderColor="orange.200" 
                color="orange.700"
              >
                <HStack>
                  <LuCircleAlert />
                  <Text fontSize="sm" fontWeight="bold">Action Required</Text>
                </HStack>
                <Text fontSize="xs">Please check your email to verify your account before logging in.</Text>
              </Stack>
            )}

            {isVerified && (
              <Stack 
                p={4} bg="green.50" _dark={{ bg: "green.950/20" }} 
                borderRadius="xl" border="1px solid" borderColor="green.200" 
                color="green.700"
              >
                <HStack>
                  <LuCircleCheck />
                  <Text fontSize="sm" fontWeight="bold">Email Verified</Text>
                </HStack>
                <Text fontSize="xs">Your account is active. You can now log in below.</Text>
              </Stack>
            )}

            <form onSubmit={handleLogin}>
              <Stack gap={5}>
                <Stack gap={1.5}>
                  <Text fontWeight="bold" fontSize="xs" color="gray.500">EMAIL ADDRESS</Text>
                  <Input 
                    size="lg" borderRadius="xl" placeholder="name@company.com" 
                    value={email} onChange={(e) => setEmail(e.target.value)} required 
                    bg="gray.50" _dark={{ bg: "gray.800" }} border="none"
                  />
                </Stack>

                <Stack gap={1.5}>
                  <Flex justify="space-between" align="center">
                    <Text fontWeight="bold" fontSize="xs" color="gray.500">PASSWORD</Text>
                    <ChakraLink 
                      fontSize="xs" color="teal.600" fontWeight="bold" 
                      onClick={() => router.push("/forgot-password")}
                    >
                      Forgot Password?
                    </ChakraLink>
                  </Flex>
                  <HStack width="full" gap={0}>
                    <Input 
                      type={showPassword ? "text" : "password"} size="lg" 
                      borderRightRadius="0" borderLeftRadius="xl" 
                      placeholder="••••••••" value={password} 
                      onChange={(e) => setPassword(e.target.value)} required 
                      bg="gray.50" _dark={{ bg: "gray.800" }} border="none"
                    />
                    <IconButton 
                      onClick={() => setShowPassword(!showPassword)} 
                      aria-label="toggle password" variant="subtle" size="lg"
                      borderLeftRadius="0" borderRightRadius="xl" bg="gray.50" _dark={{ bg: "gray.800" }}
                    >
                      {showPassword ? <LuEyeOff /> : <LuEye />}
                    </IconButton>
                  </HStack>
                </Stack>

                <Button 
                  type="submit" colorPalette="teal" size="xl" borderRadius="xl" 
                  loading={loading} fontWeight="bold" mt={2}
                >
                  Login to Account <LuArrowRight />
                </Button>
              </Stack>
            </form>

            <Text textAlign="center" fontSize="sm" color="gray.500">
              Don't have an account?{" "}
              <ChakraLink color="teal.500" fontWeight="extrabold" onClick={() => router.push("/signup")}>
                Get Started
              </ChakraLink>
            </Text>
          </Stack>
        </Flex>
      </Flex>
    </Flex>
  );
}

export async function getServerSideProps() {
  return { props: {} };
}

export default LoginPage;