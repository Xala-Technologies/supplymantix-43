
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, Edit, Trash2, Calendar, DollarSign } from "lucide-react";
import { useRouter } from "react-router-dom";
import { PurchaseOrder } from "@/types/purchaseOrder";
import { formatCurrency, formatDate } from "@/lib/utils";

interface PurchaseOrdersListProps {
  purchaseOrders: PurchaseOrder[];
  onDelete: (id: string) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'draft':
      return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    case 'pending_approval':
      return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
    case 'sent':
      return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
    case 'fully_received':
      return 'bg-green-100 text-green-800 hover:bg-green-200';
    case 'closed':
      return 'bg-red-100 text-red-800 hover:bg-red-200';
    default:
      return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
  }
};

export const PurchaseOrdersList = ({ purchaseOrders, onDelete }: PurchaseOrdersListProps) => {
  const router = useRouter();

  if (purchaseOrders.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100">
            <DollarSign className="h-6 w-6 text-gray-600" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">No purchase orders found</h3>
          <p className="mt-2 text-sm text-muted-foreground text-center max-w-sm">
            Get started by creating your first purchase order to track vendor orders and deliveries.
          </p>
          <Button 
            className="mt-4" 
            onClick={() => router.push("/dashboard/purchase-orders/new")}
          >
            Create Purchase Order
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Purchase Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>PO Number</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  Total Amount
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Due Date
                </div>
              </TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {purchaseOrders.map((po) => (
              <TableRow key={po.id} className="hover:bg-muted/50">
                <TableCell className="font-medium">{po.po_number}</TableCell>
                <TableCell>{po.vendor}</TableCell>
                <TableCell>
                  <Badge 
                    variant="secondary" 
                    className={getStatusColor(po.status)}
                  >
                    {po.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium">
                  {formatCurrency(po.total_amount)}
                </TableCell>
                <TableCell>
                  {po.due_date ? formatDate(po.due_date) : '-'}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDate(po.created_at)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push(`/dashboard/purchase-orders/${po.id}`)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push(`/dashboard/purchase-orders/${po.id}/edit`)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this purchase order?')) {
                          onDelete(po.id);
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
