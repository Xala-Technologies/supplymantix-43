import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Upload, X, File, Image, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface FileUpload {
  id: string;
  file: File;
  preview?: string;
  uploading: boolean;
  uploaded: boolean;
  error?: string;
}

interface UploadedFile {
  id: string;
  file_name: string;
  file_path: string;
  file_type: string;
  file_size: number;
  created_at: string;
}

interface FileUploadSectionProps {
  workOrderId?: string;
  initialFiles?: UploadedFile[];
  onFilesChange?: (files: UploadedFile[]) => void;
  maxFiles?: number;
  maxSize?: number; // in MB
  acceptedTypes?: string[];
}

export const FileUploadSection: React.FC<FileUploadSectionProps> = ({
  workOrderId,
  initialFiles = [],
  onFilesChange,
  maxFiles = 10,
  maxSize = 10,
  acceptedTypes = ['image/*', 'application/pdf', '.doc', '.docx', '.txt']
}) => {
  const [files, setFiles] = useState<FileUpload[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>(initialFiles);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles: FileUpload[] = acceptedFiles.map(file => ({
      id: crypto.randomUUID(),
      file,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
      uploading: false,
      uploaded: false
    }));

    // Check file size
    const oversizedFiles = newFiles.filter(f => f.file.size > maxSize * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      toast.error(`Some files exceed the ${maxSize}MB limit and were not added`);
      const validFiles = newFiles.filter(f => f.file.size <= maxSize * 1024 * 1024);
      setFiles(prev => [...prev, ...validFiles].slice(0, maxFiles));
    } else {
      setFiles(prev => [...prev, ...newFiles].slice(0, maxFiles));
    }
  }, [maxFiles, maxSize]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedTypes.reduce((acc, type) => {
      acc[type] = [];
      return acc;
    }, {} as Record<string, string[]>),
    maxFiles: maxFiles - files.length - uploadedFiles.length,
    disabled: files.length + uploadedFiles.length >= maxFiles
  });

  const uploadFile = async (fileUpload: FileUpload) => {
    if (!workOrderId) {
      toast.error('Work order must be saved before uploading files');
      return;
    }

    setFiles(prev => prev.map(f => 
      f.id === fileUpload.id ? { ...f, uploading: true, error: undefined } : f
    ));

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const fileExt = fileUpload.file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      // Upload to storage
      const { error: storageError } = await supabase.storage
        .from('work-order-files')
        .upload(filePath, fileUpload.file);

      if (storageError) throw storageError;

      // Get user's tenant_id
      const { data: userData } = await supabase
        .from('users')
        .select('tenant_id')
        .eq('id', user.id)
        .single();

      if (!userData) throw new Error('User tenant not found');

      // Save to database
      const { data: attachment, error: dbError } = await supabase
        .from('work_order_attachments')
        .insert({
          work_order_id: workOrderId,
          file_name: fileUpload.file.name,
          file_path: filePath,
          file_type: fileUpload.file.type,
          file_size: fileUpload.file.size,
          uploaded_by: user.id,
          tenant_id: userData.tenant_id
        })
        .select()
        .single();

      if (dbError) throw dbError;

      // Update state
      setFiles(prev => prev.filter(f => f.id !== fileUpload.id));
      const newUploadedFile: UploadedFile = {
        id: attachment.id,
        file_name: attachment.file_name,
        file_path: attachment.file_path,
        file_type: attachment.file_type,
        file_size: attachment.file_size,
        created_at: attachment.created_at
      };
      
      setUploadedFiles(prev => {
        const updated = [...prev, newUploadedFile];
        onFilesChange?.(updated);
        return updated;
      });

      toast.success('File uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error);
      setFiles(prev => prev.map(f => 
        f.id === fileUpload.id 
          ? { ...f, uploading: false, error: error instanceof Error ? error.message : 'Upload failed' }
          : f
      ));
      toast.error('Failed to upload file');
    }
  };

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const removeUploadedFile = async (fileId: string, filePath: string) => {
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
        .eq('id', fileId);

      if (dbError) throw dbError;

      setUploadedFiles(prev => {
        const updated = prev.filter(f => f.id !== fileId);
        onFilesChange?.(updated);
        return updated;
      });

      toast.success('File removed successfully');
    } catch (error) {
      console.error('Remove error:', error);
      toast.error('Failed to remove file');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return Image;
    return File;
  };

  return (
    <div className="space-y-4">
      <Label className="text-base font-medium text-text-primary">
        Attachments ({uploadedFiles.length + files.length}/{maxFiles})
      </Label>

      {/* Dropzone */}
      {files.length + uploadedFiles.length < maxFiles && (
        <Card className="border-2 border-dashed border-border-secondary hover:border-primary-300 transition-colors">
          <CardContent className="p-6">
            <div
              {...getRootProps()}
              className={`text-center cursor-pointer space-y-4 ${
                isDragActive ? 'opacity-70' : ''
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="w-10 h-10 text-text-tertiary mx-auto" />
              <div>
                <p className="text-text-primary font-medium">
                  {isDragActive
                    ? 'Drop files here...'
                    : 'Drag & drop files here, or click to select'}
                </p>
                <p className="text-sm text-text-secondary mt-1">
                  Max {maxFiles} files, up to {maxSize}MB each
                </p>
                <p className="text-xs text-text-tertiary mt-1">
                  Supported: Images, PDF, DOC, DOCX, TXT
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pending uploads */}
      {files.length > 0 && (
        <div className="space-y-2">
          <Label className="text-sm text-text-secondary">Pending uploads</Label>
          {files.map((fileUpload) => {
            const FileIcon = getFileIcon(fileUpload.file.type);
            return (
              <Card key={fileUpload.id} className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    {fileUpload.preview ? (
                      <img
                        src={fileUpload.preview}
                        alt="Preview"
                        className="w-8 h-8 rounded object-cover"
                      />
                    ) : (
                      <FileIcon className="w-8 h-8 text-text-tertiary" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text-primary truncate">
                        {fileUpload.file.name}
                      </p>
                      <p className="text-xs text-text-secondary">
                        {formatFileSize(fileUpload.file.size)}
                      </p>
                      {fileUpload.error && (
                        <div className="flex items-center space-x-1 mt-1">
                          <AlertCircle className="w-3 h-3 text-destructive" />
                          <p className="text-xs text-destructive">{fileUpload.error}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {!fileUpload.uploading && workOrderId && (
                      <Button
                        size="sm"
                        onClick={() => uploadFile(fileUpload)}
                        disabled={fileUpload.uploading}
                      >
                        Upload
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removeFile(fileUpload.id)}
                      disabled={fileUpload.uploading}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                {fileUpload.uploading && (
                  <div className="mt-2">
                    <div className="w-full bg-background-secondary rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full animate-pulse w-1/2"></div>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* Uploaded files */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <Label className="text-sm text-text-secondary">Uploaded files</Label>
          {uploadedFiles.map((file) => {
            const FileIcon = getFileIcon(file.file_type);
            return (
              <Card key={file.id} className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <FileIcon className="w-8 h-8 text-text-tertiary" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text-primary truncate">
                        {file.file_name}
                      </p>
                      <p className="text-xs text-text-secondary">
                        {formatFileSize(file.file_size)} • {new Date(file.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => removeUploadedFile(file.id, file.file_path)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};