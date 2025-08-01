import React from 'react';
import { Vendor } from '@/hooks/useVendors';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Edit, Mail, Phone, MapPin, Calendar, Hash } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VendorDetailPanelProps {
  vendor: Vendor;
  onEditVendor: () => void;
}

export const VendorDetailPanel: React.FC<VendorDetailPanelProps> = ({
  vendor,
  onEditVendor
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
              <h1 className="text-xl font-semibold truncate">{vendor.name}</h1>
              <Badge variant="outline" className={cn("", getStatusColor(vendor.status || 'active'))}>
                {vendor.status || 'Active'}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Vendor ID: {vendor.id.slice(-8)}
            </p>
          </div>
          <Button 
            onClick={onEditVendor}
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
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">Email:</span>
                  <span>{vendor.contact_email || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">Phone:</span>
                  <span>{vendor.contact_phone || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">Address:</span>
                  <span>{vendor.address || 'N/A'}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Vendor Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Vendor Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <Hash className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">Vendor ID:</span>
                  <span>{vendor.id}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium">Status:</span>
                  <Badge variant="outline" className={cn("text-xs", getStatusColor(vendor.status || 'active'))}>
                    {vendor.status || 'Active'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">System Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">Created:</span>
                    <span>{formatDate(vendor.created_at)}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">Updated:</span>
                    <span>{formatDate(vendor.updated_at)}</span>
                  </div>
                </div>
              </div>
              
              {vendor.notes && (
                <div className="mt-4">
                  <span className="font-medium text-sm">Notes:</span>
                  <p className="text-sm text-muted-foreground mt-1">{vendor.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
};