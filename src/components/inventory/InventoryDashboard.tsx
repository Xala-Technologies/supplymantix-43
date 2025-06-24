
import { useState } from "react";
import { InventoryHeader } from "./InventoryHeader";
import { InventoryStats } from "./InventoryStats";
import { InventoryGrid } from "./InventoryGrid";
import { InventoryForm } from "./InventoryForm";
import { useInventoryEnhanced } from "@/hooks/useInventoryEnhanced";

export const InventoryDashboard = () => {
  const [search, setSearch] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Sample data for now - replace with real data
  const sampleData = [
    {
      id: '1',
      name: 'Hydraulic Oil Filter',
      sku: 'HYD-001',
      description: 'High-performance hydraulic oil filter',
      quantity: 25,
      minQuantity: 10,
      unitCost: 45.99,
      totalValue: 1149.75,
      location: 'Warehouse A',
      category: 'Filters',
      status: 'in_stock'
    },
    {
      id: '2',
      name: 'Safety Gloves',
      sku: 'SAF-002',
      description: 'Cut-resistant safety gloves',
      quantity: 8,
      minQuantity: 15,
      unitCost: 12.50,
      totalValue: 100.00,
      location: 'Safety Room',
      category: 'Safety',
      status: 'low_stock'
    }
  ];

  const filteredItems = sampleData.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.sku?.toLowerCase().includes(search.toLowerCase())
  );

  const totalItems = sampleData.length;
  const lowStockItems = sampleData.filter(item => item.quantity <= item.minQuantity).length;
  const totalValue = sampleData.reduce((sum, item) => sum + item.totalValue, 0);
  const categories = new Set(sampleData.map(item => item.category)).size;

  const handleCreateItem = () => {
    setShowCreateForm(true);
  };

  const handleViewItem = (item: any) => {
    console.log('View item:', item);
  };

  const handleEditItem = (item: any) => {
    console.log('Edit item:', item);
  };

  const handleRefresh = () => {
    console.log('Refresh inventory');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <InventoryHeader
        onCreateItem={handleCreateItem}
        searchQuery={search}
        onSearchChange={setSearch}
        onRefresh={handleRefresh}
        totalItems={totalItems}
        lowStockCount={lowStockItems}
      />
      
      <div className="p-6">
        <InventoryStats
          totalItems={totalItems}
          lowStockItems={lowStockItems}
          totalValue={totalValue}
          categories={categories}
        />
        
        <InventoryGrid
          items={filteredItems}
          onViewItem={handleViewItem}
          onEditItem={handleEditItem}
        />
      </div>

      {showCreateForm && (
        <InventoryForm
          mode="create"
          onSuccess={() => setShowCreateForm(false)}
          trigger={null}
        />
      )}
    </div>
  );
};
