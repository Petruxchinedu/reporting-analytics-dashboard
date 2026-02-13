import { Box, Heading, Text, Button, Center, Stack } from "@chakra-ui/react";
import { useRouter } from "next/router";

function Error({ statusCode }: { statusCode?: number }) {
  const router = useRouter();

  return (
    <Center h="100vh" bg="gray.50" _dark={{ bg: "gray.900" }}>
      <Stack align="center" gap={6} textAlign="center">
        <Heading size="4xl" color="red.500">{statusCode || "Error"}</Heading>
        <Heading size="xl">
          {statusCode
            ? `An error ${statusCode} occurred on server`
            : "An error occurred on client"}
        </Heading>
        <Text color="gray.500" maxW="md">
          Something went wrong. Please try again later.
        </Text>
        <Button colorPalette="teal" size="lg" onClick={() => router.push("/")}>
          Go Home
        </Button>
      </Stack>
    </Center>
  );
}

Error.getInitialProps = ({ res, err }: any) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;