
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { InventoryHeader } from "@/components/inventory/InventoryHeader";
import { InventoryList } from "@/components/inventory/InventoryList";
import { InventoryDetailCard } from "@/components/inventory/InventoryDetailCard";
import { InventoryForm } from "@/components/inventory/InventoryForm";
import { InventoryDashboard } from "@/components/inventory/InventoryDashboard";
import { useState } from "react";
import { ChevronLeft, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Inventory() {
  const [selectedItem, setSelectedItem] = useState<string | null>('item-001');
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [viewMode, setViewMode] = useState<'dashboard' | 'list'>('dashboard');

  const sampleInventory = [
    {
      id: 'item-001',
      name: 'Hydraulic Oil Filter',
      sku: 'HYD-FLT-001',
      description: 'High-performance hydraulic oil filter for industrial equipment',
      category: 'Filters',
      quantity: 25,
      minQuantity: 10,
      unitCost: 45.99,
      totalValue: 1149.75,
      location: 'Warehouse A - Section 2',
      supplier: 'Industrial Parts Co.',
      partNumber: 'IPF-H001',
      lastOrdered: '2023-09-15',
      leadTime: '7-10 days',
      status: 'In Stock',
      reorderPoint: 10,
      maxStock: 50,
      transactions: [
        { date: '2023-10-01', type: 'Usage', quantity: -2, reason: 'Work Order #5969' },
        { date: '2023-09-15', type: 'Receipt', quantity: 20, reason: 'Purchase Order #PO-2023-045' }
      ]
    },
    {
      id: 'item-002',
      name: 'Safety Gloves - Cut Resistant',
      sku: 'SAF-GLV-002',
      description: 'Level 5 cut-resistant safety gloves for maintenance work',
      category: 'Safety Equipment',
      quantity: 8,
      minQuantity: 15,
      unitCost: 12.50,
      totalValue: 100.00,
      location: 'Safety Storage Room',
      supplier: 'Safety Solutions Inc.',
      partNumber: 'SS-CR5-L',
      lastOrdered: '2023-08-20',
      leadTime: '3-5 days',
      status: 'Low Stock',
      reorderPoint: 15,
      maxStock: 100,
      transactions: [
        { date: '2023-09-28', type: 'Usage', quantity: -12, reason: 'Monthly safety equipment distribution' }
      ]
    }
  ];

  const selectedItemData = sampleInventory.find(item => item.id === selectedItem) || sampleInventory[0];
  const lowStockCount = sampleInventory.filter(item => item.quantity <= item.minQuantity).length;

  const handleCreateItem = () => {
    setShowCreateForm(true);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <DashboardLayout>
      <div className="h-full flex flex-col bg-gray-50">
        {/* Enhanced Header */}
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="px-6 py-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl">
                    <Package className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
                    <p className="text-gray-600 mt-1">
                      Manage your inventory items, track stock levels, and monitor usage
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'dashboard' | 'list')}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                    <TabsTrigger value="list">List View</TabsTrigger>
                  </TabsList>
                </Tabs>
                
                <Button onClick={handleCreateItem} className="bg-blue-600 hover:bg-blue-700 shadow-sm">
                  <Package className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="border-0 shadow-sm bg-gradient-to-r from-blue-50 to-blue-100">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-600">Total Items</p>
                      <p className="text-2xl font-bold text-blue-900">{sampleInventory.length}</p>
                    </div>
                    <Package className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm bg-gradient-to-r from-orange-50 to-orange-100">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-orange-600">Low Stock</p>
                      <p className="text-2xl font-bold text-orange-900">{lowStockCount}</p>
                    </div>
                    <ChevronLeft className="h-8 w-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm bg-gradient-to-r from-green-50 to-green-100">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-600">Total Value</p>
                      <p className="text-2xl font-bold text-green-900">
                        ${sampleInventory.reduce((sum, item) => sum + item.totalValue, 0).toFixed(2)}
                      </p>
                    </div>
                    <Package className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm bg-gradient-to-r from-purple-50 to-purple-100">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-600">Categories</p>
                      <p className="text-2xl font-bold text-purple-900">
                        {new Set(sampleInventory.map(item => item.category)).size}
                      </p>
                    </div>
                    <Package className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        
        <div className="flex-1 overflow-hidden">
          {viewMode === 'dashboard' ? (
            <div className="p-6">
              <InventoryDashboard />
            </div>
          ) : (
            <div className="flex h-full">
              {/* Desktop Layout */}
              <div className="hidden md:flex w-full">
                {/* Enhanced Sidebar */}
                <div className="w-1/3 bg-white border-r border-gray-200 shadow-sm">
                  <InventoryHeader 
                    onCreateItem={handleCreateItem}
                    searchQuery={searchQuery}
                    onSearchChange={handleSearchChange}
                    totalItems={sampleInventory.length}
                    lowStockCount={lowStockCount}
                    items={sampleInventory.map(item => ({
                      id: item.id,
                      tenant_id: '',
                      name: item.name,
                      description: item.description,
                      sku: item.sku,
                      location: item.location,
                      quantity: item.quantity,
                      min_quantity: item.minQuantity,
                      unit_cost: item.unitCost,
                      created_at: '',
                      updated_at: '',
                      is_low_stock: item.quantity <= item.minQuantity,
                      needs_reorder: item.quantity <= item.minQuantity * 1.5,
                      total_value: item.totalValue
                    }))}
                  />
                  <InventoryList 
                    items={sampleInventory}
                    selectedItemId={selectedItem}
                    onSelectItem={setSelectedItem}
                  />
                </div>
                
                {/* Enhanced Detail view */}
                <div className="flex-1 bg-gray-50 overflow-y-auto">
                  <div className="p-6">
                    <InventoryDetailCard item={selectedItemData} />
                  </div>
                </div>
              </div>
              
              {/* Mobile Layout */}
              <div className="md:hidden w-full flex flex-col">
                {!selectedItem ? (
                  <div className="bg-white">
                    <InventoryHeader 
                      onCreateItem={handleCreateItem}
                      searchQuery={searchQuery}
                      onSearchChange={handleSearchChange}
                      totalItems={sampleInventory.length}
                      lowStockCount={lowStockCount}
                      items={sampleInventory.map(item => ({
                        id: item.id,
                        tenant_id: '',
                        name: item.name,
                        description: item.description,
                        sku: item.sku,
                        location: item.location,
                        quantity: item.quantity,
                        min_quantity: item.minQuantity,
                        unit_cost: item.unitCost,
                        created_at: '',
                        updated_at: '',
                        is_low_stock: item.quantity <= item.minQuantity,
                        needs_reorder: item.quantity <= item.minQuantity * 1.5,
                        total_value: item.totalValue
                      }))}
                    />
                    <InventoryList 
                      items={sampleInventory}
                      selectedItemId={selectedItem}
                      onSelectItem={setSelectedItem}
                    />
                  </div>
                ) : (
                  <>
                    {/* Mobile header with back button */}
                    <div className="p-4 border-b bg-white flex items-center gap-3 shadow-sm">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setSelectedItem(null)}
                        className="p-2 h-auto hover:bg-gray-100"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </Button>
                      <div className="flex-1 min-w-0">
                        <h2 className="font-semibold text-gray-900 truncate">
                          {selectedItemData.name}
                        </h2>
                        <p className="text-sm text-gray-500 truncate">
                          SKU: {selectedItemData.sku}
                        </p>
                      </div>
                    </div>
                    
                    {/* Mobile detail view */}
                    <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                      <InventoryDetailCard item={selectedItemData} />
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Create Item Form Modal */}
        {showCreateForm && (
          <InventoryForm
            mode="create"
            onSuccess={() => setShowCreateForm(false)}
            trigger={null}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
