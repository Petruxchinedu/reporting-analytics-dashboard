import { useState } from "react";
import { useRouter } from "next/router";
import { 
  Box, Button, Flex, Stack, Heading, Text, Input, 
  IconButton, HStack, Link as ChakraLink 
} from "@chakra-ui/react";
import { 
  LuEye, LuEyeOff, LuCircleAlert, 
  LuShieldCheck, LuZap, LuGlobe 
} from "react-icons/lu";
import { useMutation } from "@tanstack/react-query";
import { toaster } from "../components/ui/toaster";

function SignUpPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [clientError, setClientError] = useState("");

  const signupMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Signup failed");
      return result;
    },
    onSuccess: () => {
      toaster.create({ 
        title: "Account Created!", 
        description: "Please check your email to verify your account.", 
        type: "success" 
      });
      router.push("/login?status=pending");
    },
    onError: (error: any) => {
      setClientError(error.message);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setClientError("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setClientError("Please enter a valid email address.");
      return;
    }
    if (password.length < 8) {
      setClientError("Password must be at least 8 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setClientError("Passwords do not match.");
      return;
    }

    signupMutation.mutate({ name: fullName, email, password });
  };

  return (
    <Flex minH="100vh" direction={{ base: "column", lg: "row" }} bg="white" _dark={{ bg: "gray.950" }}>
      {/* Left Side: Brand/Marketing */}
      <Flex 
        flex="1.2" bg="teal.600" align="center" justify="center" p={12} 
        color="white" display={{ base: "none", lg: "flex" }} position="relative"
        overflow="hidden"
      >
        <Box 
          position="absolute" top="-10%" right="-10%" w="500px" h="500px" 
          bg="teal.500" borderRadius="full" filter="blur(80px)" opacity="0.4" 
        />

        <Stack gap={10} maxW="460px" zIndex={1}>
          <Stack gap={6}>
            <Heading size="4xl" fontWeight="black" lineHeight="1.1">
              Analyze your data 
              <Text as="span" color="teal.200" display="block">like a pro.</Text>
            </Heading>
            <Text fontSize="xl" color="teal.50" fontWeight="medium">
              Join 10,000+ professionals generating automated reports every day.
            </Text>
          </Stack>

          <Stack gap={5}>
            {[
              { text: "Automated Report Generation", icon: LuZap },
              { text: "Role-Based Access Control", icon: LuShieldCheck },
              { text: "Global Analytics Dashboard", icon: LuGlobe }
            ].map((item, i) => (
              <HStack key={i} gap={4}>
                <Box p={2} bg="teal.500" borderRadius="lg">
                  <item.icon size={20} />
                </Box>
                <Text fontSize="lg" fontWeight="semibold">{item.text}</Text>
              </HStack>
            ))}
          </Stack>
        </Stack>
      </Flex>

      {/* Right Side: Form */}
      <Flex flex="1" align="center" justify="center" p={8} bg="white" _dark={{ bg: "gray.950" }}>
        <Flex direction="column" w="full" maxW="md">
          <Stack gap={8}>
            <Stack>
              <Heading size="2xl" fontWeight="bold" letterSpacing="tight">Create Account</Heading>
              <Text color="gray.500">Sign up in less than 2 minutes.</Text>
            </Stack>

            {/* Error Message Display */}
            {clientError && (
<HStack p={4} bg="red.50" border="1px solid" borderColor="red.200" borderRadius="xl" color="red.700" _dark={{ bg: "red.950/20", color: "red.400" }}>                <LuCircleAlert />
                <Text fontSize="sm" fontWeight="medium">{clientError}</Text>
              </HStack>
            )}

            <form onSubmit={handleSubmit}>
              <Stack gap={5}>
                <Stack gap={1.5}>
                  <Text fontWeight="bold" fontSize="sm">FULL NAME</Text>
                  <Input 
                    ps="4" size="lg" borderRadius="xl" placeholder="John Doe" 
                    value={fullName} onChange={(e) => setFullName(e.target.value)} required 
                  />
                </Stack>

                <Stack gap={1.5}>
                  <Text fontWeight="bold" fontSize="sm">EMAIL ADDRESS</Text>
                  <Input 
                    type="email" ps="4" size="lg" borderRadius="xl" placeholder="name@company.com" 
                    value={email} onChange={(e) => setEmail(e.target.value)} required 
                  />
                </Stack>

                <Stack gap={1.5}>
                  <Text fontWeight="bold" fontSize="sm">PASSWORD</Text>
                  <Flex position="relative" align="center">
                    <Input 
                      type={showPassword ? "text" : "password"} ps="4" size="lg" borderRadius="xl" 
                      placeholder="Min. 8 characters" value={password} 
                      onChange={(e) => setPassword(e.target.value)} required 
                    />
                    <IconButton
                      aria-label="Toggle Password"
                      variant="ghost"
                      position="absolute"
                      right="2"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <LuEyeOff /> : <LuEye />}
                    </IconButton>
                  </Flex>
                </Stack>

                <Stack gap={1.5}>
                  <Text fontWeight="bold" fontSize="sm">CONFIRM PASSWORD</Text>
                  <Input 
                    type="password" ps="4" size="lg" borderRadius="xl" 
                    placeholder="Repeat password" value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} required 
                  />
                </Stack>

                <Button 
                  type="submit" colorPalette="teal" size="xl" borderRadius="xl" 
                  loading={signupMutation.isPending} fontWeight="bold" mt={2}
                >
                  Create My Account
                </Button>
              </Stack>
            </form>

            <Text fontSize="sm" textAlign="center">
              Already have an account?{" "}
              <ChakraLink color="teal.600" fontWeight="bold" onClick={() => router.push("/login")}>
                Sign in
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

export default SignUpPage;