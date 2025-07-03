import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { MapPin, Edit, Trash2, MoreHorizontal, Eye, Package } from "lucide-react";

interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  description: string;
  quantity: number;
  minQuantity: number;
  unitCost: number;
  totalValue: number;
  location: string;
  category: string;
  status: string;
}

interface InventoryListProps {
  items: InventoryItem[];
  onViewItem: (item: InventoryItem) => void;
  onEditItem: (item: InventoryItem) => void;
  onDeleteItem: (item: InventoryItem) => void;
}

export const InventoryList = ({ 
  items, 
  onViewItem,
  onEditItem,
  onDeleteItem 
}: InventoryListProps) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'in_stock':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'low_stock':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'out_of_stock':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center justify-between text-sm font-medium text-gray-600">
          <div className="flex-1">Item</div>
          <div className="hidden md:block w-24 text-center">Status</div>
          <div className="hidden md:block w-32 text-center">Location</div>
          <div className="hidden md:block w-24 text-center">Quantity</div>
          <div className="hidden md:block w-24 text-center">Value</div>
          <div className="w-24 text-center">Actions</div>
        </div>
      </div>

      {/* List Items */}
      <div className="divide-y divide-gray-100">
        {items.map((item) => (
          <div 
            key={item.id} 
            className="px-6 py-4 transition-colors hover:bg-gray-50"
          >
            <div className="flex items-center justify-between">
              {/* Item Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Package className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <button
                      onClick={() => onViewItem(item)}
                      className="font-semibold text-gray-900 hover:text-blue-600 transition-colors flex items-center gap-2 group"
                    >
                      {item.name}
                      <Eye className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                    <p className="text-sm text-gray-500">SKU: {item.sku}</p>
                  </div>
                </div>
              </div>

              {/* Status - Hidden on mobile */}
              <div className="hidden md:flex w-24 justify-center">
                <Badge className={cn("text-xs border", getStatusColor(item.status))}>
                  {item.status.replace('_', ' ')}
                </Badge>
              </div>

              {/* Location - Hidden on mobile */}
              <div className="hidden md:flex w-32 justify-center">
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <MapPin className="h-3 w-3" />
                  <span className="truncate">{item.location}</span>
                </div>
              </div>

              {/* Quantity - Hidden on mobile */}
              <div className="hidden md:flex w-24 justify-center">
                <span className="text-sm text-gray-900 font-medium">{item.quantity}</span>
              </div>

              {/* Value - Hidden on mobile */}
              <div className="hidden md:flex w-24 justify-center">
                <span className="text-sm text-gray-900 font-medium">${item.totalValue.toFixed(2)}</span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 w-24 justify-center">
                <Button
                  size="sm"
                  onClick={() => onViewItem(item)}
                  className="bg-blue-600 hover:bg-blue-700 text-xs px-2"
                >
                  <Eye className="h-3 w-3" />
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-white border shadow-lg">
                    <DropdownMenuItem onClick={() => onViewItem(item)}>
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEditItem(item)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => onDeleteItem(item)}
                      className="text-red-600"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};