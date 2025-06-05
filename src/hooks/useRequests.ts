
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { requestsApi } from "@/lib/database/requests";
import type { CreateRequestRequest, UpdateRequestRequest } from "@/types/request";

export const useRequests = () => {
  return useQuery({
    queryKey: ["requests"],
    queryFn: requestsApi.getRequests,
  });
};

export const useRequest = (id: string) => {
  return useQuery({
    queryKey: ["requests", id],
    queryFn: () => requestsApi.getRequestById(id),
    enabled: !!id,
  });
};

export const useCreateRequest = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateRequestRequest) => requestsApi.createRequest(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      toast.success("Request created successfully");
    },
    onError: (error) => {
      console.error("Error creating request:", error);
      toast.error("Failed to create request");
    },
  });
};

export const useUpdateRequest = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: UpdateRequestRequest) => requestsApi.updateRequest(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      toast.success("Request updated successfully");
    },
    onError: (error) => {
      console.error("Error updating request:", error);
      toast.error("Failed to update request");
    },
  });
};

export const useDeleteRequest = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => requestsApi.deleteRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      toast.success("Request deleted successfully");
    },
    onError: (error) => {
      console.error("Error deleting request:", error);
      toast.error("Failed to delete request");
    },
  });
};

export const useRequestComments = (requestId: string) => {
  return useQuery({
    queryKey: ["request-comments", requestId],
    queryFn: () => requestsApi.getRequestComments(requestId),
    enabled: !!requestId,
  });
};

export const useAddRequestComment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ requestId, comment }: { requestId: string; comment: string }) =>
      requestsApi.addRequestComment(requestId, comment),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["request-comments", variables.requestId] });
      toast.success("Comment added successfully");
    },
    onError: (error) => {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment");
    },
  });
};
