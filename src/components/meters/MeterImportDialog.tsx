
import React, { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { useCreateMeter } from "@/hooks/useMetersEnhanced";
import { Upload, FileSpreadsheet, AlertTriangle, CheckCircle } from "lucide-react";

interface MeterImportDialogProps {
  open: boolean;
  onClose: () => void;
}

export const MeterImportDialog = ({ open, onClose }: MeterImportDialogProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<{ success: number; errors: string[] } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const createMeter = useCreateMeter();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
      setResults(null);
    }
  };

  const parseCSV = (text: string) => {
    const lines = text.split('\n');
    const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
    
    return lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.replace(/"/g, '').trim());
      return headers.reduce((obj, header, index) => {
        obj[header.toLowerCase().replace(' ', '_')] = values[index];
        return obj;
      }, {} as Record<string, string>);
    }).filter(row => row.name); // Filter out empty rows
  };

  const handleImport = async () => {
    if (!file) return;
    
    setImporting(true);
    setProgress(0);
    
    try {
      const text = await file.text();
      const meterData = parseCSV(text);
      
      let successCount = 0;
      const errors: string[] = [];
      
      for (let i = 0; i < meterData.length; i++) {
        try {
          const meter = meterData[i];
          await createMeter.mutateAsync({
            name: meter.name,
            type: meter.type || 'manual',
            unit: meter.unit,
            description: meter.description || null,
            location: meter.location || null,
            target_min: meter.target_min ? Number(meter.target_min) : null,
            target_max: meter.target_max ? Number(meter.target_max) : null,
            reading_frequency: meter.reading_frequency || 'none',
          });
          successCount++;
        } catch (error) {
          errors.push(`Row ${i + 2}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
        
        setProgress(((i + 1) / meterData.length) * 100);
      }
      
      setResults({ success: successCount, errors });
    } catch (error) {
      setResults({ success: 0, errors: ['Failed to parse CSV file'] });
    }
    
    setImporting(false);
  };

  const downloadTemplate = () => {
    const template = [
      'name,type,unit,description,location,target_min,target_max,reading_frequency',
      'Temperature Sensor,automated,°C,Main facility temperature,Building A,15,25,hour',
      'Pressure Gauge,manual,PSI,Hydraulic system pressure,Workshop,100,200,day'
    ].join('\n');
    
    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'meter-import-template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
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
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleFileSelect}
                  disabled={importing}
                />
              </div>

              <Alert>
                <FileSpreadsheet className="h-4 w-4" />
                <AlertDescription>
                  Upload a CSV file with meter data. Required columns: name, type, unit.
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
                  Successfully imported {results.success} meters.
                  {results.errors.length > 0 && (
                    <div className="mt-2">
                      <strong>Errors:</strong>
                      <ul className="list-disc list-inside text-sm mt-1">
                        {results.errors.slice(0, 3).map((error, i) => (
                          <li key={i}>{error}</li>
                        ))}
                        {results.errors.length > 3 && (
                          <li>... and {results.errors.length - 3} more errors</li>
                        )}
                      </ul>
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              {results ? 'Close' : 'Cancel'}
            </Button>
            {!results && (
              <Button 
                onClick={handleImport} 
                disabled={!file || importing}
              >
                <Upload className="h-4 w-4 mr-2" />
                Import
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
