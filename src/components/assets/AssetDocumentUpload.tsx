
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { Upload, X, FileText, Download } from 'lucide-react';
import { toast } from 'sonner';

interface Document {
  name: string;
  url: string;
  size: number;
}

interface AssetDocumentUploadProps {
  documents: Document[];
  onDocumentsChanged: (documents: Document[]) => void;
}

export const AssetDocumentUpload: React.FC<AssetDocumentUploadProps> = ({
  documents,
  onDocumentsChanged
}) => {
  const [uploading, setUploading] = useState(false);

  const uploadDocument = async (file: File) => {
    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${file.name}`;
      const filePath = `documents/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('asset-documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('asset-documents')
        .getPublicUrl(filePath);

      const newDoc: Document = {
        name: file.name,
        url: data.publicUrl,
        size: file.size
      };

      onDocumentsChanged([...documents, newDoc]);
      toast.success('Document uploaded successfully');
    } catch (error) {
      console.error('Error uploading document:', error);
      toast.error('Error uploading document');
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error('File size must be less than 10MB');
        return;
      }
      uploadDocument(file);
    }
  };

  const removeDocument = (index: number) => {
    const newDocs = documents.filter((_, i) => i !== index);
    onDocumentsChanged(newDocs);
    toast.success('Document removed');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      <Label>Documents</Label>
      
      {documents.length > 0 && (
        <div className="space-y-2">
          {documents.map((doc, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">{doc.name}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(doc.size)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(doc.url, '_blank')}
                >
                  <Download className="h-3 w-3" />
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => removeDocument(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2">
        <Input
          type="file"
          accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.png,.jpg,.jpeg"
          onChange={handleFileChange}
          disabled={uploading}
          className="hidden"
          id="asset-document-upload"
        />
        <Label htmlFor="asset-document-upload" asChild>
          <Button
            type="button"
            variant="outline"
            disabled={uploading}
            className="cursor-pointer"
          >
            <Upload className="h-4 w-4 mr-2" />
            {uploading ? 'Uploading...' : 'Upload Document'}
          </Button>
        </Label>
      </div>
    </div>
  );
};
