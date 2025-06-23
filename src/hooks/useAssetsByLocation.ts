
import { useQuery } from "@tanstack/react-query";
import { assetsApi } from "@/lib/database/assets";

export const useAssetsByLocation = (locationId: string) => {
  return useQuery({
    queryKey: ["assets-by-location", locationId],
    queryFn: () => assetsApi.getAssetsByLocation(locationId),
    enabled: !!locationId,
  });
};
