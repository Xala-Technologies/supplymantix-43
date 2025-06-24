
import React from "react";
import { InventoryCard } from "./InventoryCard";

interface InventoryItem {
  id: string;
  name: string;
  sku?: string;
  description?: string;
  quantity: number;
  minQuantity: number;
  unitCost: number;
  totalValue: number;
  location?: string;
  category?: string;
  status: string;
}

interface InventoryGridProps {
  items: InventoryItem[];
  onViewItem?: (item: InventoryItem) => void;
  onEditItem?: (item: InventoryItem) => void;
}

export const InventoryGrid = ({ items, onViewItem, onEditItem }: InventoryGridProps) => {
  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-5.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H1" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No inventory items</h3>
        <p className="text-gray-500">Get started by adding your first inventory item.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {items.map((item) => (
        <InventoryCard
          key={item.id}
          item={item}
          onView={onViewItem}
          onEdit={onEditItem}
        />
      ))}
    </div>
  );
};
