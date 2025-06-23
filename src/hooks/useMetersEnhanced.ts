
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { databaseApi } from "@/lib/database";
import { useToast } from "@/hooks/use-toast";

export const useMetersEnhanced = () => {
  return useQuery({
    queryKey: ["meters"],
    queryFn: databaseApi.getMeters,
  });
};

export const useMeterDetail = (id: string) => {
  return useQuery({
    queryKey: ["meter", id],
    queryFn: () => databaseApi.getMeter(id),
    enabled: !!id,
  });
};

export const useMeterReadings = (meterId: string) => {
  return useQuery({
    queryKey: ["meter-readings", meterId],
    queryFn: () => databaseApi.getMeterReadings(meterId),
    enabled: !!meterId,
  });
};

export const useMeterTriggers = (meterId: string) => {
  return useQuery({
    queryKey: ["meter-triggers", meterId],
    queryFn: () => databaseApi.getMeterTriggers(meterId),
    enabled: !!meterId,
  });
};

export const useCreateMeter = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: databaseApi.createMeter,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meters"] });
      toast({
        title: "Success",
        description: "Meter created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create meter",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateMeter = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: any }) =>
      databaseApi.updateMeter(id, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["meters"] });
      queryClient.invalidateQueries({ queryKey: ["meter", data?.id] });
      toast({
        title: "Success",
        description: "Meter updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update meter",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteMeter = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: databaseApi.deleteMeter,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meters"] });
      toast({
        title: "Success",
        description: "Meter deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete meter",
        variant: "destructive",
      });
    },
  });
};

export const useCreateMeterReading = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: databaseApi.createMeterReading,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["meter-readings"] });
      queryClient.invalidateQueries({ queryKey: ["meter", data?.meter_id] });
      queryClient.invalidateQueries({ queryKey: ["meters"] });
      toast({
        title: "Success",
        description: "Reading recorded successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to record reading",
        variant: "destructive",
      });
    },
  });
};

export const useCreateMeterTrigger = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: databaseApi.createMeterTrigger,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["meter-triggers", data?.meter_id] });
      toast({
        title: "Success",
        description: "Trigger created successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create trigger",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateMeterTrigger = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: any }) =>
      databaseApi.updateMeterTrigger(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meter-triggers"] });
      toast({
        title: "Success",
        description: "Trigger updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update trigger",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteMeterTrigger = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: databaseApi.deleteMeterTrigger,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meter-triggers"] });
      toast({
        title: "Success",
        description: "Trigger deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete trigger",
        variant: "destructive",
      });
    },
  });
};
