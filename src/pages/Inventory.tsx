
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { InventoryHeader } from "@/components/inventory/InventoryHeader";
import { InventoryList } from "@/components/inventory/InventoryList";
import { InventoryDetailCard } from "@/components/inventory/InventoryDetailCard";
import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Inventory() {
  const [selectedItem, setSelectedItem] = useState<string | null>('item-001');

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

  return (
    <DashboardLayout>
      <div className="h-full flex flex-col bg-gray-50">
        <InventoryHeader />
        
        <div className="flex-1 flex overflow-hidden">
          {/* Desktop Layout */}
          <div className="hidden md:flex w-full">
            {/* Sidebar */}
            <InventoryList 
              items={sampleInventory}
              selectedItemId={selectedItem}
              onSelectItem={setSelectedItem}
            />
            
            {/* Detail view */}
            <div className="flex-1 bg-white overflow-y-auto">
              <div className="p-4 lg:p-6">
                <InventoryDetailCard item={selectedItemData} />
              </div>
            </div>
          </div>
          
          {/* Mobile Layout */}
          <div className="md:hidden w-full flex flex-col">
            {!selectedItem ? (
              <InventoryList 
                items={sampleInventory}
                selectedItemId={selectedItem}
                onSelectItem={setSelectedItem}
              />
            ) : (
              <>
                {/* Mobile header with back button */}
                <div className="p-3 border-b bg-white flex items-center gap-3">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setSelectedItem(null)}
                    className="p-1 h-auto"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </Button>
                  <span className="font-medium text-gray-900 truncate">
                    {selectedItemData.name}
                  </span>
                </div>
                
                {/* Mobile detail view */}
                <div className="flex-1 p-3 overflow-y-auto bg-white">
                  <InventoryDetailCard item={selectedItemData} />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
