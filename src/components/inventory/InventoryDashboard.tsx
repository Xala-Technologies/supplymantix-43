import { useState } from "react";
import { InventoryHeader } from "./InventoryHeader";
import { InventoryStats } from "./InventoryStats";
import { InventoryGrid } from "./InventoryGrid";
import { InventoryDetailCard } from "./InventoryDetailCard";
import { DataLoadingManager } from "@/components/ui/DataLoadingManager";
import { useInventoryEnhanced } from '@/hooks/useInventoryEnhanced';
import type { InventoryItemWithStats } from '@/lib/database/inventory-enhanced';
import { useExportInventory } from "@/hooks/useInventoryExport";
import { useDeleteInventoryItem, useCreateInventoryItem } from "@/hooks/useInventoryMutations";
import { useUndoDelete } from "@/hooks/useUndoDelete";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface Part {
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

const mapToPart = (item: InventoryItemWithStats): Part => ({
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

export const PartsInventoryDashboard = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [locationFilter, setLocationFilter] = useState<string>("all");
  const [selectedPart, setSelectedPart] = useState<InventoryItemWithStats | null>(null);
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
  const rawParts = inventoryData?.items || [];
  const parts = rawParts.map(mapToPart);
  const totalParts = parts.length;
  const lowStockParts = rawParts.filter(item => item.is_low_stock).length;
  const totalValue = rawParts.reduce((sum, item) => sum + (item.total_value || 0), 0);
  const categories = new Set(rawParts.map(item => item.location || 'Unknown')).size;

  // Get unique locations for filter
  const locations = Array.from(new Set(rawParts.map(item => item.location).filter(Boolean)));

  const handleCreatePart = () => {
    navigate('/dashboard/inventory/new');
  };

  const handleViewPart = (part: InventoryItemWithStats) => {
    console.log('Viewing part:', part);
    setSelectedPart(part);
  };

  const handleDeletePart = async (part: InventoryItemWithStats) => {
    console.log('Deleting part:', part);
    
    try {
      const itemToRestore = {
        name: part.name,
        description: part.description,
        sku: part.sku,
        location: part.location,
        quantity: part.quantity,
        min_quantity: part.min_quantity,
        unit_cost: part.unit_cost,
      };

      await deleteMutation.mutateAsync(part.id);

      addUndoItem(
        part.id,
        itemToRestore,
        async () => {
          console.log('Restoring part:', itemToRestore);
          await createMutation.mutateAsync(itemToRestore);
          await refetch();
        },
        part.name
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
      await exportMutation.mutateAsync(rawParts);
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
        onCreateItem={handleCreatePart}
        searchQuery={search}
        onSearchChange={setSearch}
        onRefresh={handleRefresh}
        onExport={handleExportData}
        onFilterChange={handleFilterChange}
        statusFilter={statusFilter}
        locationFilter={locationFilter}
        locations={locations}
        totalItems={totalParts}
        lowStockCount={lowStockParts}
        isLoading={isLoading}
        isExporting={exportMutation.isPending}
      />
      
      <div className="p-6">
        <InventoryStats
          totalItems={totalParts}
          lowStockItems={lowStockParts}
          totalValue={totalValue}
          categories={categories}
        />
        
        <DataLoadingManager
          isLoading={isLoading}
          error={error}
          onRetry={refetch}
          loadingText="Loading parts..."
          errorText="Failed to load parts inventory"
        >
          <InventoryGrid
            items={parts}
            onViewItem={(part) => navigate(`/dashboard/inventory/${part.id}`)}
            onDeleteItem={(part) => handleDeletePart(rawParts.find(i => i.id === part.id) as InventoryItemWithStats)}
          />
        </DataLoadingManager>
      </div>

      {selectedPart && (
        <InventoryDetailCard
          item={{
            id: selectedPart.id,
            name: selectedPart.name,
            sku: selectedPart.sku,
            description: selectedPart.description,
            quantity: selectedPart.quantity,
            minQuantity: selectedPart.min_quantity,
            unitCost: selectedPart.unit_cost,
            totalValue: selectedPart.total_value,
            location: selectedPart.location,
            category: selectedPart.location || 'General',
            status: selectedPart.is_low_stock ? 'low_stock' : selectedPart.quantity === 0 ? 'out_of_stock' : 'in_stock',
            supplier: 'N/A',
            partNumber: 'N/A',
            lastOrdered: 'N/A',
            leadTime: 'N/A',
            reorderPoint: selectedPart.min_quantity,
            maxStock: selectedPart.min_quantity * 3,
            transactions: []
          }}
          onClose={() => setSelectedPart(null)}
        />
      )}
    </div>
  );
};
