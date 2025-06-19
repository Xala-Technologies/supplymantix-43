
import { supabase } from "@/integrations/supabase/client";

export interface AssetDocument {
  id: string;
  asset_id: string;
  tenant_id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  file_type: string;
  uploaded_by?: string;
  created_at: string;
  updated_at: string;
}

export interface AssetDocumentWithUrl {
  id: string;
  file_name: string;
  file_size: number;
  file_type: string;
  download_url: string;
  created_at: string;
}

export const assetDocumentsApi = {
  async getAssetDocuments(assetId: string): Promise<AssetDocumentWithUrl[]> {
    const { data, error } = await supabase.rpc('get_asset_documents', {
      asset_id_param: assetId
    });

    if (error) {
      console.error('Error fetching asset documents:', error);
      throw error;
    }

    return data || [];
  },

  async uploadDocument(
    assetId: string,
    file: File
  ): Promise<AssetDocument> {
    try {
      // Get user tenant ID
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("tenant_id")
        .eq("id", (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (userError || !userData?.tenant_id) {
        throw new Error('Unable to determine user tenant');
      }

      // Generate unique file path
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${userData.tenant_id}/${assetId}/${fileName}`;

      // Upload file to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('asset-documents')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Error uploading file:', uploadError);
        throw uploadError;
      }

      // Save file metadata to database
      const { data: documentData, error: documentError } = await supabase
        .from('asset_documents')
        .insert({
          asset_id: assetId,
          tenant_id: userData.tenant_id,
          file_name: file.name,
          file_path: filePath,
          file_size: file.size,
          file_type: file.type,
          uploaded_by: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single();

      if (documentError) {
        // Clean up uploaded file if database insert fails
        await supabase.storage
          .from('asset-documents')
          .remove([filePath]);
        
        console.error('Error saving document metadata:', documentError);
        throw documentError;
      }

      return documentData;
    } catch (error) {
      console.error('Error in uploadDocument:', error);
      throw error;
    }
  },

  async deleteDocument(documentId: string): Promise<void> {
    try {
      // Get document info first
      const { data: document, error: fetchError } = await supabase
        .from('asset_documents')
        .select('file_path')
        .eq('id', documentId)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('asset-documents')
        .remove([document.file_path]);

      if (storageError) {
        console.error('Error deleting file from storage:', storageError);
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from('asset_documents')
        .delete()
        .eq('id', documentId);

      if (dbError) {
        throw dbError;
      }
    } catch (error) {
      console.error('Error deleting document:', error);
      throw error;
    }
  }
};
