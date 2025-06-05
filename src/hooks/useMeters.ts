
import { useQuery } from "@tanstack/react-query";

// Mock data for meters - in real app this would come from your API
const mockMeters = [
  {
    id: "1",
    name: "Compressor Runtime",
    type: "runtime",
    unit: "hours",
    current_value: 1245.5,
    asset_name: "Air Compressor #1",
    location: "Production Floor A",
    status: "active" as const,
    last_reading: "2024-06-05T10:30:00Z",
    target_range: { min: 0, max: 8760 }
  },
  {
    id: "2",
    name: "Boiler Temperature",
    type: "temperature",
    unit: "°C",
    current_value: 85.2,
    asset_name: "Steam Boiler #2",
    location: "Utility Room",
    status: "warning" as const,
    last_reading: "2024-06-05T11:15:00Z",
    target_range: { min: 80, max: 90 }
  },
  {
    id: "3",
    name: "Pump Pressure",
    type: "pressure",
    unit: "PSI",
    current_value: 125.8,
    asset_name: "Water Pump #3",
    location: "Basement",
    status: "active" as const,
    last_reading: "2024-06-05T11:20:00Z",
    target_range: { min: 120, max: 140 }
  }
];

export const useMeters = () => {
  return useQuery({
    queryKey: ["meters"],
    queryFn: async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return mockMeters;
    },
  });
};
