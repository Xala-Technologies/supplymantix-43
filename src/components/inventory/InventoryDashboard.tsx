import { useState } from "react";
import { InventoryHeader } from "./InventoryHeader";
import { InventoryStats } from "./InventoryStats";
import { InventoryGrid } from "./InventoryGrid";
import { InventoryList } from "./InventoryList";
import { InventoryForm } from "./InventoryForm";
import { InventoryDetailCard } from "./InventoryDetailCard";
import { DataLoadingManager } from "@/components/ui/DataLoadingManager";
import { useInventoryEnhanced } from "@/hooks/useInventoryEnhanced";
import { useExportInventory } from "@/hooks/useInventoryExport";
import { useDeleteInventoryItem, useCreateInventoryItem } from "@/hooks/useInventoryMutations";
import { useUndoDelete } from "@/hooks/useUndoDelete";
import { toast } from "sonner";
import type { InventoryItemWithStats } from "@/lib/database/inventory-enhanced";

// Map database type to component type
const mapInventoryItem = (item: InventoryItemWithStats) => ({
  id: item.id,
  name: item.name,
  sku: item.sku || '',
  description: item.description || '',
  quantity: item.quantity,
  minQuantity: item.min_quantity || 0,
  unitCost: item.unit_cost || 0,
  totalValue: item.total_value || 0,
  location: item.location || '',
  category: item.location || 'General',
  status: item.is_low_stock ? 'low_stock' : item.quantity === 0 ? 'out_of_stock' : 'in_stock'
});

export const InventoryDashboard = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [locationFilter, setLocationFilter] = useState<string>("all");
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

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
  const items = rawItems.map(mapInventoryItem);
  const totalItems = items.length;
  const lowStockItems = rawItems.filter(item => item.is_low_stock).length;
  const totalValue = rawItems.reduce((sum, item) => sum + (item.total_value || 0), 0);
  const categories = new Set(rawItems.map(item => item.location || 'Unknown')).size;

  // Get unique locations for filter
  const locations = Array.from(new Set(rawItems.map(item => item.location).filter(Boolean)));

  const handleCreateItem = () => {
    console.log('Creating new inventory item');
    setShowCreateForm(true);
  };

  const handleViewItem = (item: any) => {
    console.log('Viewing item:', item);
    setSelectedItem(item);
  };

  const handleEditItem = (item: any) => {
    console.log('Editing item:', item);
    setEditingItem(item);
    setShowEditForm(true);
  };

  const handleDeleteItem = async (item: any) => {
    console.log('Deleting item:', item);
    
    try {
      const itemToRestore = {
        name: item.name,
        description: item.description,
        sku: item.sku,
        location: item.location,
        quantity: item.quantity,
        min_quantity: item.minQuantity,
        unit_cost: item.unitCost,
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

  const handleFormSuccess = () => {
    setShowCreateForm(false);
    setShowEditForm(false);
    setEditingItem(null);
    refetch();
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
        viewMode={viewMode}
        onViewModeChange={setViewMode}
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
          {viewMode === 'grid' ? (
            <InventoryGrid
              items={items}
              onViewItem={handleViewItem}
              onEditItem={handleEditItem}
              onDeleteItem={handleDeleteItem}
            />
          ) : (
            <InventoryList
              items={items}
              onViewItem={handleViewItem}
              onEditItem={handleEditItem}
              onDeleteItem={handleDeleteItem}
            />
          )}
        </DataLoadingManager>
      </div>

      <InventoryForm
        mode="create"
        onSuccess={handleFormSuccess}
        open={showCreateForm}
        onOpenChange={setShowCreateForm}
      />

      <InventoryForm
        mode="edit"
        item={editingItem}
        onSuccess={handleFormSuccess}
        open={showEditForm}
        onOpenChange={setShowEditForm}
      />

      {selectedItem && (
        <InventoryDetailCard
          item={{
            ...selectedItem,
            supplier: 'N/A',
            partNumber: 'N/A',
            lastOrdered: 'N/A',
            leadTime: 'N/A',
            reorderPoint: selectedItem.minQuantity,
            maxStock: selectedItem.minQuantity * 3,
            transactions: []
          }}
          onClose={() => setSelectedItem(null)}
          onEdit={() => {
            setEditingItem(selectedItem);
            setSelectedItem(null);
            setShowEditForm(true);
          }}
        />
      )}
    </div>
  );
};
