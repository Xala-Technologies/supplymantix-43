
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Link, Paperclip, Trash2 } from 'lucide-react';
import { ProcedureField } from '@/lib/database/procedures-enhanced';

interface ActionButtonsProps {
  field: ProcedureField;
  index: number;
  onUpdate?: (index: number, updates: Partial<ProcedureField>) => void;
  onDelete?: (index: number) => void;
  onAttachmentClick: (index: number) => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  field,
  index,
  onUpdate,
  onDelete,
  onAttachmentClick
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLinkClick = () => {
    navigator.clipboard.writeText(`Field: ${field.label} (ID: ${field.id})`);
    console.log('Field link copied to clipboard');
  };

  const handleAttachmentClick = () => {
    console.log('Attachment button clicked for field index:', index);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onUpdate) {
      console.log('File selected:', file.name);
      
      const fileUrl = URL.createObjectURL(file);
      
      onUpdate(index, {
        options: {
          ...field.options,
          attachedFile: {
            name: file.name,
            url: fileUrl,
            type: file.type,
            size: file.size
          }
        }
      });
      
      e.target.value = '';
    }
  };

  const handleDelete = () => {
    console.log('Delete clicked for field index:', index);
    if (onDelete) {
      onDelete(index);
    } else {
      console.warn('onDelete handler not provided');
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,application/pdf,.doc,.docx,.txt"
        onChange={handleFileUpload}
        className="hidden"
      />

      <Button
        variant="ghost"
        size="sm"
        onClick={handleLinkClick}
        className="h-8 w-8 p-0 text-blue-500 hover:text-blue-600 hover:bg-blue-50"
        title="Copy field reference"
      >
        <Link className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={handleAttachmentClick}
        className="h-8 w-8 p-0 text-gray-500 hover:text-gray-600 hover:bg-gray-50"
        title="Add attachment"
      >
        <Paperclip className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={handleDelete}
        className="h-8 w-8 p-0 text-gray-500 hover:text-red-600 hover:bg-red-50"
        title="Delete field"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </>
  );
};
