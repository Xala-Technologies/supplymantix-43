import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Download, FileSpreadsheet, FileText, File, Clock, CheckCircle } from 'lucide-react';
import { useReporting } from '@/contexts/ReportingContext';

interface ExportRequest {
  id: string;
  name: string;
  type: 'csv' | 'pdf' | 'excel';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  createdAt: Date;
  downloadUrl?: string;
}

export const ExportDataTab = () => {
  const { dateRange, filters } = useReporting();
  const [reportType, setReportType] = useState('work-orders');
  const [exportFormat, setExportFormat] = useState<'csv' | 'pdf' | 'excel'>('csv');
  const [groupBy, setGroupBy] = useState('none');
  const [includeFields, setIncludeFields] = useState({
    basicInfo: true,
    assignments: true,
    timeline: true,
    costs: false,
    attachments: false,
  });
  const [isExporting, setIsExporting] = useState(false);

  // Mock export history
  const [exportHistory, setExportHistory] = useState<ExportRequest[]>([
    {
      id: '1',
      name: 'Work Orders Report - December 2024',
      type: 'excel',
      status: 'completed',
      progress: 100,
      createdAt: new Date(Date.now() - 1000 * 60 * 30),
      downloadUrl: '/exports/work-orders-dec-2024.xlsx',
    },
    {
      id: '2',
      name: 'Asset Health Report',
      type: 'pdf',
      status: 'completed',
      progress: 100,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
      downloadUrl: '/exports/asset-health-report.pdf',
    },
    {
      id: '3',
      name: 'Maintenance Schedule',
      type: 'csv',
      status: 'processing',
      progress: 75,
      createdAt: new Date(Date.now() - 1000 * 60 * 5),
    },
  ]);

  const reportTypes = [
    { value: 'work-orders', label: 'Work Orders' },
    { value: 'assets', label: 'Assets' },
    { value: 'maintenance-schedule', label: 'Maintenance Schedule' },
    { value: 'cost-analysis', label: 'Cost Analysis' },
    { value: 'performance-metrics', label: 'Performance Metrics' },
    { value: 'activity-log', label: 'Activity Log' },
  ];

  const groupOptions = [
    { value: 'none', label: 'No Grouping' },
    { value: 'team', label: 'By Team' },
    { value: 'user', label: 'By User' },
    { value: 'asset', label: 'By Asset' },
    { value: 'location', label: 'By Location' },
    { value: 'category', label: 'By Category' },
    { value: 'status', label: 'By Status' },
  ];

  const formatOptions = [
    { value: 'csv', label: 'CSV', icon: FileSpreadsheet },
    { value: 'excel', label: 'Excel', icon: FileSpreadsheet },
    { value: 'pdf', label: 'PDF', icon: FileText },
  ];

  const handleExport = async () => {
    setIsExporting(true);
    
    // Simulate export process
    const newExport: ExportRequest = {
      id: Date.now().toString(),
      name: `${reportTypes.find(rt => rt.value === reportType)?.label} - ${new Date().toLocaleDateString()}`,
      type: exportFormat,
      status: 'processing',
      progress: 0,
      createdAt: new Date(),
    };

    setExportHistory(prev => [newExport, ...prev]);

    // Simulate progress
    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress >= 100) {
        progress = 100;
        clearInterval(progressInterval);
        setExportHistory(prev => 
          prev.map(item => 
            item.id === newExport.id 
              ? { ...item, status: 'completed', progress: 100, downloadUrl: `/exports/${newExport.id}.${exportFormat}` }
              : item
          )
        );
        setIsExporting(false);
      } else {
        setExportHistory(prev => 
          prev.map(item => 
            item.id === newExport.id 
              ? { ...item, progress }
              : item
          )
        );
      }
    }, 1000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'processing': return <Clock className="h-4 w-4 text-blue-500" />;
      case 'failed': return <File className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getFormatIcon = (format: string) => {
    const formatOption = formatOptions.find(f => f.value === format);
    if (formatOption) {
      const IconComponent = formatOption.icon;
      return <IconComponent className="h-4 w-4" />;
    }
    return <File className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Export Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>Export Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Report Type</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {reportTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Export Format</Label>
              <div className="grid grid-cols-3 gap-2">
                {formatOptions.map((format) => (
                  <Button
                    key={format.value}
                    variant={exportFormat === format.value ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setExportFormat(format.value as any)}
                    className="flex items-center gap-2"
                  >
                    <format.icon className="h-4 w-4" />
                    {format.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Group By</Label>
              <Select value={groupBy} onValueChange={setGroupBy}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {groupOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label>Include Fields</Label>
              <div className="space-y-2">
                {Object.entries(includeFields).map(([key, value]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <Checkbox
                      id={key}
                      checked={value}
                      onCheckedChange={(checked) =>
                        setIncludeFields(prev => ({ ...prev, [key]: !!checked }))
                      }
                    />
                    <Label htmlFor={key} className="text-sm capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Button 
              onClick={handleExport} 
              disabled={isExporting}
              className="w-full"
            >
              <Download className="h-4 w-4 mr-2" />
              {isExporting ? 'Exporting...' : 'Export Data'}
            </Button>
          </CardContent>
        </Card>

        {/* Current Filters Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Export Preview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Date Range</Label>
              <p className="text-sm text-muted-foreground">
                {dateRange.from.toLocaleDateString()} - {dateRange.to.toLocaleDateString()}
              </p>
            </div>

            <div>
              <Label className="text-sm font-medium">Active Filters</Label>
              <div className="space-y-1">
                {filters.filter(f => f.value && (Array.isArray(f.value) ? f.value.length > 0 : true)).map((filter) => (
                  <p key={filter.id} className="text-sm text-muted-foreground">
                    {filter.label}: {Array.isArray(filter.value) ? `${filter.value.length} selected` : filter.value}
                  </p>
                ))}
                {filters.filter(f => f.value && (Array.isArray(f.value) ? f.value.length > 0 : true)).length === 0 && (
                  <p className="text-sm text-muted-foreground">No filters applied</p>
                )}
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">Estimated Records</Label>
              <p className="text-sm text-muted-foreground">~1,247 records</p>
            </div>

            <div>
              <Label className="text-sm font-medium">Estimated File Size</Label>
              <p className="text-sm text-muted-foreground">
                {exportFormat === 'pdf' ? '~2.5 MB' : exportFormat === 'excel' ? '~850 KB' : '~320 KB'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Export History */}
      <Card>
        <CardHeader>
          <CardTitle>Export History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {exportHistory.map((exportItem) => (
              <div key={exportItem.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  {getFormatIcon(exportItem.type)}
                  <div>
                    <p className="font-medium">{exportItem.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {exportItem.createdAt.toLocaleDateString()} at {exportItem.createdAt.toLocaleTimeString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(exportItem.status)}
                    <span className="text-sm capitalize">{exportItem.status}</span>
                  </div>

                  {exportItem.status === 'processing' && (
                    <div className="w-20">
                      <Progress value={exportItem.progress} />
                    </div>
                  )}

                  {exportItem.status === 'completed' && exportItem.downloadUrl && (
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};