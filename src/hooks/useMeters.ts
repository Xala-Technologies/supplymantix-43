
import { useQuery } from "@tanstack/react-query";
import { databaseApi } from "@/lib/database";

// Enhanced meters data structure
interface EnhancedMeter {
  id: string;
  name: string;
  type: string;
  unit: string;
  current_value: number;
  asset_name?: string;
  location?: string;
  status: 'active' | 'warning' | 'critical' | 'inactive';
  last_reading: string;
  target_range?: { min: number; max: number };
  asset_id?: string;
  description?: string;
  reading_frequency?: string;
  target_min?: number;
  target_max?: number;
  last_reading_at?: string;
}

export const useMeters = () => {
  return useQuery({
    queryKey: ["meters-enhanced"],
    queryFn: async (): Promise<EnhancedMeter[]> => {
      const meters = await databaseApi.getMeters();
      
      return meters?.map(meter => ({
        id: meter.id,
        name: meter.name,
        type: meter.type,
        unit: meter.unit,
        current_value: Number(meter.current_value) || 0,
        asset_name: meter.assets?.name,
        location: meter.location || meter.assets?.location,
        status: meter.status as 'active' | 'warning' | 'critical' | 'inactive',
        last_reading: meter.last_reading_at || new Date().toISOString(),
        target_range: meter.target_min && meter.target_max ? {
          min: Number(meter.target_min),
          max: Number(meter.target_max)
        } : undefined,
        asset_id: meter.asset_id,
        description: meter.description,
        reading_frequency: meter.reading_frequency,
        target_min: meter.target_min ? Number(meter.target_min) : undefined,
        target_max: meter.target_max ? Number(meter.target_max) : undefined,
        last_reading_at: meter.last_reading_at,
      })) || [];
    },
  });
};
