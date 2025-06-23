
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
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-muted-foreground text-sm">Loading work orders...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
        {/* Enhanced Header */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200/60 px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Work Orders
              </h1>
              <p className="text-slate-600 text-sm mt-1">
                Manage and track maintenance operations across your facility
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
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
              
              <Button onClick={handleCreateWorkOrder} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg">
                <Plus className="w-4 h-4 mr-2" />
                New Work Order
              </Button>
            </div>
          </div>

          {/* Global Search and Quick Filters */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Search work orders..."
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                className="pl-10 bg-white/70 border-slate-200 focus:bg-white"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600">Quick filter:</span>
              {['all', 'open', 'in_progress', 'high', 'urgent'].map((filter) => (
                <Badge
                  key={filter}
                  variant={quickFilter === filter ? 'default' : 'outline'}
                  className={cn(
                    "cursor-pointer transition-all hover:scale-105",
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
        <div className="px-6 py-4">
          <WorkOrdersStatsOverview workOrders={filteredWorkOrders} />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 px-6 pb-6 overflow-hidden">
          {layoutMode === 'split' && (
            <div className="h-full flex gap-6">
              {/* Enhanced Left Panel - Work Orders List */}
              <div className="w-[380px] bg-white/70 backdrop-blur-sm border border-slate-200/60 rounded-2xl shadow-xl overflow-hidden">
                <EnhancedWorkOrdersList 
                  workOrders={filteredWorkOrders}
                  selectedWorkOrderId={selectedWorkOrder}
                  onSelectWorkOrder={handleSelectWorkOrder}
                  onCreateWorkOrder={handleCreateWorkOrder}
                />
              </div>
              
              {/* Enhanced Right Panel - Detail/Form */}
              <div className="flex-1 bg-white/70 backdrop-blur-sm border border-slate-200/60 rounded-2xl shadow-xl overflow-hidden">
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
                          className="mb-4 hover:bg-slate-100"
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
                
                {/* Enhanced Empty State */}
                {!selectedWorkOrderData && viewMode !== 'form' && filteredWorkOrders.length === 0 && (
                  <div className="flex-1 flex items-center justify-center p-8">
                    <div className="text-center space-y-6 max-w-md">
                      <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-3xl flex items-center justify-center mx-auto">
                        <span className="text-4xl">🔧</span>
                      </div>
                      <div className="space-y-3">
                        <h3 className="text-xl font-semibold text-slate-800">No Work Orders Found</h3>
                        <p className="text-slate-600 leading-relaxed">
                          No work orders match your current search and filter criteria. Try adjusting your filters or create a new work order.
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
            <div className="h-full bg-white/70 backdrop-blur-sm border border-slate-200/60 rounded-2xl shadow-xl p-6 overflow-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredWorkOrders.map((workOrder) => (
                  <div
                    key={workOrder.id}
                    className={cn(
                      "p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02]",
                      selectedWorkOrder === workOrder.id 
                        ? "bg-blue-50 border-blue-200 shadow-md" 
                        : "bg-white border-slate-200 hover:border-slate-300"
                    )}
                    onClick={() => handleSelectWorkOrder(workOrder.id)}
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <h4 className="font-semibold text-slate-800 line-clamp-2 text-sm">
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
                      
                      <div className="space-y-2 text-xs text-slate-600">
                        <div>#{workOrder.id.slice(-4)} • {getAssetName(workOrder.asset)}</div>
                        <div className="flex items-center justify-between">
                          <span>{workOrder.status.replace('_', ' ')}</span>
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
