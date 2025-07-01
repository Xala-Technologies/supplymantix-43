import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { ChevronUp, ChevronDown, Link, Paperclip, Trash2, MoreHorizontal, Copy } from 'lucide-react';
import { ProcedureField } from '@/lib/database/procedures-enhanced';

interface FieldControlsProps {
  field: ProcedureField;
  index: number;
  fieldsLength: number;
  onMove?: (index: number, direction: 'up' | 'down') => void;
  onUpdate?: (index: number, updates: Partial<ProcedureField>) => void;
  onDuplicate?: (index: number) => void;
  onDelete?: (index: number) => void;
  onAttachmentClick: (index: number) => void;
  onSelect: (index: number) => void;
  onExpand: (index: number) => void;
}

export const FieldControls: React.FC<FieldControlsProps> = ({
  field,
  index,
  fieldsLength,
  onMove,
  onUpdate,
  onDuplicate,
  onDelete,
  onAttachmentClick,
  onSelect,
  onExpand
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLinkClick = () => {
    // Copy field link to clipboard or show field linking dialog
    navigator.clipboard.writeText(`Field: ${field.label} (ID: ${field.id})`);
    console.log('Field link copied to clipboard');
  };

  const handleAttachmentClick = () => {
    console.log('Attachment button clicked for field index:', index);
    // Trigger file input click
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onUpdate) {
      console.log('File selected:', file.name);
      
      // Create file URL for preview
      const fileUrl = URL.createObjectURL(file);
      
      // Update field with attachment
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
      
      // Clear the input
      e.target.value = '';
    }
  };

  const handleMoveUp = () => {
    console.log('Move up clicked for field index:', index);
    if (onMove) {
      onMove(index, 'up');
    } else {
      console.warn('onMove handler not provided');
    }
  };

  const handleMoveDown = () => {
    console.log('Move down clicked for field index:', index);
    if (onMove) {
      onMove(index, 'down');
    } else {
      console.warn('onMove handler not provided');
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

  const handleDuplicate = () => {
    console.log('Duplicate clicked for field index:', index);
    if (onDuplicate) {
      onDuplicate(index);
    } else {
      console.warn('onDuplicate handler not provided');
    }
  };

  const handleRequiredToggle = (checked: boolean) => {
    console.log('Required toggle changed for field index:', index, 'to:', checked);
    if (onUpdate) {
      onUpdate(index, { is_required: checked });
    } else {
      console.warn('onUpdate handler not provided');
    }
  };

  return (
    <div className="flex items-center gap-1">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,application/pdf,.doc,.docx,.txt"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Move Controls */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onMove && onMove(index, 'up')}
        disabled={index === 0}
        className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
        title="Move field up"
      >
        <ChevronUp className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onMove && onMove(index, 'down')}
        disabled={index === fieldsLength - 1}
        className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
        title="Move field down"
      >
        <ChevronDown className="h-4 w-4" />
      </Button>

      {/* Link Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleLinkClick}
        className="h-8 w-8 p-0 text-blue-500 hover:text-blue-600 hover:bg-blue-50"
        title="Copy field reference"
      >
        <Link className="h-4 w-4" />
      </Button>
      
      {/* Attachment Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleAttachmentClick}
        className="h-8 w-8 p-0 text-gray-500 hover:text-gray-600 hover:bg-gray-50"
        title="Add attachment"
      >
        <Paperclip className="h-4 w-4" />
      </Button>
      
      {/* Delete Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onDelete && onDelete(index)}
        className="h-8 w-8 p-0 text-gray-500 hover:text-red-600 hover:bg-red-50"
        title="Delete field"
      >
        <Trash2 className="h-4 w-4" />
      </Button>

      {/* Required Toggle */}
      <div className="flex items-center gap-2 px-2 border-l border-gray-200">
        <Label htmlFor={`required-${field.id}`} className="text-sm text-gray-600">
          Required
        </Label>
        <Switch
          id={`required-${field.id}`}
          checked={field.is_required}
          onCheckedChange={(checked) => onUpdate && onUpdate(index, { is_required: checked })}
        />
      </div>

      {/* More Options Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-gray-500 hover:text-gray-600 hover:bg-gray-50"
            title="More options"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 bg-white border border-gray-200 shadow-lg z-50">
          <DropdownMenuItem onClick={() => {
            console.log('Edit field clicked for index:', index);
            onSelect(index);
            onExpand(index);
          }}>
            Edit Field
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onDuplicate && onDuplicate(index)}>
            <Copy className="h-4 w-4 mr-2" />
            Duplicate
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={() => onDelete && onDelete(index)}
            className="text-red-600 focus:text-red-600"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Field
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
