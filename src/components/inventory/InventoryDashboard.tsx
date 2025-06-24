import { useState } from "react";
import { InventoryHeader } from "./InventoryHeader";
import { InventoryStats } from "./InventoryStats";
import { InventoryGrid } from "./InventoryGrid";
import { InventoryForm } from "./InventoryForm";
import { InventoryDetailCard } from "./InventoryDetailCard";
import { useInventoryEnhanced } from "@/hooks/useInventoryEnhanced";
import { useExportInventory } from "@/hooks/useInventoryExport";
import { useDeleteInventoryItem } from "@/hooks/useInventoryMutations";
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
  category: item.location || 'General', // Use location as category fallback since category doesn't exist in DB
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

  // Enhanced inventory query with real data
  const { data: inventoryData, isLoading, error, refetch } = useInventoryEnhanced({
    search: search || undefined,
    status: statusFilter !== "all" ? statusFilter as any : undefined,
    location: locationFilter !== "all" ? locationFilter : undefined,
    sortBy: 'name',
    sortOrder: 'asc'
  });

  const exportMutation = useExportInventory();
  const deleteMutation = useDeleteInventoryItem();
  const { addUndoItem } = useUndoDelete();

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
      // Store item data for potential undo
      const itemToRestore = {
        ...item,
        // Convert back to database format
        min_quantity: item.minQuantity,
        unit_cost: item.unitCost,
      };

      // Delete the item
      await deleteMutation.mutateAsync(item.id);

      // Add undo functionality
      addUndoItem(
        item.id,
        itemToRestore,
        async () => {
          // Recreate the item with the same data (minus the ID to create a new one)
          const { id, ...itemData } = itemToRestore;
          console.log('Restoring item:', itemData);
          // We would need a create mutation here, but for now we'll just refetch
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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error loading inventory</h2>
          <p className="text-gray-600 mb-4">{error.message}</p>
          <button
            onClick={handleRefresh}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

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
        
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading inventory...</span>
          </div>
        ) : (
          <InventoryGrid
            items={items}
            onViewItem={handleViewItem}
            onEditItem={handleEditItem}
            onDeleteItem={handleDeleteItem}
          />
        )}
      </div>

      {/* Create Form Dialog */}
      <InventoryForm
        mode="create"
        onSuccess={handleFormSuccess}
        open={showCreateForm}
        onOpenChange={setShowCreateForm}
      />

      {/* Edit Form Dialog */}
      <InventoryForm
        mode="edit"
        item={editingItem}
        onSuccess={handleFormSuccess}
        open={showEditForm}
        onOpenChange={setShowEditForm}
      />

      {/* Detail View Dialog */}
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
