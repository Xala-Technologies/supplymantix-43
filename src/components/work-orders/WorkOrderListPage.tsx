
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Plus, AlertCircle, RefreshCw } from "lucide-react";
import { WorkOrderCard } from "./WorkOrderCard";
import { WorkOrderFilterBar } from "./WorkOrderFilterBar";
import { WorkOrderListSkeleton } from "./WorkOrderListSkeleton";
import { WorkOrderPagination } from "./WorkOrderPagination";
import { WorkOrderFilters } from "@/types/workOrder";
import { useWorkOrders } from "@/hooks/useWorkOrders";

interface WorkOrderListPageProps {
  onCreateWorkOrder: () => void;
  onSelectWorkOrder: (id: string) => void;
  selectedWorkOrderId?: string;
}

export const WorkOrderListPage = ({
  onCreateWorkOrder,
  onSelectWorkOrder,
  selectedWorkOrderId
}: WorkOrderListPageProps) => {
  const [filters, setFilters] = useState<WorkOrderFilters>({
    search: '',
    status: 'all',
    priority: 'all',
    assignedTo: 'all',
    category: 'all'
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);

  const { data: workOrders, isLoading, error, refetch } = useWorkOrders();

  // Filter work orders based on current filters
  const filteredWorkOrders = workOrders?.filter(wo => {
    if (filters.search && !wo.title.toLowerCase().includes(filters.search.toLowerCase()) && 
        !wo.description?.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    if (filters.status !== 'all' && wo.status !== filters.status) return false;
    if (filters.priority !== 'all' && wo.priority !== filters.priority) return false;
    if (filters.category !== 'all' && wo.category !== filters.category) return false;
    if (filters.assignedTo === 'unassigned' && wo.assignedTo && wo.assignedTo.length > 0) return false;
    return true;
  }) || [];

  // Pagination
  const totalItems = filteredWorkOrders.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedWorkOrders = filteredWorkOrders.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const handleFiltersChange = (newFilters: WorkOrderFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleRefresh = () => {
    refetch();
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Work Orders</h1>
            <p className="text-gray-600 mt-1">
              Manage and track your maintenance work orders
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            
            <Button onClick={onCreateWorkOrder} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              New Work Order
            </Button>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <WorkOrderFilterBar
        filters={filters}
        onFiltersChange={handleFiltersChange}
        totalCount={workOrders?.length || 0}
        filteredCount={filteredWorkOrders.length}
      />

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto p-6">
          {/* Error State */}
          {error && (
            <Alert className="mb-6 border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                Failed to load work orders. Please try refreshing the page.
              </AlertDescription>
            </Alert>
          )}

          {/* Loading State */}
          {isLoading && (
            <WorkOrderListSkeleton count={itemsPerPage} />
          )}

          {/* Empty State */}
          {!isLoading && !error && filteredWorkOrders.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {workOrders?.length === 0 ? "No work orders yet" : "No work orders match your filters"}
              </h3>
              <p className="text-gray-500 mb-6">
                {workOrders?.length === 0 
                  ? "Get started by creating your first work order."
                  : "Try adjusting your search or filter criteria."
                }
              </p>
              {workOrders?.length === 0 && (
                <Button onClick={onCreateWorkOrder} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Work Order
                </Button>
              )}
            </div>
          )}

          {/* Work Orders List */}
          {!isLoading && !error && paginatedWorkOrders.length > 0 && (
            <div className="space-y-4">
              {paginatedWorkOrders.map((workOrder) => (
                <WorkOrderCard
                  key={workOrder.id}
                  workOrder={workOrder}
                  onSelect={onSelectWorkOrder}
                  isSelected={selectedWorkOrderId === workOrder.id}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {!isLoading && !error && totalPages > 1 && (
            <div className="mt-6">
              <WorkOrderPagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
                onItemsPerPageChange={handleItemsPerPageChange}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
