import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Package, DollarSign, MapPin, Edit, ShoppingCart, AlertTriangle, CheckCircle, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { ReorderDialog } from "./ReorderDialog";
import { useInventoryEnhanced } from "@/hooks/useInventoryEnhanced";
import { useAssets } from "@/hooks/useAssets";
import { useVendors } from "@/hooks/useVendors";
import { useLocations } from "@/hooks/useLocations";
import { useTeams } from "@/hooks/useTeams";
import QRCode from "qrcode";
import { useEffect, useState } from "react";

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
    qr_code: string;
    barcode: string;
    picture_url: string;
    assets: Array<string>;
    teams: Array<string>;
    vendor: string;
    part_type: string;
    area: string;
    documents: Array<{
      name: string;
      url: string;
    }>;
  };
  onClose?: () => void;
  onEdit?: () => void;
}

export const InventoryDetailCard = ({ item, onClose, onEdit }: InventoryDetailCardProps) => {
  // Get all inventory items for reorder functionality
  const { data: inventoryData } = useInventoryEnhanced();
  const { data: assets = [] } = useAssets();
  const { data: vendors = [] } = useVendors();
  const { data: locations = [] } = useLocations();
  const { data: teams = [] } = useTeams();

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
    part_number: item.partNumber || null,
    vendor_id: item.vendor || null,
    qr_code: item.qr_code || null,
    barcode: item.barcode || null,
    picture_url: item.picture_url || null,
    assets: item.assets || [],
    teams: item.teams || [],
    part_type: item.part_type || null,
    area: item.area || null,
    documents: item.documents || null,
  };

  // QR code rendering
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");
  useEffect(() => {
    if (item.qr_code) {
      QRCode.toDataURL(item.qr_code, { width: 96, margin: 1 })
        .then(url => setQrCodeDataUrl(url))
        .catch(() => setQrCodeDataUrl(""));
    } else {
      setQrCodeDataUrl("");
    }
  }, [item.qr_code]);

  // Helper functions to get names
  const getAssetNames = () => {
    if (!item.assets || item.assets.length === 0) return "N/A";
    return item.assets
      .map(id => assets.find(a => a.id === id)?.name || id)
      .join(", ");
  };
  const getVendorName = () => vendors.find(v => v.id === item.vendor)?.name || item.vendor || "N/A";
  const getLocationName = () => locations.find(l => l.id === item.location)?.name || item.location || "N/A";
  const getTeamNames = () => {
    if (!item.teams || item.teams.length === 0) return "N/A";
    return item.teams
      .map(id => teams.find(t => t.id === id)?.name || id)
      .join(", ");
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
    <div className="space-y-4 max-h-[80vh] overflow-y-auto">
      {/* Compact Header */}
      <div className="flex items-start justify-between pb-3 border-b">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-2xl font-bold text-gray-900 truncate">{item.name}</h1>
            <Badge className={cn("border flex-shrink-0", statusConfig.color)}>
              <statusConfig.icon className="w-3 h-3 mr-1" />
              {statusConfig.text}
            </Badge>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-600 mb-1">
            <span className="font-medium">SKU: {item.sku}</span>
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span>{item.location}</span>
            </div>
          </div>
          <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
        </div>
        
        <div className="flex items-center gap-2 ml-4 flex-shrink-0">
          {onEdit && (
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </Button>
          )}
          <ReorderDialog 
            items={[currentItemForReorder]}
            trigger={
              <Button 
                size="sm"
                className={cn(
                  "flex items-center gap-2",
                  needsReorder 
                    ? "bg-orange-600 hover:bg-orange-700 text-white" 
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                )}
              >
                <ShoppingCart className="w-4 h-4" />
                {needsReorder ? "Reorder Now" : "Create Order"}
              </Button>
            }
          />
        </div>
      </div>

      {/* Compact Metrics Grid */}
      <div className="grid grid-cols-4 gap-3">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-blue-700 uppercase">Stock</p>
                <p className="text-xl font-bold text-blue-900">{item.quantity}</p>
              </div>
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-amber-700 uppercase">Min</p>
                <p className="text-xl font-bold text-amber-900">{item.minQuantity}</p>
              </div>
              <AlertTriangle className="w-6 h-6 text-amber-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-green-700 uppercase">Unit Cost</p>
                <p className="text-lg font-bold text-green-900">{formatCurrency(item.unitCost)}</p>
              </div>
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-purple-700 uppercase">Total</p>
                <p className="text-lg font-bold text-purple-900">{formatCurrency(item.totalValue)}</p>
              </div>
              <Package className="w-6 h-6 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stock Level Indicator */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">Stock Level</h3>
            <span className="text-sm text-gray-600 font-medium">{item.quantity} / {item.maxStock}</span>
          </div>
          <div className="relative">
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className={cn(
                  "h-3 rounded-full transition-all duration-500 ease-out",
                  stockPercentage <= 20 ? "bg-gradient-to-r from-red-500 to-red-600" :
                  stockPercentage <= 40 ? "bg-gradient-to-r from-amber-500 to-amber-600" : 
                  "bg-gradient-to-r from-green-500 to-green-600"
                )}
                style={{ width: `${stockPercentage}%` }}
              />
            </div>
            <div className="flex justify-between mt-1 text-xs text-gray-500">
              <span>0</span>
              <span>Reorder: {item.reorderPoint}</span>
              <span>Max: {item.maxStock}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Information Grid - More Compact */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Item Details</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Category</span>
                <span className="font-medium text-gray-900">{item.category}</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Supplier</span>
                <span className="font-medium text-gray-900">{item.supplier}</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Part Number</span>
                <span className="font-medium text-gray-900">{item.partNumber}</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Lead Time</span>
                <span className="font-medium text-gray-900">{item.leadTime}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Recent Activity</h3>
            <div className="space-y-2">
              {item.transactions.slice(0, 3).map((transaction, index) => (
                <div key={index} className="flex items-center justify-between py-1">
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      transaction.type === 'Usage' ? 'bg-red-500' : 'bg-green-500'
                    )} />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{transaction.type}</p>
                      <p className="text-xs text-gray-500">{transaction.date}</p>
                    </div>
                  </div>
                  <span className={cn(
                    "text-sm font-semibold",
                    transaction.quantity > 0 ? 'text-green-600' : 'text-red-600'
                  )}>
                    {transaction.quantity > 0 ? '+' : ''}{transaction.quantity}
                  </span>
                </div>
              ))}
              {item.transactions.length === 0 && (
                <div className="text-center py-4">
                  <Calendar className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                  <p className="text-xs text-gray-500">No recent activity</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Smart Reorder Alert - More Compact */}
      {needsReorder && (
        <Card className="border-orange-200 bg-gradient-to-r from-orange-50 via-red-50 to-orange-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-orange-900 mb-1">Stock Alert</h4>
                <p className="text-sm text-orange-800 mb-2">
                  Current stock ({item.quantity}) is at or below minimum level ({item.minQuantity}). 
                  Consider ordering {Math.max(0, item.maxStock - item.quantity)} units.
                </p>
                <div className="text-xs text-orange-700">
                  <span className="font-medium">Supplier:</span> {item.supplier} • 
                  <span className="font-medium ml-2">Lead Time:</span> {item.leadTime}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* New: Identification & Attachments */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Identification</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex flex-col gap-2">
                <span className="text-gray-600">QR Code</span>
                {qrCodeDataUrl ? (
                  <img src={qrCodeDataUrl} alt="QR Code" className="h-20 w-20 object-contain border rounded" />
                ) : (
                  <span className="text-gray-400">N/A</span>
                )}
              </div>
            </div>
            {item.barcode && (
              <div>
                <span className="text-gray-600">Barcode</span>
                <div className="mt-1">
                  <img src={item.barcode} alt="Barcode" className="h-20 w-20 object-contain border rounded" />
                </div>
              </div>
            )}
            {item.picture_url && (
              <div>
                <span className="text-gray-600">Image</span>
                <div className="mt-1">
                  <img src={item.picture_url} alt="Part" className="h-20 w-20 object-cover border rounded" />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Associations</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div><b>Assets</b><br />{getAssetNames()}</div>
              <div><b>Vendor</b><br />{getVendorName()}</div>
              <div><b>Area</b><br />{item.area || "N/A"}</div>
            </div>
            <div>
              <div><b>Teams</b><br />{getTeamNames()}</div>
              <div><b>Location</b><br />{getLocationName()}</div>
            </div>
          </div>
        </CardContent>
      </Card>
      {item.documents && item.documents.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Documents</h3>
            <ul className="list-disc pl-5">
              {item.documents.map((doc, idx) => (
                <li key={idx}>
                  <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{doc.name}</a>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );

  if (onClose) {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
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
