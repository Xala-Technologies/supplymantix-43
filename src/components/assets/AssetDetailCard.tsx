
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Calendar, Wrench, AlertTriangle, FileText, BarChart3, Settings, Edit, Trash2, Download } from "lucide-react";
import { toast } from "sonner";

interface AssetDetailCardProps {
  asset: {
    id: string;
    name: string;
    tag: string;
    status: string;
    location: string;
    category: string;
    criticality: string;
    manufacturer: string;
    model: string;
    serialNumber: string;
    installDate: string;
    lastMaintenance: string;
    nextMaintenance: string;
    workOrders: number;
    totalDowntime: string;
    specifications: Record<string, string>;
    documentation: Array<{ name: string; type: string; size: string }>;
  };
  onEdit?: () => void;
  onDelete?: () => void;
}

export const AssetDetailCard = ({ asset, onEdit, onDelete }: AssetDetailCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'online':
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'offline':
      case 'out_of_service':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'retired':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCriticalityColor = (criticality: string) => {
    switch (criticality.toLowerCase()) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const handleDownload = (fileName: string) => {
    try {
      // Create a sample PDF content (in a real app, you'd fetch the actual file)
      const sampleContent = `Sample ${fileName} for ${asset.name}`;
      const blob = new Blob([sampleContent], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      // Create a temporary link and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the URL object
      URL.revokeObjectURL(url);
      
      toast.success(`${fileName} downloaded successfully`);
    } catch (error) {
      console.error('Download failed:', error);
      toast.error(`Failed to download ${fileName}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-gray-900">{asset.name}</h1>
            <div className={`w-3 h-3 rounded-full ${getCriticalityColor(asset.criticality)}`} />
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>#{asset.tag}</span>
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {asset.location}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={`border ${getStatusColor(asset.status)}`}>
            {asset.status}
          </Badge>
          {onEdit && (
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          )}
          {onDelete && (
            <Button variant="outline" size="sm" onClick={onDelete} className="text-red-600 hover:text-red-700">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Wrench className="w-4 h-4 text-blue-600" />
              <div>
                <p className="text-xs text-gray-600">Open Work Orders</p>
                <p className="text-lg font-semibold">{asset.workOrders}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <div>
                <p className="text-xs text-gray-600">Total Downtime</p>
                <p className="text-lg font-semibold">{asset.totalDowntime}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-green-600" />
              <div>
                <p className="text-xs text-gray-600">Last Maintenance</p>
                <p className="text-lg font-semibold">{asset.lastMaintenance}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-600" />
              <div>
                <p className="text-xs text-gray-600">Next Maintenance</p>
                <p className="text-lg font-semibold">{asset.nextMaintenance}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Information */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          <TabsTrigger value="documentation">Documentation</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Asset Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Manufacturer</p>
                    <p className="font-medium">{asset.manufacturer}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Model</p>
                    <p className="font-medium">{asset.model}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Serial Number</p>
                    <p className="font-medium">{asset.serialNumber}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Install Date</p>
                    <p className="font-medium">{asset.installDate}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Category</p>
                    <p className="font-medium">{asset.category}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Criticality</p>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${getCriticalityColor(asset.criticality)}`} />
                      <span className="font-medium">{asset.criticality}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Specifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(asset.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between text-sm">
                    <span className="text-gray-600 capitalize">{key}</span>
                    <span className="font-medium">{value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="maintenance" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Maintenance History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Scheduled Maintenance</p>
                    <p className="text-sm text-gray-600">Last performed: {asset.lastMaintenance}</p>
                  </div>
                  <Badge variant="outline">Completed</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Preventive Maintenance</p>
                    <p className="text-sm text-gray-600">Next scheduled: {asset.nextMaintenance}</p>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">Pending</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="documentation" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Documentation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {asset.documentation.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-sm text-gray-600">{doc.type} • {doc.size}</p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleDownload(doc.name)}
                      className="flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Uptime</span>
                      <span>98.5%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '98.5%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Efficiency</span>
                      <span>94.2%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '94.2%' }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cost Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Maintenance Cost (YTD)</span>
                    <span className="font-medium">$12,450</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Parts Cost (YTD)</span>
                    <span className="font-medium">$8,230</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Downtime Cost (YTD)</span>
                    <span className="font-medium">$3,120</span>
                  </div>
                  <hr />
                  <div className="flex justify-between font-semibold">
                    <span>Total Cost (YTD)</span>
                    <span>$23,800</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
