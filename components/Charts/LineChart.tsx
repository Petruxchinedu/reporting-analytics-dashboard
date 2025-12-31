"use client"

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { Box, Heading, useToken } from "@chakra-ui/react";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler);

interface Props {
  labels: string[];
  data: number[];
  title: string;
}

export default function LineChart({ labels, data, title }: Props) {
  const [brandColor] = useToken("colors", ["teal.500"]);

  const chartData = {
    labels: labels, // Now using props!
    datasets: [
      {
        fill: true,
        label: title,
        data: data, // Now using props!
        borderColor: brandColor,
        backgroundColor: (context: any) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 400);
          gradient.addColorStop(0, "rgba(49, 151, 149, 0.3)");
          gradient.addColorStop(1, "rgba(49, 151, 149, 0)");
          return gradient;
        },
        tension: 0.4,
        pointRadius: 2,
        pointHoverRadius: 6,
        borderWidth: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: { grid: { display: false } },
      y: { 
        border: { dash: [4, 4] },
        grid: { color: "rgba(0,0,0,0.05)" } 
      },
    },
  };

  return (
    <Box bg="white" _dark={{ bg: "gray.900" }} p={6} borderRadius="2xl" boxShadow="sm" h="400px">
      <Heading size="md" mb={6} fontWeight="bold">{title}</Heading>
      <Box h="300px">
        <Line data={chartData} options={options} />
      </Box>
    </Box>
  );
}