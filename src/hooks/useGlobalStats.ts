
import { useQuery } from "@tanstack/react-query";
import { assetsApi } from "@/lib/database/assets";
import { metersApi } from "@/lib/database/meters";

export const useGlobalAssetStats = () => {
  return useQuery({
    queryKey: ["global-asset-stats"],
    queryFn: async () => {
      const stats = await assetsApi.getAssetStatistics();
      return {
        total: stats.total,
        active: stats.byStatus['active'] || 0,
      };
    },
  });
};

export const useGlobalMeterStats = () => {
  return useQuery({
    queryKey: ["global-meter-stats"],
    queryFn: async () => {
      const meters = await metersApi.getMeters();
      return {
        total: meters.length,
        active: meters.filter(meter => meter.status === 'active').length,
      };
    },
  });
};
