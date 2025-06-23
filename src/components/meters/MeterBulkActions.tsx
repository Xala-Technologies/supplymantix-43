
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useUpdateMeter, useDeleteMeter } from "@/hooks/useMetersEnhanced";
import { 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Download, 
  FileSpreadsheet,
  Upload,
  Settings
} from "lucide-react";

interface MeterBulkActionsProps {
  selectedMeters: string[];
  onClearSelection: () => void;
  onExport: () => void;
}

export const MeterBulkActions = ({ selectedMeters, onClearSelection, onExport }: MeterBulkActionsProps) => {
  const [showBulkUpdate, setShowBulkUpdate] = useState(false);
  const [bulkUpdateField, setBulkUpdateField] = useState("");
  const [bulkUpdateValue, setBulkUpdateValue] = useState("");
  
  const updateMeter = useUpdateMeter();
  const deleteMeter = useDeleteMeter();

  const handleBulkUpdate = async () => {
    if (!bulkUpdateField || !bulkUpdateValue) return;
    
    for (const meterId of selectedMeters) {
      await updateMeter.mutateAsync({
        id: meterId,
        updates: { [bulkUpdateField]: bulkUpdateValue }
      });
    }
    
    setShowBulkUpdate(false);
    onClearSelection();
  };

  const handleBulkDelete = async () => {
    if (confirm(`Are you sure you want to delete ${selectedMeters.length} meters?`)) {
      for (const meterId of selectedMeters) {
        await deleteMeter.mutateAsync(meterId);
      }
      onClearSelection();
    }
  };

  if (selectedMeters.length === 0) return null;

  return (
    <>
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white border rounded-lg shadow-lg px-4 py-3 flex items-center gap-3 z-50">
        <Badge variant="secondary" className="bg-blue-50 text-blue-700">
          {selectedMeters.length} selected
        </Badge>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowBulkUpdate(true)}
          >
            <Edit className="h-4 w-4 mr-1" />
            Update
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onExport}
          >
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
          
          <Button
            variant="destructive"
            size="sm"
            onClick={handleBulkDelete}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
          >
            Cancel
          </Button>
        </div>
      </div>

      <Dialog open={showBulkUpdate} onOpenChange={setShowBulkUpdate}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bulk Update Meters</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label>Field to Update</Label>
              <Select value={bulkUpdateField} onValueChange={setBulkUpdateField}>
                <SelectTrigger>
                  <SelectValue placeholder="Select field" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="status">Status</SelectItem>
                  <SelectItem value="location">Location</SelectItem>
                  <SelectItem value="reading_frequency">Reading Frequency</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>New Value</Label>
              <Input
                value={bulkUpdateValue}
                onChange={(e) => setBulkUpdateValue(e.target.value)}
                placeholder="Enter new value"
              />
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowBulkUpdate(false)}>
                Cancel
              </Button>
              <Button onClick={handleBulkUpdate}>
                Update {selectedMeters.length} Meters
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
