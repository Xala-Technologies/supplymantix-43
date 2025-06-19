
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { assetDocumentsApi, type AssetDocument, type AssetDocumentWithUrl } from "@/lib/database/asset-documents";
import { toast } from "sonner";

export const useAssetDocuments = (assetId: string) => {
  return useQuery({
    queryKey: ["asset-documents", assetId],
    queryFn: () => assetDocumentsApi.getAssetDocuments(assetId),
    enabled: !!assetId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useUploadAssetDocument = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ assetId, file }: { assetId: string; file: File }) => 
      assetDocumentsApi.uploadDocument(assetId, file),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["asset-documents", variables.assetId] });
      toast.success(`Document "${data.file_name}" uploaded successfully`);
    },
    onError: (error: any) => {
      console.error("Failed to upload document:", error);
      const errorMessage = error?.message || "Failed to upload document";
      toast.error(errorMessage);
    },
  });
};

export const useDeleteAssetDocument = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (documentId: string) => assetDocumentsApi.deleteDocument(documentId),
    onSuccess: (_, documentId) => {
      // Invalidate all asset documents queries since we don't know which asset this belongs to
      queryClient.invalidateQueries({ queryKey: ["asset-documents"] });
      toast.success("Document deleted successfully");
    },
    onError: (error) => {
      console.error("Failed to delete document:", error);
      toast.error("Failed to delete document");
    },
  });
};
