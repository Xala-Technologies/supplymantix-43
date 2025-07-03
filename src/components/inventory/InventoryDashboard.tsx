import { useState } from "react";
import { InventoryHeader } from "./InventoryHeader";
import { InventoryStats } from "./InventoryStats";
import { InventoryGrid } from "./InventoryGrid";
import { InventoryForm } from "./InventoryForm";
import { InventoryDetailCard } from "./InventoryDetailCard";
import { DataLoadingManager } from "@/components/ui/DataLoadingManager";
import { useInventoryEnhanced } from '@/hooks/useInventoryEnhanced';
import type { InventoryItemWithStats } from '@/lib/database/inventory-enhanced';
import { useExportInventory } from "@/hooks/useInventoryExport";
import { useDeleteInventoryItem, useCreateInventoryItem } from "@/hooks/useInventoryMutations";
import { useUndoDelete } from "@/hooks/useUndoDelete";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

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

const mapToInventoryItem = (item: InventoryItemWithStats): InventoryItem => ({
  id: item.id,
  name: item.name,
  sku: item.sku,
  description: item.description,
  quantity: item.quantity,
  minQuantity: item.min_quantity,
  unitCost: item.unit_cost,
  totalValue: item.total_value,
  location: item.location,
  category: item.location || 'General',
  status: item.is_low_stock ? 'low_stock' : item.quantity === 0 ? 'out_of_stock' : 'in_stock',
});

export const InventoryDashboard = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [locationFilter, setLocationFilter] = useState<string>("all");
  const [selectedItem, setSelectedItem] = useState<InventoryItemWithStats | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const navigate = useNavigate();

  // Enhanced inventory query with robust loading
  const { data: inventoryData, isLoading, error, refetch } = useInventoryEnhanced({
    search: search || undefined,
    status: statusFilter !== "all" ? statusFilter as any : undefined,
    location: locationFilter !== "all" ? locationFilter : undefined,
    sortBy: 'name',
    sortOrder: 'asc'
  });

  const exportMutation = useExportInventory();
  const deleteMutation = useDeleteInventoryItem();
  const createMutation = useCreateInventoryItem();
  const { addUndoItem } = useUndoDelete();

  // Safely access inventory data with fallbacks
  const rawItems = inventoryData?.items || [];
  const items = rawItems.map(mapToInventoryItem);
  const totalItems = items.length;
  const lowStockItems = rawItems.filter(item => item.is_low_stock).length;
  const totalValue = rawItems.reduce((sum, item) => sum + (item.total_value || 0), 0);
  const categories = new Set(rawItems.map(item => item.location || 'Unknown')).size;

  // Get unique locations for filter
  const locations = Array.from(new Set(rawItems.map(item => item.location).filter(Boolean)));

  const handleCreateItem = () => {
    navigate('/dashboard/inventory/new');
  };

  const handleViewItem = (item: InventoryItemWithStats) => {
    console.log('Viewing item:', item);
    setSelectedItem(item);
  };

  const handleDeleteItem = async (item: InventoryItemWithStats) => {
    console.log('Deleting item:', item);
    
    try {
      const itemToRestore = {
        name: item.name,
        description: item.description,
        sku: item.sku,
        location: item.location,
        quantity: item.quantity,
        min_quantity: item.min_quantity,
        unit_cost: item.unit_cost,
      };

      await deleteMutation.mutateAsync(item.id);

      addUndoItem(
        item.id,
        itemToRestore,
        async () => {
          console.log('Restoring item:', itemToRestore);
          await createMutation.mutateAsync(itemToRestore);
          await refetch();
        },
        item.name
      );
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const handleRefresh = async () => {
    console.log('Refreshing inventory data');
    try {
      await refetch();
      toast.success("Inventory data refreshed");
    } catch (error) {
      console.error('Refresh error:', error);
      toast.error("Failed to refresh inventory data");
    }
  };

  const handleExportData = async () => {
    console.log('Exporting inventory data');
    try {
      await exportMutation.mutateAsync(rawItems);
    } catch (error) {
      console.error('Export error:', error);
    }
  };

  const handleFilterChange = (type: string, value: string) => {
    console.log(`Filter change - ${type}:`, value);
    if (type === 'status') {
      setStatusFilter(value);
    } else if (type === 'location') {
      setLocationFilter(value);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <InventoryHeader
        onCreateItem={handleCreateItem}
        searchQuery={search}
        onSearchChange={setSearch}
        onRefresh={handleRefresh}
        onExport={handleExportData}
        onFilterChange={handleFilterChange}
        statusFilter={statusFilter}
        locationFilter={locationFilter}
        locations={locations}
        totalItems={totalItems}
        lowStockCount={lowStockItems}
        isLoading={isLoading}
        isExporting={exportMutation.isPending}
      />
      
      <div className="p-6">
        <InventoryStats
          totalItems={totalItems}
          lowStockItems={lowStockItems}
          totalValue={totalValue}
          categories={categories}
        />
        
        <DataLoadingManager
          isLoading={isLoading}
          error={error}
          onRetry={refetch}
          loadingText="Loading inventory items..."
          errorText="Failed to load inventory data"
        >
          <InventoryGrid
            items={items}
            onViewItem={(item) => navigate(`/dashboard/inventory/${item.id}`)}
            onDeleteItem={(item) => handleDeleteItem(rawItems.find(i => i.id === item.id) as InventoryItemWithStats)}
          />
        </DataLoadingManager>
      </div>

      {selectedItem && (
        <InventoryDetailCard
          item={{
            id: selectedItem.id,
            name: selectedItem.name,
            sku: selectedItem.sku,
            description: selectedItem.description,
            quantity: selectedItem.quantity,
            minQuantity: selectedItem.min_quantity,
            unitCost: selectedItem.unit_cost,
            totalValue: selectedItem.total_value,
            location: selectedItem.location,
            category: selectedItem.location || 'General',
            status: selectedItem.is_low_stock ? 'low_stock' : selectedItem.quantity === 0 ? 'out_of_stock' : 'in_stock',
            supplier: 'N/A',
            partNumber: 'N/A',
            lastOrdered: 'N/A',
            leadTime: 'N/A',
            reorderPoint: selectedItem.min_quantity,
            maxStock: selectedItem.min_quantity * 3,
            transactions: []
          }}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </div>
  );
};
