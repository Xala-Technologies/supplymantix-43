import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Download, Image, File, Plus } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';

interface WorkOrderAttachmentsDisplayProps {
  workOrderId: string;
}

interface WorkOrderAttachment {
  id: string;
  file_name: string;
  file_type: string;
  file_size: number;
  file_path: string;
  created_at: string;
  uploaded_by?: string;
}

const getFileIcon = (fileType: string) => {
  if (fileType.startsWith('image/')) {
    return Image;
  } else if (fileType.includes('pdf')) {
    return FileText;
  }
  return File;
};

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const WorkOrderAttachmentsDisplay: React.FC<WorkOrderAttachmentsDisplayProps> = ({
  workOrderId
}) => {
  const { data: attachments = [], isLoading } = useQuery({
    queryKey: ['work-order-attachments', workOrderId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('work_order_attachments')
        .select('*')
        .eq('work_order_id', workOrderId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []) as WorkOrderAttachment[];
    },
    enabled: !!workOrderId,
  });

  const handleDownload = async (attachment: WorkOrderAttachment) => {
    try {
      const { data, error } = await supabase.storage
        .from('work-order-files')
        .download(attachment.file_path);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = attachment.file_name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const getFileUrl = (filePath: string) => {
    const { data } = supabase.storage
      .from('work-order-files')
      .getPublicUrl(filePath);
    return data.publicUrl;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Attachments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            Attachments ({attachments.length})
          </CardTitle>
          <Button size="sm" variant="outline" className="gap-2">
            <Plus className="h-4 w-4" />
            Add File
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {attachments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <File className="mx-auto h-12 w-12 mb-4 opacity-50" />
            <p className="text-sm">No attachments</p>
          </div>
        ) : (
          <div className="space-y-4">
            {attachments.map((attachment) => {
              const FileIcon = getFileIcon(attachment.file_type);
              const isImage = attachment.file_type.startsWith('image/');
              
              return (
                <div key={attachment.id} className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50">
                  {isImage ? (
                    <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={getFileUrl(attachment.file_path)}
                        alt={attachment.file_name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileIcon className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-sm font-medium truncate">{attachment.file_name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {formatFileSize(attachment.file_size)}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(attachment.created_at), { addSuffix: true })}
                          </span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDownload(attachment)}
                        className="flex-shrink-0"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};