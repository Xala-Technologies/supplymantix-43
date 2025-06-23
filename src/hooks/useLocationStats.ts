
import { useQuery } from "@tanstack/react-query";
import { locationsApi } from "@/lib/database/locations";

export const useLocationStats = (locationId: string) => {
  return useQuery({
    queryKey: ["location-stats", locationId],
    queryFn: () => locationsApi.getLocationStats(locationId),
    enabled: !!locationId,
  });
};
