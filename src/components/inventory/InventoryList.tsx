
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Package, MapPin, DollarSign, AlertTriangle } from "lucide-react";

interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  description: string;
  category: string;
  quantity: number;
  minQuantity: number;
  unitCost: number;
  totalValue: number;
  location: string;
  status: string;
}

interface InventoryListProps {
  items: InventoryItem[];
  selectedItemId: string | null;
  onSelectItem: (id: string) => void;
}

export const InventoryList = ({ items, selectedItemId, onSelectItem }: InventoryListProps) => {
  const getStatusColor = (status: string, quantity: number, minQuantity: number) => {
    if (status === 'Out of Stock' || quantity === 0) {
      return 'bg-red-100 text-red-800 border-red-200';
    } else if (status === 'Low Stock' || quantity <= minQuantity) {
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    } else if (status === 'On Order') {
      return 'bg-blue-100 text-blue-800 border-blue-200';
    } else {
      return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'filters':
        return '🔧';
      case 'safety equipment':
        return '🛡️';
      case 'electrical':
        return '⚡';
      case 'mechanical':
        return '⚙️';
      case 'consumables':
        return '📦';
      default:
        return '📋';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const lowStockItems = items.filter(item => item.quantity <= item.minQuantity);
  const normalStockItems = items.filter(item => item.quantity > item.minQuantity);

  return (
    <div className="w-full md:w-80 lg:w-96 xl:w-[28rem] bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Inventory ({items.length})
          </h3>
          <div className="flex items-center space-x-2 text-xs text-gray-600">
            <span>Sort: Name A-Z</span>
            <button className="text-gray-400 hover:text-gray-600">↻</button>
          </div>
        </div>
        
        {lowStockItems.length > 0 && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2 text-yellow-800">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm font-medium">{lowStockItems.length} items need attention</span>
            </div>
          </div>
        )}
      </div>
      
      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        {/* Low Stock Items */}
        {lowStockItems.length > 0 && (
          <div className="p-4">
            <h4 className="text-sm font-medium text-red-700 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Low Stock ({lowStockItems.length})
            </h4>
            <div className="space-y-3">
              {lowStockItems.map((item) => (
                <div
                  key={item.id}
                  className={cn(
                    "p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md bg-red-50 border-red-200",
                    selectedItemId === item.id && "border-red-400 shadow-sm"
                  )}
                  onClick={() => onSelectItem(item.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-red-50 to-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-lg">{getCategoryIcon(item.category)}</span>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900 leading-tight line-clamp-2">
                            {item.name}
                          </h4>
                          <span className="text-xs text-gray-600">SKU: {item.sku}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2 mb-3">
                        <Badge className={cn("text-xs w-fit border", getStatusColor(item.status, item.quantity, item.minQuantity))}>
                          {item.status}
                        </Badge>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <MapPin className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">{item.location}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500">Quantity:</span>
                          <span className="font-medium text-red-700">{item.quantity} / {item.minQuantity} min</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500">Value:</span>
                          <span className="font-medium">{formatCurrency(item.totalValue)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Normal Stock Items */}
        <div className="p-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <Package className="w-4 h-4" />
            In Stock ({normalStockItems.length})
          </h4>
          <div className="space-y-3">
            {normalStockItems.map((item) => (
              <div
                key={item.id}
                className={cn(
                  "p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md",
                  selectedItemId === item.id 
                    ? "bg-blue-50 border-blue-300 shadow-sm" 
                    : "bg-white border-gray-200 hover:border-gray-300"
                )}
                onClick={() => onSelectItem(item.id)}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">{getCategoryIcon(item.category)}</span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 leading-tight line-clamp-2">
                          {item.name}
                        </h4>
                        <span className="text-xs text-gray-600">SKU: {item.sku}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2 mb-3">
                      <Badge className={cn("text-xs w-fit border", getStatusColor(item.status, item.quantity, item.minQuantity))}>
                        {item.status}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <MapPin className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{item.location}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Quantity:</span>
                        <span className="font-medium">{item.quantity}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Value:</span>
                        <span className="font-medium">{formatCurrency(item.totalValue)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
