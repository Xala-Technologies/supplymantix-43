
import React from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Copy, Trash2 } from 'lucide-react';

interface FieldOptionsMenuProps {
  index: number;
  onDuplicate?: (index: number) => void;
  onDelete?: (index: number) => void;
  onSelect: (index: number) => void;
  onExpand: (index: number) => void;
}

export const FieldOptionsMenu: React.FC<FieldOptionsMenuProps> = ({
  index,
  onDuplicate,
  onDelete,
  onSelect,
  onExpand
}) => {
  const handleDuplicate = () => {
    console.log('Duplicate clicked for field index:', index);
    if (onDuplicate) {
      onDuplicate(index);
    } else {
      console.warn('onDuplicate handler not provided');
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

  const handleEdit = () => {
    console.log('Edit field clicked for index:', index);
    onSelect(index);
    onExpand(index);
  };

  return (
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
        <DropdownMenuItem onClick={handleEdit}>
          Edit Field
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDuplicate}>
          <Copy className="h-4 w-4 mr-2" />
          Duplicate
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={handleDelete}
          className="text-red-600 focus:text-red-600"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete Field
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
