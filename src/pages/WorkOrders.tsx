
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { useWorkOrdersIntegration } from "@/hooks/useWorkOrdersIntegration";
import { EnhancedWorkOrdersList } from "@/components/work-orders/EnhancedWorkOrdersList";
import { EnhancedWorkOrderDetail } from "@/components/work-orders/EnhancedWorkOrderDetail";
import { EnhancedWorkOrderForm } from "@/components/work-orders/EnhancedWorkOrderForm";
import { WorkOrdersStatsOverview } from "@/components/work-orders/WorkOrdersStatsOverview";
import { WorkOrdersQuickActions } from "@/components/work-orders/WorkOrdersQuickActions";
import { useState, useEffect } from "react";
import { ChevronLeft, Plus, LayoutGrid, List, Filter, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { WorkOrder } from "@/types/workOrder";
import { transformWorkOrderData } from "@/services/workOrderService";
import { getAssetName } from "@/utils/assetUtils";
import { cn } from "@/lib/utils";

// Sample data for demonstration
const sampleWorkOrders: WorkOrder[] = [
  {
    id: '5969',
    title: 'Wrapper Malfunction - Items Stuck on Belt',
    status: 'in_progress',
    due_date: '2023-10-05T08:43:00Z',
    priority: 'high',
    assignedTo: ['Zach Brown'],
    description: 'The cutter is not fully cutting, and packages are either tearing away from the cutting assembly, or tipping over and causing stoppage.',
    asset: {
      id: 'wrapper-001',
      name: 'Wrapper - Orion Model A',
      status: 'active',
    },
    location: 'Production Line 3',
    category: 'equipment',
    time_spent: 2.5,
    total_cost: 145.50,
    parts_used: [
      { name: 'Cutting Blade', quantity: 1, cost: 25.00 },
      { name: 'Belt Assembly', quantity: 1, cost: 120.50 }
    ],
    created_at: '2023-10-05T08:00:00Z',
    updated_at: '2023-10-05T10:30:00Z',
    tenant_id: 'sample-tenant-id',
    tags: ['urgent', 'production']
  },
  {
    id: '5962',
    title: '[Safety] OSHA Compliance - Daily Site Walk',
    status: 'on_hold',
    due_date: '2023-10-04T10:00:00Z',
    priority: 'medium',
    assignedTo: ['Safety Team'],
    description: 'Daily safety inspection and compliance check.',
    asset: {
      id: 'facility-001',
      name: 'Facility',
      status: 'active',
    },
    location: 'Entire Facility',
    category: 'safety',
    created_at: '2023-10-04T08:00:00Z',
    updated_at: '2023-10-04T09:00:00Z',
    tenant_id: 'sample-tenant-id',
    tags: ['safety', 'compliance']
  },
  {
    id: '5960',
    title: '[Inspection] Wrapper Cleaning',
    status: 'completed',
    due_date: '2023-10-06T14:00:00Z',
    priority: 'low',
    assignedTo: ['Maintenance Team 1'],
    description: 'Regular cleaning and maintenance of wrapper equipment.',
    asset: {
      id: 'wrapper-001',
      name: 'Wrapper - Orion Model A',
      status: 'active',
    },
    location: 'Production Line 3',
    category: 'maintenance',
    created_at: '2023-10-06T08:00:00Z',
    updated_at: '2023-10-06T10:00:00Z',
    tenant_id: 'sample-tenant-id',
    tags: ['maintenance', 'scheduled']
  }
];

type ViewMode = 'list' | 'detail' | 'form';
type LayoutMode = 'split' | 'grid' | 'full';

export default function WorkOrders() {
  const { data: workOrders, isLoading } = useWorkOrdersIntegration();
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('detail');
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('split');
  const [editingWorkOrder, setEditingWorkOrder] = useState<WorkOrder | null>(null);
  const [globalSearch, setGlobalSearch] = useState('');
  const [quickFilter, setQuickFilter] = useState<string>('all');

  // Transform and use real data if available, otherwise use sample data
  const transformedWorkOrders: WorkOrder[] = workOrders?.length > 0 
    ? workOrders.map(transformWorkOrderData)
    : sampleWorkOrders;

  // Auto-select first work order when data loads
  useEffect(() => {
    if (transformedWorkOrders.length > 0 && !selectedWorkOrder) {
      setSelectedWorkOrder(transformedWorkOrders[0].id);
      setViewMode('detail');
    }
  }, [transformedWorkOrders, selectedWorkOrder]);

  const selectedWorkOrderData = transformedWorkOrders.find(wo => wo.id === selectedWorkOrder);

  const handleCreateWorkOrder = () => {
    setEditingWorkOrder(null);
    setViewMode('form');
  };

  const handleEditWorkOrder = () => {
    if (selectedWorkOrderData) {
      setEditingWorkOrder(selectedWorkOrderData);
      setViewMode('form');
    }
  };

  const handleSelectWorkOrder = (id: string) => {
    setSelectedWorkOrder(id);
    setViewMode('detail');
  };

  const handleFormSubmit = (data: any) => {
    console.log('Form submitted:', data);
    setViewMode(selectedWorkOrder ? 'detail' : 'list');
  };

  const handleFormCancel = () => {
    setViewMode(selectedWorkOrder ? 'detail' : 'list');
    setEditingWorkOrder(null);
  };

  // Filter work orders based on search and quick filter
  const filteredWorkOrders = transformedWorkOrders.filter(wo => {
    const matchesSearch = globalSearch === '' || 
      wo.title.toLowerCase().includes(globalSearch.toLowerCase()) ||
      wo.description.toLowerCase().includes(globalSearch.toLowerCase());
    
    const matchesQuickFilter = quickFilter === 'all' || 
      wo.status === quickFilter ||
      wo.priority === quickFilter;
    
    return matchesSearch && matchesQuickFilter;
  });

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center space-y-3">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-gray-600 text-sm">Loading work orders...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="h-full flex flex-col bg-gray-50">
        {/* Clean Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Work Orders</h1>
              <p className="text-gray-600 text-sm mt-1">
                Manage and track maintenance operations
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                <Button
                  variant={layoutMode === 'split' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setLayoutMode('split')}
                  className="h-8 px-3"
                >
                  <List className="w-4 h-4" />
                </Button>
                <Button
                  variant={layoutMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setLayoutMode('grid')}
                  className="h-8 px-3"
                >
                  <LayoutGrid className="w-4 h-4" />
                </Button>
              </div>
              
              <Button onClick={handleCreateWorkOrder} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                New Work Order
              </Button>
            </div>
          </div>

          {/* Simple Search and Filters */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search work orders..."
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex items-center gap-2">
              {['all', 'open', 'in_progress', 'high', 'urgent'].map((filter) => (
                <Badge
                  key={filter}
                  variant={quickFilter === filter ? 'default' : 'outline'}
                  className={cn(
                    "cursor-pointer transition-colors",
                    quickFilter === filter && "bg-blue-600 hover:bg-blue-700"
                  )}
                  onClick={() => setQuickFilter(filter)}
                >
                  {filter.replace('_', ' ')}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="px-6 py-4 bg-white border-b border-gray-200">
          <WorkOrdersStatsOverview workOrders={filteredWorkOrders} />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 px-6 py-6 overflow-hidden">
          {layoutMode === 'split' && (
            <div className="h-full flex gap-6">
              {/* Left Panel - Work Orders List */}
              <div className="w-[380px] bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                <EnhancedWorkOrdersList 
                  workOrders={filteredWorkOrders}
                  selectedWorkOrderId={selectedWorkOrder}
                  onSelectWorkOrder={handleSelectWorkOrder}
                  onCreateWorkOrder={handleCreateWorkOrder}
                />
              </div>
              
              {/* Right Panel - Detail/Form */}
              <div className="flex-1 bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                {viewMode === 'detail' && selectedWorkOrderData && (
                  <EnhancedWorkOrderDetail 
                    workOrder={selectedWorkOrderData}
                    onEdit={handleEditWorkOrder}
                  />
                )}
                
                {viewMode === 'form' && (
                  <div className="h-full overflow-auto">
                    <div className="p-6">
                      <div className="mb-6">
                        <Button 
                          variant="ghost" 
                          onClick={handleFormCancel}
                          className="mb-4"
                        >
                          <ChevronLeft className="w-4 h-4 mr-2" />
                          Back
                        </Button>
                      </div>
                      <EnhancedWorkOrderForm
                        workOrder={editingWorkOrder || undefined}
                        onSubmit={handleFormSubmit}
                        onCancel={handleFormCancel}
                      />
                    </div>
                  </div>
                )}
                
                {/* Empty State */}
                {!selectedWorkOrderData && viewMode !== 'form' && filteredWorkOrders.length === 0 && (
                  <div className="flex-1 flex items-center justify-center p-8">
                    <div className="text-center space-y-4 max-w-sm">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                        <span className="text-2xl">🔧</span>
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-lg font-medium text-gray-900">No Work Orders Found</h3>
                        <p className="text-gray-600 text-sm">
                          No work orders match your current search criteria.
                        </p>
                      </div>
                      <WorkOrdersQuickActions onCreateWorkOrder={handleCreateWorkOrder} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {layoutMode === 'grid' && (
            <div className="h-full bg-white border border-gray-200 rounded-lg shadow-sm p-6 overflow-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredWorkOrders.map((workOrder) => (
                  <div
                    key={workOrder.id}
                    className={cn(
                      "p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md",
                      selectedWorkOrder === workOrder.id 
                        ? "bg-blue-50 border-blue-200 shadow-sm" 
                        : "bg-white border-gray-200 hover:border-gray-300"
                    )}
                    onClick={() => handleSelectWorkOrder(workOrder.id)}
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <h4 className="font-medium text-gray-900 line-clamp-2 text-sm">
                          {workOrder.title}
                        </h4>
                        <Badge className={cn(
                          "text-xs ml-2 flex-shrink-0",
                          workOrder.priority === 'high' ? 'bg-red-100 text-red-700' :
                          workOrder.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        )}>
                          {workOrder.priority}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2 text-xs text-gray-600">
                        <div>#{workOrder.id.slice(-4)} • {getAssetName(workOrder.asset)}</div>
                        <div className="flex items-center justify-between">
                          <span className="capitalize">{workOrder.status.replace('_', ' ')}</span>
                          <span>{workOrder.assignedTo.length} assigned</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
