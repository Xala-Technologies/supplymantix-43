
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { InventoryStatusBadge } from "./InventoryStatusBadge";
import { StockMovementModal } from "./StockMovementModal";
import { InventoryForm } from "./InventoryForm";
import { InventoryHeader } from "./InventoryHeader";
import { useInventoryEnhanced, useLowStockAlerts, useDeleteInventoryItem } from "@/hooks/useInventoryEnhanced";
import { useLocations } from "@/hooks/useLocations";
import { 
  AlertTriangle, 
  Package, 
  DollarSign,
  Edit,
  Trash2,
  RefreshCw
} from "lucide-react";
import type { InventoryItemWithStats } from "@/lib/database/inventory-enhanced";

export const InventoryDashboard = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [locationFilter, setLocationFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  console.log('InventoryDashboard: Current filters:', { search, statusFilter, locationFilter, sortBy, sortOrder });

  const { data: inventoryData, isLoading, refetch, error } = useInventoryEnhanced({
    search: search || undefined,
    status: statusFilter === "all" ? undefined : statusFilter as any,
    location: locationFilter === "all" ? undefined : locationFilter,
    sortBy: sortBy as any,
    sortOrder,
    limit: itemsPerPage,
    offset: (currentPage - 1) * itemsPerPage
  });

  const { data: lowStockAlerts } = useLowStockAlerts();
  const { data: locations } = useLocations();
  const deleteItemMutation = useDeleteInventoryItem();

  console.log('InventoryDashboard: Inventory data received:', inventoryData);
  console.log('InventoryDashboard: Is loading:', isLoading);
  console.log('InventoryDashboard: Error:', error);

  const handleDelete = (item: InventoryItemWithStats) => {
    console.log('Delete button clicked for item:', item.id);
    if (window.confirm(`Are you sure you want to delete "${item.name}"?`)) {
      deleteItemMutation.mutate(item.id);
    }
  };

  const handleRefresh = () => {
    console.log('Manual refresh triggered');
    refetch();
  };

  // Calculate dashboard metrics
  const totalItems = inventoryData?.total || 0;
  const lowStockItems = lowStockAlerts?.length || 0;
  const totalValue = inventoryData?.items.reduce((sum, item) => sum + item.total_value, 0) || 0;
  const outOfStockItems = inventoryData?.items.filter(item => item.quantity === 0).length || 0;

  const columns = [
    {
      accessorKey: "name",
      header: "Item Name",
      cell: ({ row }: { row: any }) => (
        <div className="flex flex-col">
          <span className="font-medium">{row.original.name}</span>
          {row.original.sku && (
            <span className="text-sm text-gray-500">SKU: {row.original.sku}</span>
          )}
        </div>
      ),
    },
    {
      accessorKey: "quantity",
      header: "Quantity",
      cell: ({ row }: { row: any }) => (
        <div className="text-center">
          <div className="font-medium">{row.original.quantity || 0}</div>
          {row.original.min_quantity && (
            <div className="text-xs text-gray-500">
              Min: {row.original.min_quantity}
            </div>
          )}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: { row: any }) => (
        <InventoryStatusBadge
          quantity={row.original.quantity || 0}
          minQuantity={row.original.min_quantity}
        />
      ),
    },
    {
      accessorKey: "location",
      header: "Location",
      cell: ({ row }: { row: any }) => (
        <span className="text-sm">{row.original.location || 'Not assigned'}</span>
      ),
    },
    {
      accessorKey: "unit_cost",
      header: "Unit Cost",
      cell: ({ row }: { row: any }) => (
        <span className="font-mono">${(row.original.unit_cost || 0).toFixed(2)}</span>
      ),
    },
    {
      accessorKey: "total_value",
      header: "Total Value",
      cell: ({ row }: { row: any }) => (
        <span className="font-mono font-medium">${row.original.total_value.toFixed(2)}</span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: { row: any }) => (
        <div className="flex items-center gap-2">
          <InventoryForm
            item={row.original}
            mode="edit"
            onSuccess={() => {
              console.log('Item edited, refreshing data...');
              refetch();
            }}
            trigger={
              <Button variant="outline" size="sm">
                <Edit className="w-4 h-4" />
              </Button>
            }
          />
          <StockMovementModal
            item={row.original}
            onSuccess={() => {
              console.log('Stock movement completed, refreshing data...');
              refetch();
            }}
            trigger={
              <Button variant="outline" size="sm">
                Stock
              </Button>
            }
          />
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleDelete(row.original)}
            disabled={deleteItemMutation.isPending}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  if (error) {
    console.error('InventoryDashboard: Error loading inventory:', error);
  }

  return (
    <div className="space-y-6">
      {/* Header Component */}
      <InventoryHeader
        onSearchChange={setSearch}
        onStatusFilterChange={setStatusFilter}
        onLocationFilterChange={setLocationFilter}
        onRefresh={handleRefresh}
        searchValue={search}
        statusFilter={statusFilter}
        locationFilter={locationFilter}
        locations={locations}
      />

      {/* Dashboard Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItems}</div>
            <p className="text-xs text-muted-foreground">
              {inventoryData?.items.length || 0} displayed
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{lowStockItems}</div>
            <p className="text-xs text-muted-foreground">
              Items need reordering
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Inventory worth
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{outOfStockItems}</div>
            <p className="text-xs text-muted-foreground">
              Items unavailable
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mx-6">
          <div className="flex items-center gap-2 text-red-800 mb-2">
            <AlertTriangle className="w-5 h-5" />
            <span className="font-medium">Error Loading Inventory</span>
          </div>
          <p className="text-red-700 text-sm mb-3">
            There was an error loading your inventory data: {error.message}
          </p>
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-8 mx-6">
          <div className="flex items-center gap-2 text-gray-600">
            <RefreshCw className="w-5 h-5 animate-spin" />
            <span>Loading inventory...</span>
          </div>
        </div>
      )}

      {/* Low Stock Alerts */}
      {lowStockItems > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mx-6">
          <div className="flex items-center gap-2 text-red-800 mb-2">
            <AlertTriangle className="w-5 h-5" />
            <span className="font-medium">Low Stock Alert</span>
          </div>
          <p className="text-red-700 text-sm">
            You have {lowStockItems} item(s) that are running low on stock and may need reordering.
          </p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && totalItems === 0 && (
        <div className="text-center py-12 mx-6">
          <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No inventory items found</h3>
          <p className="text-gray-600 mb-4">
            Get started by adding your first inventory item.
          </p>
          <InventoryForm 
            onSuccess={() => {
              console.log('New item created, refreshing data...');
              refetch();
            }}
            trigger={
              <Button>
                <Package className="w-4 h-4 mr-2" />
                Add Your First Item
              </Button>
            }
          />
        </div>
      )}

      {/* Inventory Items */}
      {!isLoading && !error && totalItems > 0 && (
        <Card className="mx-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Inventory Items
              </CardTitle>
              <Button onClick={handleRefresh} variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={columns}
              data={inventoryData?.items || []}
              loading={isLoading}
              pagination={{
                currentPage,
                totalPages: Math.ceil(totalItems / itemsPerPage),
                onPageChange: setCurrentPage,
                itemsPerPage,
                totalItems
              }}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};
