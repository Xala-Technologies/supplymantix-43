
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { Upload, X, Image } from 'lucide-react';
import { toast } from 'sonner';

interface AssetImageUploadProps {
  currentImageUrl?: string;
  onImageUploaded: (url: string) => void;
  onImageRemoved: () => void;
}

export const AssetImageUpload: React.FC<AssetImageUploadProps> = ({
  currentImageUrl,
  onImageUploaded,
  onImageRemoved
}) => {
  const [uploading, setUploading] = useState(false);

  const uploadImage = async (file: File) => {
    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `assets/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('asset-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('asset-images')
        .getPublicUrl(filePath);

      onImageUploaded(data.publicUrl);
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Error uploading image');
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('File size must be less than 5MB');
        return;
      }
      uploadImage(file);
    }
  };

  const removeImage = () => {
    onImageRemoved();
    toast.success('Image removed');
  };

  return (
    <div className="space-y-4">
      <Label>Asset Image</Label>
      
      {currentImageUrl ? (
        <div className="relative w-32 h-32 border rounded-lg overflow-hidden">
          <img 
            src={currentImageUrl} 
            alt="Asset" 
            className="w-full h-full object-cover"
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-1 right-1 h-6 w-6 p-0"
            onClick={removeImage}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ) : (
        <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
          <Image className="h-8 w-8 text-gray-400" />
        </div>
      )}

      <div className="flex items-center gap-2">
        <Input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
          className="hidden"
          id="asset-image-upload"
        />
        <Label htmlFor="asset-image-upload" asChild>
          <Button
            type="button"
            variant="outline"
            disabled={uploading}
            className="cursor-pointer"
          >
            <Upload className="h-4 w-4 mr-2" />
            {uploading ? 'Uploading...' : 'Upload Image'}
          </Button>
        </Label>
      </div>
    </div>
  );
};
