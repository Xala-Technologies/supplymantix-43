import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash2, Package, Building2, MapPin, FileText } from "lucide-react";
import { useInventoryItems } from "@/hooks/useInventory";
import { PurchaseOrder, PurchaseOrderStatus } from "@/types/purchaseOrder";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";
import { VendorSelector } from "./VendorSelector";
import { AddressSelector } from "./AddressSelector";

interface LineItem {
  inventory_item_id: string;
  description: string;
  quantity: number;
  unit_price: number;
}

interface PurchaseOrderFormProps {
  initialData?: Partial<PurchaseOrder>;
  initialLineItems?: LineItem[];
  onSubmit: (data: {
    vendor: string;
    po_number: string;
    status?: PurchaseOrderStatus;
    notes?: string;
    due_date?: string;
    line_items: LineItem[];
  }) => void;
  isLoading?: boolean;
  mode: 'create' | 'edit';
}

export const PurchaseOrderForm = ({
  initialData,
  initialLineItems = [],
  onSubmit,
  isLoading,
  mode,
}: PurchaseOrderFormProps) => {
  const [vendor, setVendor] = useState(
    typeof initialData?.vendor === 'string' ? initialData.vendor : ''
  );
  const [poNumber, setPoNumber] = useState(initialData?.po_number || '');
  const [status, setStatus] = useState<PurchaseOrderStatus>(initialData?.status || 'draft');
  const [notes, setNotes] = useState(initialData?.notes || '');
  const [dueDate, setDueDate] = useState(
    initialData?.due_date ? initialData.due_date.split('T')[0] : ''
  );
  const [lineItems, setLineItems] = useState<LineItem[]>(
    initialLineItems.length > 0 
      ? initialLineItems 
      : [{ inventory_item_id: '', description: '', quantity: 1, unit_price: 0 }]
  );
  const [billingAddress, setBillingAddress] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');

  const { data: inventoryItems } = useInventoryItems();

  // Generate PO number for new orders
  useEffect(() => {
    if (mode === 'create' && !poNumber) {
      const timestamp = Date.now().toString().slice(-6);
      setPoNumber(`PO-${timestamp}`);
    }
  }, [mode, poNumber]);

  const totalAmount = lineItems.reduce(
    (sum, item) => sum + (item.quantity * item.unit_price),
    0
  );

  const handleLineItemChange = (
    index: number,
    field: keyof LineItem,
    value: string | number
  ) => {
    const updated = [...lineItems];
    (updated[index] as any)[field] = value;
    
    // Auto-fill description when inventory item is selected
    if (field === 'inventory_item_id' && typeof value === 'string') {
      const selectedItem = inventoryItems?.find(item => item.id === value);
      if (selectedItem) {
        updated[index].description = selectedItem.name;
        updated[index].unit_price = selectedItem.unit_cost || 0;
      }
    }
    
    setLineItems(updated);
  };

  const addLineItem = () => {
    setLineItems([...lineItems, { inventory_item_id: '', description: '', quantity: 1, unit_price: 0 }]);
  };

  const removeLineItem = (index: number) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter((_, i) => i !== index));
    }
  };

  const validateForm = () => {
    if (!vendor.trim()) {
      toast.error("Vendor is required");
      return false;
    }
    
    if (!poNumber.trim()) {
      toast.error("PO Number is required");
      return false;
    }

    const validLineItems = lineItems.filter(item => 
      item.description.trim() && item.quantity > 0 && item.unit_price >= 0
    );

    if (validLineItems.length === 0) {
      toast.error("At least one valid line item is required");
      return false;
    }

    const invalidQuantity = lineItems.some(item => 
      item.description.trim() && (item.quantity <= 0 || !Number.isInteger(item.quantity))
    );
    
    if (invalidQuantity) {
      toast.error("All quantities must be positive integers");
      return false;
    }

    const invalidPrice = lineItems.some(item => 
      item.description.trim() && item.unit_price < 0
    );
    
    if (invalidPrice) {
      toast.error("All unit prices must be zero or positive");
      return false;
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const validLineItems = lineItems.filter(item => 
      item.description.trim() && item.quantity > 0 && item.unit_price >= 0
    );

    onSubmit({
      vendor: vendor.trim(),
      po_number: poNumber.trim(),
      status: mode === 'edit' ? status : undefined,
      notes: notes.trim() || undefined,
      due_date: dueDate || undefined,
      line_items: validLineItems,
    });
  };

  const isFormValid = () => {
    if (!vendor.trim() || !poNumber.trim()) return false;
    
    const validLineItems = lineItems.filter(item => 
      item.description.trim() && item.quantity > 0 && item.unit_price >= 0
    );
    
    return validLineItems.length > 0;
  };

  // Mock data for demonstration - in real app, these would come from your backend
  const mockVendors = [
    { id: '1', name: 'ACME Corp', contact_email: 'orders@acme.com' },
    { id: '2', name: 'Best Supplies Ltd', contact_email: 'sales@bestsupplies.com' },
    { id: '3', name: 'Quick Parts Inc', contact_email: 'info@quickparts.com' },
  ];

  const mockAddresses = [
    {
      id: '1',
      type: 'billing' as const,
      street: '123 Business Ave',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      country: 'United States'
    },
    {
      id: '2',
      type: 'shipping' as const,
      street: '456 Warehouse Rd',
      city: 'Brooklyn',
      state: 'NY',
      zip: '11201',
      country: 'United States'
    }
  ];

  const handleCreateVendor = async (vendorData: any) => {
    console.log('Creating vendor:', vendorData);
    // In real app, this would call your API
    return Promise.resolve();
  };

  const handleCreateAddress = async (addressData: any) => {
    console.log('Creating address:', addressData);
    // In real app, this would call your API and return the created address
    return Promise.resolve({
      id: Date.now().toString(),
      ...addressData
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-3 text-xl">
            <FileText className="h-6 w-6" />
            {mode === 'create' ? 'Create Purchase Order' : 'Edit Purchase Order'}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-8 space-y-8">
          {/* Basic Information Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
              <Building2 className="h-5 w-5 text-blue-600" />
              Basic Information
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <VendorSelector
                value={vendor}
                onChange={setVendor}
                vendors={mockVendors}
                onCreateVendor={handleCreateVendor}
              />
              
              <div className="space-y-2">
                <Label htmlFor="po_number" className="text-sm font-medium text-gray-700">
                  PO Number *
                </Label>
                <Input
                  id="po_number"
                  value={poNumber}
                  onChange={(e) => setPoNumber(e.target.value)}
                  placeholder="Auto-generated"
                  className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mode === 'edit' && (
                <div className="space-y-2">
                  <Label htmlFor="status" className="text-sm font-medium text-gray-700">
                    Status
                  </Label>
                  <Select value={status} onValueChange={(value: PurchaseOrderStatus) => setStatus(value)}>
                    <SelectTrigger className="border-gray-300 focus:ring-blue-500 focus:border-blue-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="ordered">Ordered</SelectItem>
                      <SelectItem value="received">Received</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="due_date" className="text-sm font-medium text-gray-700">
                  Due Date
                </Label>
                <Input
                  id="due_date"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes" className="text-sm font-medium text-gray-700">
                Notes
              </Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Additional notes or instructions"
                rows={3}
                className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <Separator className="my-8" />

          {/* Addresses Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
              <MapPin className="h-5 w-5 text-blue-600" />
              Addresses
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AddressSelector
                type="billing"
                value={billingAddress}
                onChange={setBillingAddress}
                addresses={mockAddresses}
                onCreateAddress={handleCreateAddress}
              />
              <AddressSelector
                type="shipping"
                value={shippingAddress}
                onChange={setShippingAddress}
                addresses={mockAddresses}
                onCreateAddress={handleCreateAddress}
              />
            </div>
          </div>

          <Separator className="my-8" />

          {/* Line Items Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                <Package className="h-5 w-5 text-blue-600" />
                Line Items
              </div>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={addLineItem}
                className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>

            <div className="space-y-4">
              {lineItems.map((item, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
                    <div className="lg:col-span-3 space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Inventory Item</Label>
                      <Select 
                        value={item.inventory_item_id}
                        onValueChange={(value) => handleLineItemChange(index, 'inventory_item_id', value)}
                      >
                        <SelectTrigger className="border-gray-300 focus:ring-blue-500 focus:border-blue-500">
                          <SelectValue placeholder="Select item" />
                        </SelectTrigger>
                        <SelectContent>
                          {inventoryItems?.map((invItem) => (
                            <SelectItem key={invItem.id} value={invItem.id}>
                              {invItem.name} {invItem.sku ? `(${invItem.sku})` : ''} - Stock: {invItem.quantity}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="lg:col-span-3 space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Description *</Label>
                      <Input
                        type="text"
                        value={item.description}
                        onChange={(e) => handleLineItemChange(index, 'description', e.target.value)}
                        placeholder="Item description"
                        className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    
                    <div className="lg:col-span-2 space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Quantity *</Label>
                      <Input
                        type="number"
                        min="1"
                        step="1"
                        value={item.quantity}
                        onChange={(e) => handleLineItemChange(index, 'quantity', parseInt(e.target.value) || 1)}
                        className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div className="lg:col-span-2 space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Unit Price *</Label>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        value={item.unit_price}
                        onChange={(e) => handleLineItemChange(index, 'unit_price', parseFloat(e.target.value) || 0)}
                        className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div className="lg:col-span-1 space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Total</Label>
                      <div className="h-10 flex items-center px-3 bg-blue-50 rounded-md text-sm font-semibold text-blue-800 border border-blue-200">
                        {formatCurrency(item.quantity * item.unit_price)}
                      </div>
                    </div>
                    
                    <div className="lg:col-span-1 flex justify-center">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeLineItem(index)}
                        disabled={lineItems.length === 1}
                        className="text-red-600 hover:text-red-800 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Total Section */}
            <div className="flex justify-end">
              <div className="bg-blue-50 rounded-lg p-6 border-2 border-blue-200">
                <div className="text-2xl font-bold text-blue-800">
                  Total: {formatCurrency(totalAmount)}
                </div>
              </div>
            </div>
          </div>

          <Separator className="my-8" />

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <Button 
              type="submit" 
              disabled={isLoading || !isFormValid()} 
              className="min-w-48 h-12 text-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg"
            >
              {isLoading ? 'Saving...' : mode === 'create' ? 'Create Purchase Order' : 'Update Purchase Order'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
};
