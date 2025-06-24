
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Package, DollarSign, MapPin, Edit, ShoppingCart, AlertTriangle, CheckCircle, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { ReorderDialog } from "./ReorderDialog";
import { useInventoryEnhanced } from "@/hooks/useInventoryEnhanced";

interface InventoryDetailCardProps {
  item: {
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
    supplier: string;
    partNumber: string;
    lastOrdered: string;
    leadTime: string;
    status: string;
    reorderPoint: number;
    maxStock: number;
    transactions: Array<{
      date: string;
      type: string;
      quantity: number;
      reason: string;
    }>;
  };
  onClose?: () => void;
  onEdit?: () => void;
}

export const InventoryDetailCard = ({ item, onClose, onEdit }: InventoryDetailCardProps) => {
  // Get all inventory items for reorder functionality
  const { data: inventoryData } = useInventoryEnhanced();

  // Convert current item to the format expected by ReorderDialog
  const currentItemForReorder = {
    id: item.id,
    name: item.name,
    sku: item.sku,
    quantity: item.quantity,
    min_quantity: item.minQuantity,
    unit_cost: item.unitCost,
    location: item.location,
    tenant_id: '', // This will be handled by the hook
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    description: item.description,
    is_low_stock: item.quantity <= item.minQuantity,
    needs_reorder: item.quantity <= item.minQuantity * 1.5,
    total_value: item.quantity * item.unitCost,
  };

  const getStatusConfig = (status: string, quantity: number, minQuantity: number) => {
    const isLowStock = quantity <= minQuantity;
    if (isLowStock) {
      return {
        color: 'bg-red-50 text-red-700 border-red-200',
        icon: AlertTriangle,
        text: 'Low Stock'
      };
    }
    return {
      color: 'bg-green-50 text-green-700 border-green-200',
      icon: CheckCircle,
      text: 'In Stock'
    };
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const statusConfig = getStatusConfig(item.status, item.quantity, item.minQuantity);
  const needsReorder = item.quantity <= item.minQuantity;
  const stockPercentage = Math.min(100, Math.max(0, (item.quantity / item.maxStock) * 100));

  const content = (
    <div className="space-y-6 max-h-[85vh] overflow-y-auto">
      {/* Modern Header */}
      <div className="flex items-start justify-between pb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-gray-900">{item.name}</h1>
            <Badge className={cn("border", statusConfig.color)}>
              <statusConfig.icon className="w-3 h-3 mr-1" />
              {statusConfig.text}
            </Badge>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
            <span className="font-medium">SKU: {item.sku}</span>
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{item.location}</span>
            </div>
          </div>
          <p className="text-gray-600 text-sm">{item.description}</p>
        </div>
        
        <div className="flex items-center gap-2">
          {onEdit && (
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          )}
          {needsReorder && (
            <ReorderDialog 
              items={[currentItemForReorder]}
              trigger={
                <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Reorder
                </Button>
              }
            />
          )}
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-blue-600 uppercase tracking-wide">Current Stock</p>
                <p className="text-2xl font-bold text-blue-900">{item.quantity}</p>
              </div>
              <Package className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-amber-600 uppercase tracking-wide">Min Level</p>
                <p className="text-2xl font-bold text-amber-900">{item.minQuantity}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-amber-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-green-600 uppercase tracking-wide">Unit Cost</p>
                <p className="text-2xl font-bold text-green-900">{formatCurrency(item.unitCost)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-purple-600 uppercase tracking-wide">Total Value</p>
                <p className="text-2xl font-bold text-purple-900">{formatCurrency(item.totalValue)}</p>
              </div>
              <Package className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stock Level Progress */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Stock Level</h3>
            <span className="text-sm text-gray-600">{item.quantity} / {item.maxStock}</span>
          </div>
          <div className="relative">
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className={cn(
                  "h-3 rounded-full transition-all duration-300",
                  stockPercentage <= 20 ? "bg-red-500" :
                  stockPercentage <= 40 ? "bg-amber-500" : "bg-green-500"
                )}
                style={{ width: `${stockPercentage}%` }}
              />
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-xs text-gray-500">0</span>
              <span className="text-xs text-gray-500">Reorder: {item.reorderPoint}</span>
              <span className="text-xs text-gray-500">Max: {item.maxStock}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Item Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Category</span>
                <span className="font-medium">{item.category}</span>
              </div>
              <Separator />
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Supplier</span>
                <span className="font-medium">{item.supplier}</span>
              </div>
              <Separator />
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Part Number</span>
                <span className="font-medium">{item.partNumber}</span>
              </div>
              <Separator />
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Lead Time</span>
                <span className="font-medium">{item.leadTime}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {item.transactions.slice(0, 4).map((transaction, index) => (
                <div key={index} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      transaction.type === 'Usage' ? 'bg-red-500' : 'bg-green-500'
                    )} />
                    <div>
                      <p className="text-sm font-medium">{transaction.type}</p>
                      <p className="text-xs text-gray-500">{transaction.date}</p>
                    </div>
                  </div>
                  <span className={cn(
                    "text-sm font-medium",
                    transaction.quantity > 0 ? 'text-green-600' : 'text-red-600'
                  )}>
                    {transaction.quantity > 0 ? '+' : ''}{transaction.quantity}
                  </span>
                </div>
              ))}
              {item.transactions.length === 0 && (
                <div className="text-center py-4">
                  <Calendar className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No recent activity</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reorder Alert (if needed) */}
      {needsReorder && (
        <Card className="border-orange-200 bg-gradient-to-r from-orange-50 to-red-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-orange-900">Reorder Required</h4>
                  <p className="text-sm text-orange-700">
                    Stock level is below minimum threshold. Consider reordering {Math.max(0, item.maxStock - item.quantity)} units.
                  </p>
                </div>
              </div>
              <ReorderDialog 
                items={[currentItemForReorder]}
                trigger={
                  <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Create Order
                  </Button>
                }
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  if (onClose) {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Inventory Details</DialogTitle>
          </DialogHeader>
          {content}
        </DialogContent>
      </Dialog>
    );
  }

  return content;
};
