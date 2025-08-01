import React from 'react';
import { Vendor } from '@/hooks/useVendors';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Truck, Mail, Phone, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VendorsListPanelProps {
  vendors: Vendor[];
  selectedVendor: string | null;
  onSelectVendor: (id: string) => void;
}

export const VendorsListPanel: React.FC<VendorsListPanelProps> = ({
  vendors,
  selectedVendor,
  onSelectVendor
}) => {
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'suspended':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold">Vendors</h2>
        <p className="text-sm text-muted-foreground">{vendors.length} total</p>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="space-y-2 p-2">
          {vendors.map((vendor) => {
            const isSelected = selectedVendor === vendor.id;
            
            return (
              <div
                key={vendor.id}
                onClick={() => onSelectVendor(vendor.id)}
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
                        {vendor.name || 'Untitled Vendor'}
                      </h3>
                      <p className="text-xs text-muted-foreground truncate">
                        Vendor ID: {vendor.id.slice(-8)}
                      </p>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={cn("text-xs ml-2 flex-shrink-0", getStatusColor(vendor.status))}
                    >
                      {vendor.status || 'Active'}
                    </Badge>
                  </div>

                  {/* Details */}
                  <div className="space-y-1">
                    {vendor.contact_email && (
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Mail className="w-3 h-3" />
                        <span className="truncate">{vendor.contact_email}</span>
                      </div>
                    )}
                    
                    {vendor.contact_phone && (
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Phone className="w-3 h-3" />
                        <span className="truncate">{vendor.contact_phone}</span>
                      </div>
                    )}

                    {vendor.address && (
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate">{vendor.address}</span>
                      </div>
                    )}

                    {vendor.notes && (
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Truck className="w-3 h-3" />
                        <span className="truncate">{vendor.notes.slice(0, 50)}...</span>
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