
import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, FileSpreadsheet, Download, AlertCircle } from "lucide-react";
import { useCreateInventoryItem } from "@/hooks/useInventoryMutations";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface BulkInventoryImportProps {
  onSuccess?: () => void;
}

export const BulkInventoryImport = ({ onSuccess }: BulkInventoryImportProps) => {
  const [open, setOpen] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importResults, setImportResults] = useState<{
    success: number;
    failed: number;
    errors: string[];
  } | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const createItem = useCreateInventoryItem();
  
  const downloadTemplate = () => {
    const headers = ['name', 'description', 'sku', 'location', 'quantity', 'min_quantity', 'unit_cost'];
    const sampleData = [
      'Sample Item 1,Basic inventory item,SKU001,Warehouse A,100,10,25.50',
      'Sample Item 2,Another inventory item,SKU002,Warehouse B,50,5,15.75'
    ];
    
    const csvContent = [headers.join(','), ...sampleData].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'inventory_import_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    toast.success('Template downloaded successfully');
  };
  
  const parseCSV = (text: string) => {
    const lines = text.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    
    return lines.slice(1).map((line, index) => {
      const values = line.split(',').map(v => v.trim());
      const item: any = {};
      
      headers.forEach((header, i) => {
        const value = values[i] || '';
        
        switch (header) {
          case 'quantity':
          case 'min_quantity':
            item[header] = parseInt(value) || 0;
            break;
          case 'unit_cost':
            item[header] = parseFloat(value) || 0;
            break;
          default:
            item[header] = value;
        }
      });
      
      return { ...item, lineNumber: index + 2 }; // +2 for header and 0-based index
    });
  };
  
  const validateItem = (item: any) => {
    const errors: string[] = [];
    
    if (!item.name || item.name.trim() === '') {
      errors.push('Name is required');
    }
    
    if (item.quantity < 0) {
      errors.push('Quantity cannot be negative');
    }
    
    if (item.min_quantity < 0) {
      errors.push('Minimum quantity cannot be negative');
    }
    
    if (item.unit_cost < 0) {
      errors.push('Unit cost cannot be negative');
    }
    
    return errors;
  };
  
  const handleFileImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    if (!file.name.endsWith('.csv')) {
      toast.error('Please select a CSV file');
      return;
    }
    
    setImporting(true);
    setImportResults(null);
    
    try {
      const text = await file.text();
      const items = parseCSV(text);
      
      console.log('Parsed items:', items);
      
      let successCount = 0;
      let failedCount = 0;
      const errors: string[] = [];
      
      for (const item of items) {
        try {
          const validationErrors = validateItem(item);
          
          if (validationErrors.length > 0) {
            errors.push(`Line ${item.lineNumber}: ${validationErrors.join(', ')}`);
            failedCount++;
            continue;
          }
          
          await createItem.mutateAsync({
            name: item.name,
            description: item.description || '',
            sku: item.sku || '',
            location: item.location || '',
            quantity: item.quantity || 0,
            min_quantity: item.min_quantity || 0,
            unit_cost: item.unit_cost || 0
          });
          
          successCount++;
        } catch (error) {
          console.error(`Failed to import item on line ${item.lineNumber}:`, error);
          errors.push(`Line ${item.lineNumber}: ${(error as Error).message}`);
          failedCount++;
        }
      }
      
      setImportResults({ success: successCount, failed: failedCount, errors });
      
      if (successCount > 0) {
        toast.success(`Successfully imported ${successCount} items`);
        onSuccess?.();
      }
      
      if (failedCount > 0) {
        toast.error(`Failed to import ${failedCount} items`);
      }
      
    } catch (error) {
      console.error('Import failed:', error);
      toast.error('Failed to process CSV file: ' + (error as Error).message);
    } finally {
      setImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Upload className="w-4 h-4" />
          Bulk Import
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5" />
            Bulk Import Inventory
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Step 1: Download Template</Label>
            <Button
              variant="outline"
              onClick={downloadTemplate}
              className="w-full flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download CSV Template
            </Button>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="csv-file">Step 2: Upload Your CSV</Label>
            <Input
              ref={fileInputRef}
              id="csv-file"
              type="file"
              accept=".csv"
              onChange={handleFileImport}
              disabled={importing}
            />
          </div>
          
          {importing && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Importing items... Please wait.
              </AlertDescription>
            </Alert>
          )}
          
          {importResults && (
            <div className="space-y-2">
              <Alert className={importResults.failed > 0 ? "border-orange-200 bg-orange-50" : "border-green-200 bg-green-50"}>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-1">
                    <p>Import completed:</p>
                    <p>✅ {importResults.success} items imported successfully</p>
                    {importResults.failed > 0 && (
                      <p>❌ {importResults.failed} items failed</p>
                    )}
                  </div>
                </AlertDescription>
              </Alert>
              
              {importResults.errors.length > 0 && (
                <div className="max-h-32 overflow-y-auto">
                  <Label className="text-sm font-medium text-red-600">Errors:</Label>
                  <div className="text-xs text-red-600 space-y-1">
                    {importResults.errors.map((error, index) => (
                      <p key={index}>{error}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          
          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setOpen(false);
                setImportResults(null);
              }}
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
