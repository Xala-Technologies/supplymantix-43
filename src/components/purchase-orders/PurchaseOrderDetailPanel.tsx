import React from 'react';
import { PurchaseOrder } from '@/types/purchaseOrder';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Edit, Calendar, DollarSign, Hash, ShoppingCart, User, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PurchaseOrderDetailPanelProps {
  purchaseOrder: PurchaseOrder;
  onEditPurchaseOrder: () => void;
}

export const PurchaseOrderDetailPanel: React.FC<PurchaseOrderDetailPanelProps> = ({
  purchaseOrder,
  onEditPurchaseOrder
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
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-border bg-background">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-xl font-semibold truncate">
                PO-{purchaseOrder.po_number || purchaseOrder.id.slice(-6)}
              </h1>
              <Badge variant="outline" className={cn("", getStatusColor(purchaseOrder.status))}>
                {purchaseOrder.status || 'Draft'}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Vendor: {purchaseOrder.vendor || 'N/A'}
            </p>
          </div>
          <Button 
            onClick={onEditPurchaseOrder}
            variant="outline"
            size="sm"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6">
          {/* Order Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Order Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Hash className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">PO Number:</span>
                    <span>{purchaseOrder.po_number || 'Auto-generated'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">Total Amount:</span>
                    <span className="font-semibold">{formatCurrency(purchaseOrder.total_amount)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">Vendor:</span>
                    <span>{purchaseOrder.vendor || 'N/A'}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">Order Date:</span>
                    <span>{formatDate(purchaseOrder.created_at)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">Due Date:</span>
                    <span>{formatDate(purchaseOrder.due_date)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium">Status:</span>
                    <Badge variant="outline" className={cn("text-xs", getStatusColor(purchaseOrder.status))}>
                      {purchaseOrder.status || 'Draft'}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Line Items */}
          {purchaseOrder.line_items && purchaseOrder.line_items.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4" />
                  Line Items ({purchaseOrder.line_items.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {purchaseOrder.line_items.map((item, index) => (
                    <div key={item.id || index} className="border rounded-lg p-3">
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <div className="font-medium text-sm">{item.description}</div>
                          <div className="text-xs text-muted-foreground">Item #{index + 1}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm">Qty: {item.quantity}</div>
                          <div className="text-xs text-muted-foreground">
                            Unit: {formatCurrency(item.unit_price)}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-sm">
                            {formatCurrency(item.total_amount)}
                          </div>
                          <div className="text-xs text-muted-foreground">Total</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Additional Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Additional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">Created:</span>
                    <span>{formatDate(purchaseOrder.created_at)}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">Updated:</span>
                    <span>{formatDate(purchaseOrder.updated_at)}</span>
                  </div>
                </div>
              </div>
              
              {purchaseOrder.notes && (
                <div className="mt-4">
                  <div className="flex items-center gap-2 text-sm font-medium mb-2">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    Notes:
                  </div>
                  <p className="text-sm text-muted-foreground bg-muted/50 rounded p-3">
                    {purchaseOrder.notes}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
};