"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { 
  Box, Heading, Text, Flex, HStack, Button, Spinner, Center, Input, Stack, Badge, IconButton 
} from "@chakra-ui/react";
import DashboardLayout from "../components/layout/DashboardLayout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { LuDownload, LuPlay, LuTrash2, LuPencil } from "react-icons/lu";

export default function ReportsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("query")?.toLowerCase() || "";

  const [newReportName, setNewReportName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  // FETCH
  const { data: reports = [], isLoading } = useQuery({
    queryKey: ["reports"],
    queryFn: async () => {
      const res = await fetch("/api/reports");
      return res.json();
    },
  });

  // FILTER
  const filteredReports = reports.filter((r: any) => r.name.toLowerCase().includes(searchQuery));

 const createMutation = useMutation({
  mutationFn: async (name: string) => {
    const res = await fetch("/api/reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    const data = await res.json();

    if (!res.ok) {
      // This will capture the "Forbidden" message from the server
      throw new Error(data.message || "Something went wrong");
    }

    return data;
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["reports"] });
    setNewReportName("");
  },
  onError: (error: any) => {
    // This will alert you exactly why the 403 happened
    alert(`Error: ${error.message}`);
  },
});

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      await fetch(`/api/reports/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      setEditingId(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await fetch(`/api/reports/${id}`, { method: "DELETE" });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["reports"] }),
  });

  // DOWNLOAD HANDLER (Simulation)
  const handleDownload = (report: any) => {
    alert(`Downloading ${report.name}...`);
    // In a real app: window.open(`/api/reports/download/${report._id}`)
  };

  if (status === "loading" || isLoading) return <Center h="100vh"><Spinner /></Center>;

  return (
    <DashboardLayout>
      <Box p={6}>
        <Heading size="lg">Reports Management</Heading>
        <Text color="gray.500" mb={8}>Generate and download your data summaries.</Text>

        <Stack direction="row" mb={10} gap={4}>
          <Input 
            placeholder="New Report Title..." 
            value={newReportName} 
            onChange={(e) => setNewReportName(e.target.value)}
            bg="white" _dark={{ bg: "gray.800" }}
          />
          <Button 
            colorPalette="teal" 
            loading={createMutation.isPending}
            onClick={() => createMutation.mutate(newReportName)}
          >
            Create Report
          </Button>
        </Stack>

        <Stack gap={4}>
  {filteredReports.map((report: any) => (
    <Flex 
      key={report._id} p={5} align="center" justify="space-between"
      bg="white" _dark={{ bg: "gray.900" }}
      borderRadius="xl" border="1px solid" borderColor="gray.100" _darkBorderColor="gray.800"
    >
      <Box>
        {editingId === report._id ? (
          <Input 
            size="sm" value={editValue} 
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={() => updateMutation.mutate({ id: report._id, data: { name: editValue } })}
            autoFocus
          />
        ) : (
          <Text fontWeight="bold" fontSize="lg">{report.name}</Text>
        )}
        <HStack gap={4} mt={1}>
          <Badge colorPalette={report.status === "Generated" ? "green" : "orange"}>
            {report.status}
          </Badge>
          <Text fontSize="xs" color="gray.500">
            {new Date(report.date || report.createdAt).toLocaleDateString()}
          </Text>
        </HStack>
      </Box>

      <HStack gap={2}>
        {report.status === "Pending" ? (
          <Button 
            size="sm" colorPalette="blue" variant="subtle"
            loading={updateMutation.isPending}
            onClick={() => updateMutation.mutate({ id: report._id, data: { status: "Generated" } })}
          >
            <LuPlay /> Generate
          </Button>
        ) : (
          <Button 
            size="sm" colorPalette="green"
            onClick={() => handleDownload(report)}
          >
            <LuDownload /> Download
          </Button>
        )}
        
        {/* CORRECTED ICON BUTTONS FOR CHAKRA V3 */}
        <IconButton 
          aria-label="Edit" 
          variant="ghost" 
          size="sm"
          onClick={() => { setEditingId(report._id); setEditValue(report.name); }}
        >
          <LuPencil />
        </IconButton>

        <IconButton 
          aria-label="Delete" 
          variant="ghost" 
          size="sm" 
          colorPalette="red"
          loading={deleteMutation.isPending}
          onClick={() => deleteMutation.mutate(report._id)}
        >
          <LuTrash2 />
        </IconButton>
      </HStack>
    </Flex>
  ))}
</Stack>
      </Box>
    </DashboardLayout>
  );
}