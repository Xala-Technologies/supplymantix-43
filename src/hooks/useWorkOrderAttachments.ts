import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface WorkOrderAttachment {
  id: string;
  file_name: string;
  file_path: string;
  file_type: string;
  file_size: number;
  created_at: string;
}

export const useWorkOrderAttachments = (workOrderId?: string) => {
  const [attachments, setAttachments] = useState<WorkOrderAttachment[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAttachments = async () => {
    if (!workOrderId) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('work_order_attachments')
        .select('*')
        .eq('work_order_id', workOrderId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAttachments(data || []);
    } catch (error) {
      console.error('Error fetching attachments:', error);
      toast.error('Failed to load attachments');
    } finally {
      setLoading(false);
    }
  };

  const deleteAttachment = async (attachmentId: string, filePath: string) => {
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('work-order-files')
        .remove([filePath]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('work_order_attachments')
        .delete()
        .eq('id', attachmentId);

      if (dbError) throw dbError;

      setAttachments(prev => prev.filter(att => att.id !== attachmentId));
      toast.success('Attachment deleted successfully');
    } catch (error) {
      console.error('Error deleting attachment:', error);
      toast.error('Failed to delete attachment');
    }
  };

  const getFileUrl = (filePath: string) => {
    const { data } = supabase.storage
      .from('work-order-files')
      .getPublicUrl(filePath);
    
    return data.publicUrl;
  };

  useEffect(() => {
    fetchAttachments();
  }, [workOrderId]);

  return {
    attachments,
    loading,
    refetch: fetchAttachments,
    deleteAttachment,
    getFileUrl
  };
};