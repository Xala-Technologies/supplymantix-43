
import React, { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { useCreateMeter } from "@/hooks/useMetersEnhanced";
import { Upload, FileSpreadsheet, AlertTriangle, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface MeterImportDialogProps {
  open: boolean;
  onClose: () => void;
}

export const MeterImportDialog = ({ open, onClose }: MeterImportDialogProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<{ success: number; errors: string[] } | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const createMeter = useCreateMeter();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && (selectedFile.type === 'text/csv' || selectedFile.name.endsWith('.csv'))) {
      setFile(selectedFile);
      setResults(null);
    } else {
      alert('Please select a valid CSV file');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile && (droppedFile.type === 'text/csv' || droppedFile.name.endsWith('.csv'))) {
      setFile(droppedFile);
      setResults(null);
    } else {
      alert('Please select a valid CSV file');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const parseCSV = (text: string) => {
    console.log('Parsing CSV text:', text.substring(0, 200) + '...');
    
    const lines = text.trim().split('\n');
    if (lines.length < 2) {
      throw new Error('CSV file must have at least a header row and one data row');
    }
    
    const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim().toLowerCase());
    console.log('CSV headers found:', headers);
    
    // Check for required headers
    const requiredHeaders = ['name', 'type', 'unit'];
    const missingHeaders = requiredHeaders.filter(req => !headers.includes(req));
    if (missingHeaders.length > 0) {
      throw new Error(`Missing required columns: ${missingHeaders.join(', ')}`);
    }
    
    const rows = lines.slice(1)
      .filter(line => line.trim()) // Remove empty lines
      .map((line, index) => {
        const values = line.split(',').map(v => v.replace(/"/g, '').trim());
        const row: Record<string, string> = {};
        
        headers.forEach((header, i) => {
          row[header] = values[i] || '';
        });
        
        // Validate required fields
        if (!row.name || !row.type || !row.unit) {
          throw new Error(`Row ${index + 2}: Missing required fields (name, type, unit)`);
        }
        
        return row;
      });
    
    console.log('Parsed CSV rows:', rows.length);
    return rows;
  };

  const handleImport = async () => {
    if (!file) return;
    
    console.log('Starting import process for file:', file.name);
    setImporting(true);
    setProgress(0);
    
    try {
      // Get current user's tenant_id
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        throw new Error('User not authenticated');
      }
      
      console.log('Current user ID:', userData.user.id);
      
      const { data: userTenant } = await supabase
        .from("users")
        .select("tenant_id")
        .eq("id", userData.user.id)
        .single();

      if (!userTenant?.tenant_id) {
        throw new Error('Unable to determine tenant context');
      }
      
      console.log('User tenant ID:', userTenant.tenant_id);

      const text = await file.text();
      const meterData = parseCSV(text);
      
      console.log('Processing', meterData.length, 'meters for import');
      
      let successCount = 0;
      const errors: string[] = [];
      
      for (let i = 0; i < meterData.length; i++) {
        try {
          const meter = meterData[i];
          console.log(`Creating meter ${i + 1}:`, meter.name);
          
          await createMeter.mutateAsync({
            name: meter.name,
            type: meter.type || 'manual',
            unit: meter.unit,
            description: meter.description || null,
            location: meter.location || null,
            target_min: meter.target_min ? parseFloat(meter.target_min) : null,
            target_max: meter.target_max ? parseFloat(meter.target_max) : null,
            reading_frequency: meter.reading_frequency || 'none',
            tenant_id: userTenant.tenant_id,
          });
          
          successCount++;
          console.log(`Successfully created meter: ${meter.name}`);
        } catch (error) {
          const errorMsg = `Row ${i + 2}: ${error instanceof Error ? error.message : 'Unknown error'}`;
          console.error(errorMsg);
          errors.push(errorMsg);
        }
        
        setProgress(((i + 1) / meterData.length) * 100);
      }
      
      console.log('Import completed. Success:', successCount, 'Errors:', errors.length);
      setResults({ success: successCount, errors });
    } catch (error) {
      console.error('Import failed:', error);
      const errorMsg = error instanceof Error ? error.message : 'Failed to import meters';
      setResults({ success: 0, errors: [errorMsg] });
    }
    
    setImporting(false);
  };

  const downloadTemplate = () => {
    const template = [
      'name,type,unit,description,location,target_min,target_max,reading_frequency',
      'Temperature Sensor,automated,°C,Main facility temperature,Building A,15,25,hour',
      'Pressure Gauge,manual,PSI,Hydraulic system pressure,Workshop,100,200,day',
      'Flow Meter,automated,L/min,Water flow measurement,Utility Room,50,150,hour'
    ].join('\n');
    
    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'meter-import-template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const resetDialog = () => {
    setFile(null);
    setResults(null);
    setProgress(0);
    setImporting(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClose = () => {
    resetDialog();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Import Meters
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {!results && (
            <>
              <div className="space-y-2">
                <Label>CSV File</Label>
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                    dragActive 
                      ? 'border-blue-400 bg-blue-50' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                >
                  <FileSpreadsheet className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600 mb-2">
                    Drag and drop a CSV file here, or
                  </p>
                  <Input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    onChange={handleFileSelect}
                    disabled={importing}
                    className="max-w-xs mx-auto"
                  />
                </div>
                {file && (
                  <p className="text-sm text-green-600 text-center">
                    ✓ Selected: {file.name}
                  </p>
                )}
              </div>

              <Alert>
                <FileSpreadsheet className="h-4 w-4" />
                <AlertDescription>
                  Upload a CSV file with meter data. Required columns: <strong>name, type, unit</strong>.
                  <br />
                  <Button 
                    variant="link" 
                    className="p-0 h-auto font-normal text-blue-600"
                    onClick={downloadTemplate}
                  >
                    Download template
                  </Button>
                </AlertDescription>
              </Alert>

              {importing && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Importing meters...</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} />
                </div>
              )}
            </>
          )}

          {results && (
            <div className="space-y-3">
              <Alert className={results.success > 0 ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
                {results.success > 0 ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                )}
                <AlertDescription>
                  <div className="font-medium mb-1">
                    Successfully imported {results.success} meters.
                  </div>
                  {results.errors.length > 0 && (
                    <div className="mt-2">
                      <strong>Errors ({results.errors.length}):</strong>
                      <ul className="list-disc list-inside text-sm mt-1 max-h-32 overflow-y-auto">
                        {results.errors.slice(0, 5).map((error, i) => (
                          <li key={i} className="text-red-700">{error}</li>
                        ))}
                        {results.errors.length > 5 && (
                          <li className="text-red-700">... and {results.errors.length - 5} more errors</li>
                        )}
                      </ul>
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleClose}>
              {results ? 'Close' : 'Cancel'}
            </Button>
            {!results && (
              <Button 
                onClick={handleImport} 
                disabled={!file || importing}
              >
                <Upload className="h-4 w-4 mr-2" />
                {importing ? 'Importing...' : 'Import'}
              </Button>
            )}
            {results && results.success === 0 && (
              <Button 
                onClick={resetDialog}
                variant="outline"
              >
                Try Again
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
