import React from 'react';
import { PurchaseOrder } from '@/types/purchaseOrder';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ShoppingCart, Calendar, DollarSign, Truck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PurchaseOrdersListPanelProps {
  purchaseOrders: PurchaseOrder[];
  selectedPurchaseOrder: string | null;
  onSelectPurchaseOrder: (id: string) => void;
}

export const PurchaseOrdersListPanel: React.FC<PurchaseOrdersListPanelProps> = ({
  purchaseOrders,
  selectedPurchaseOrder,
  onSelectPurchaseOrder
}) => {
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'sent':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'received':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'draft':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatCurrency = (amount: number | null | undefined) => {
    if (!amount) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (date: string | null | undefined) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold">Purchase Orders</h2>
        <p className="text-sm text-muted-foreground">{purchaseOrders.length} total</p>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="space-y-2 p-2">
          {purchaseOrders.map((purchaseOrder) => {
            const isSelected = selectedPurchaseOrder === purchaseOrder.id;
            
            return (
              <div
                key={purchaseOrder.id}
                onClick={() => onSelectPurchaseOrder(purchaseOrder.id)}
                className={cn(
                  "p-3 rounded-lg border cursor-pointer transition-all hover:shadow-sm",
                  isSelected 
                    ? "bg-primary/5 border-primary shadow-sm" 
                    : "bg-card border-border hover:bg-accent/50"
                )}
              >
                <div className="space-y-3">
                  {/* Header with status */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm truncate">
                        PO-{purchaseOrder.po_number || purchaseOrder.id.slice(-6)}
                      </h3>
                      <p className="text-xs text-muted-foreground truncate">
                        Vendor: {purchaseOrder.vendor || 'N/A'}
                      </p>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={cn("text-xs ml-2 flex-shrink-0", getStatusColor(purchaseOrder.status))}
                    >
                      {purchaseOrder.status || 'Draft'}
                    </Badge>
                  </div>

                  {/* Details */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <DollarSign className="w-3 h-3" />
                      <span>Total: {formatCurrency(purchaseOrder.total_amount)}</span>
                    </div>
                    
                    {purchaseOrder.due_date && (
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        <span>Due: {formatDate(purchaseOrder.due_date)}</span>
                      </div>
                    )}

                    {purchaseOrder.line_items && purchaseOrder.line_items.length > 0 && (
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <ShoppingCart className="w-3 h-3" />
                        <span>{purchaseOrder.line_items.length} items</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};