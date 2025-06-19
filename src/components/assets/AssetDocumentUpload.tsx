
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, File, X, Loader2 } from "lucide-react";
import { useUploadAssetDocument } from "@/hooks/useAssetDocuments";
import { cn } from "@/lib/utils";

interface AssetDocumentUploadProps {
  assetId: string;
  onUploadComplete?: () => void;
}

export const AssetDocumentUpload = ({ assetId, onUploadComplete }: AssetDocumentUploadProps) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const uploadMutation = useUploadAssetDocument();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setSelectedFiles(prev => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
      'text/plain': ['.txt'],
    },
    multiple: true
  });

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadFiles = async () => {
    if (selectedFiles.length === 0) return;

    try {
      for (const file of selectedFiles) {
        await uploadMutation.mutateAsync({ assetId, file });
      }
      setSelectedFiles([]);
      onUploadComplete?.();
    } catch (error) {
      console.error('Upload failed:', error);
    }
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
      <Card>
        <CardContent className="p-6">
          <div
            {...getRootProps()}
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
              isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
            )}
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            {isDragActive ? (
              <p className="text-blue-600">Drop the files here...</p>
            ) : (
              <div>
                <p className="text-gray-600 mb-2">
                  Drag & drop files here, or click to select files
                </p>
                <p className="text-sm text-gray-500">
                  Supports PDF, DOC, DOCX, images, and text files
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {selectedFiles.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <h4 className="font-medium mb-3">Selected Files ({selectedFiles.length})</h4>
            <div className="space-y-2">
              {selectedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex items-center gap-2">
                    <File className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">{file.name}</span>
                    <span className="text-xs text-gray-500">({formatFileSize(file.size)})</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                    disabled={uploadMutation.isPending}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-4 gap-2">
              <Button
                variant="outline"
                onClick={() => setSelectedFiles([])}
                disabled={uploadMutation.isPending}
              >
                Clear All
              </Button>
              <Button
                onClick={uploadFiles}
                disabled={uploadMutation.isPending}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {uploadMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Upload Files
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
