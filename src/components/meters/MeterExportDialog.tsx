
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMeters } from "@/hooks/useMeters";
import { Download, FileSpreadsheet, FileText } from "lucide-react";

interface MeterExportDialogProps {
  open: boolean;
  onClose: () => void;
  selectedMeters?: string[];
}

export const MeterExportDialog = ({ open, onClose, selectedMeters }: MeterExportDialogProps) => {
  const [exportFormat, setExportFormat] = useState("csv");
  const [includeReadings, setIncludeReadings] = useState(true);
  const [includeTriggers, setIncludeTriggers] = useState(false);
  const [dateRange, setDateRange] = useState("all");
  
  const { data: meters } = useMeters();

  const handleExport = () => {
    const metersToExport = selectedMeters 
      ? meters?.filter(m => selectedMeters.includes(m.id)) 
      : meters;

    if (!metersToExport) return;

    const csvContent = generateCSV(metersToExport);
    downloadFile(csvContent, `meters-export.${exportFormat}`);
    onClose();
  };

  const generateCSV = (data: any[]) => {
    const headers = [
      'Name', 'Type', 'Unit', 'Current Value', 'Status', 'Location', 
      'Asset', 'Target Min', 'Target Max', 'Last Reading'
    ];
    
    const rows = data.map(meter => [
      meter.name,
      meter.type,
      meter.unit,
      meter.current_value,
      meter.status,
      meter.location || '',
      meter.asset_name || '',
      meter.target_min || '',
      meter.target_max || '',
      meter.last_reading_at || ''
    ]);

    return [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');
  };

  const downloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Meters
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-3">
            <Label>Export Format</Label>
            <Select value={exportFormat} onValueChange={setExportFormat}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet className="h-4 w-4" />
                    CSV Format
                  </div>
                </SelectItem>
                <SelectItem value="json">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    JSON Format
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label>Include Additional Data</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="readings" 
                  checked={includeReadings}
                  onCheckedChange={(checked) => setIncludeReadings(checked === true)}
                />
                <Label htmlFor="readings">Reading History</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="triggers" 
                  checked={includeTriggers}
                  onCheckedChange={(checked) => setIncludeTriggers(checked === true)}
                />
                <Label htmlFor="triggers">Triggers & Rules</Label>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
