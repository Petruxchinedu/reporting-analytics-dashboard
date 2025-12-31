"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Box, Button, Flex, Stack, Heading, Text, Input, 
  IconButton, HStack, Field, Link as ChakraLink 
} from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LuEye, LuEyeOff, LuCircleCheck, LuCircleAlert, 
  LuShieldCheck, LuZap, LuGlobe 
} from "react-icons/lu";
import { useMutation } from "@tanstack/react-query";
import { toaster } from "../components/ui/toaster";

const MotionFlex = motion.create(Flex);
const MotionStack = motion.create(Stack);

export default function SignUpPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  
  // Form States
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
      // Redirect to a pending verification state or login
      router.push("/login?status=pending");
    },
    onError: (error: any) => {
      setClientError(error.message);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setClientError("");

    // --- Validation Logic ---
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
    <Flex minH="100vh" direction={{ base: "column", lg: "row" }} bg="white">
      {/* Left Side: Brand/Marketing */}
      <Flex 
        flex="1.2" bg="teal.600" align="center" justify="center" p={12} 
        color="white" display={{ base: "none", lg: "flex" }} position="relative"
        overflow="hidden"
      >
        {/* Subtle Decorative Background Element */}
        <Box 
          position="absolute" top="-10%" right="-10%" w="500px" h="500px" 
          bg="teal.500" borderRadius="full" filter="blur(80px)" opacity="0.4" 
        />

        <Stack gap={10} maxW="460px" zIndex={1}>
          <MotionStack 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.2 }}
            gap={6}
          >
            <Heading size="4xl" fontWeight="black" lineHeight="1.1">
              Analyze your data <br /> 
              <Text as="span" color="teal.200">like a pro.</Text>
            </Heading>
            <Text fontSize="xl" color="teal.50" fontWeight="medium">
              Join 10,000+ professionals generating automated reports every day.
            </Text>
          </MotionStack>

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
        <MotionFlex 
          initial={{ opacity: 0, x: 20 }} 
          animate={{ opacity: 1, x: 0 }} 
          direction="column" w="full" maxW="md"
        >
          <Stack gap={8}>
            <Stack>
              <Heading size="2xl" fontWeight="bold" letterSpacing="tight">Create Account</Heading>
              <Text color="gray.500">Sign up in less than 2 minutes.</Text>
            </Stack>

            {/* Error Message Display */}
            <AnimatePresence>
              {clientError && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                  <HStack p={4} bg="red.50" border="1px solid" borderColor="red.200" borderRadius="xl" color="red.700">
                    <LuCircleAlert />
                    <Text fontSize="sm" fontWeight="medium">{clientError}</Text>
                  </HStack>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit}>
              <Stack gap={5}>
                <Field.Root>
                  <Field.Label fontWeight="bold">FULL NAME</Field.Label>
                  <Input 
                    ps="4" size="lg" borderRadius="xl" placeholder="John Doe" 
                    value={fullName} onChange={(e) => setFullName(e.target.value)} required 
                  />
                </Field.Root>

                <Field.Root>
                  <Field.Label fontWeight="bold">EMAIL ADDRESS</Field.Label>
                  <Input 
                    type="email" ps="4" size="lg" borderRadius="xl" placeholder="name@company.com" 
                    value={email} onChange={(e) => setEmail(e.target.value)} required 
                  />
                </Field.Root>

                <Field.Root>
                  <Field.Label fontWeight="bold">PASSWORD</Field.Label>
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
                </Field.Root>

                <Field.Root>
                  <Field.Label fontWeight="bold">CONFIRM PASSWORD</Field.Label>
                  <Input 
                    type="password" ps="4" size="lg" borderRadius="xl" 
                    placeholder="Repeat password" value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} required 
                  />
                </Field.Root>

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
        </MotionFlex>
      </Flex>
    </Flex>
  );
}