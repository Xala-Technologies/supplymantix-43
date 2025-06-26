
import React from 'react';
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
  return (
    <div className="flex items-center gap-1">
      {/* Move Controls */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onMove && onMove(index, 'up')}
        disabled={index === 0}
        className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
      >
        <ChevronUp className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onMove && onMove(index, 'down')}
        disabled={index === fieldsLength - 1}
        className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
      >
        <ChevronDown className="h-4 w-4" />
      </Button>

      {/* Link Button */}
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 text-blue-500 hover:text-blue-600 hover:bg-blue-50"
      >
        <Link className="h-4 w-4" />
      </Button>
      
      {/* Attachment Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onAttachmentClick(index)}
        className="h-8 w-8 p-0 text-gray-500 hover:text-gray-600 hover:bg-gray-50"
      >
        <Paperclip className="h-4 w-4" />
      </Button>
      
      {/* Delete Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onDelete && onDelete(index)}
        className="h-8 w-8 p-0 text-gray-500 hover:text-red-600 hover:bg-red-50"
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
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 bg-white border border-gray-200 shadow-lg z-50">
          <DropdownMenuItem onClick={() => {
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
