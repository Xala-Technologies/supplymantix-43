
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Building2, 
  MapPin, 
  Calendar, 
  Edit, 
  Trash2,
  FileText,
  Users,
  Settings
} from "lucide-react";
import type { Location } from "@/types/location";

interface LocationDetailDialogProps {
  location: Location;
  onClose: () => void;
  onEdit?: () => void;
}

export const LocationDetailDialog = ({ location, onClose, onEdit }: LocationDetailDialogProps) => {
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            {location.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status and Actions */}
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              Active
            </Badge>
            <div className="flex gap-2">
              {onEdit && (
                <Button variant="outline" size="sm" onClick={onEdit}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              )}
              <Button variant="outline" size="sm">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>

          <Separator />

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Location Name</label>
                <p className="text-base text-gray-900 mt-1">{location.name}</p>
              </div>
              
              {location.description && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Description</label>
                  <p className="text-base text-gray-900 mt-1">{location.description}</p>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-gray-500">Created Date</label>
                <p className="text-base text-gray-900 mt-1 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {new Date(location.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Quick Stats
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Assets:</span>
                    <span className="font-medium">0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Work Orders:</span>
                    <span className="font-medium">0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Meters:</span>
                    <span className="font-medium">0</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Related Information Tabs */}
          <div className="space-y-4">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8">
                <button className="border-b-2 border-blue-500 text-blue-600 pb-2 text-sm font-medium">
                  Assets
                </button>
                <button className="text-gray-500 hover:text-gray-700 pb-2 text-sm font-medium">
                  Work Orders
                </button>
                <button className="text-gray-500 hover:text-gray-700 pb-2 text-sm font-medium">
                  Meters
                </button>
              </nav>
            </div>

            <div className="p-6 border border-gray-200 rounded-lg bg-gray-50">
              <div className="text-center">
                <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">No assets found for this location</p>
                <Button variant="link" className="mt-2">
                  Add Asset to Location
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
