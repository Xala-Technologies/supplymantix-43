
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, Settings, Download } from "lucide-react";

const mockData = [
  { time: "00:00", value: 120 },
  { time: "04:00", value: 125 },
  { time: "08:00", value: 130 },
  { time: "12:00", value: 128 },
  { time: "16:00", value: 132 },
  { time: "20:00", value: 127 },
];

interface MeterDetailDialogProps {
  meter: any;
  onClose: () => void;
}

export const MeterDetailDialog = ({ meter, onClose }: MeterDetailDialogProps) => {
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            {meter.name}
            <Badge className={meter.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
              {meter.status}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-emerald-600">{meter.current_value}</div>
              <div className="text-sm text-muted-foreground">Current Value ({meter.unit})</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {meter.target_range ? `${meter.target_range.min}-${meter.target_range.max}` : "N/A"}
              </div>
              <div className="text-sm text-muted-foreground">Target Range</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">98.5%</div>
              <div className="text-sm text-muted-foreground">Uptime</div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">24-Hour Trend</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Configure
                </Button>
              </div>
            </div>
            
            <div className="h-64 bg-white border rounded-lg p-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    dot={{ fill: "#10b981" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Meter Information</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type:</span>
                  <span>{meter.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Asset:</span>
                  <span>{meter.asset_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Location:</span>
                  <span>{meter.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Reading:</span>
                  <span>{new Date(meter.last_reading).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Recent Alerts</h4>
              <div className="space-y-2">
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm">
                  <div className="font-medium text-yellow-800">Warning</div>
                  <div className="text-yellow-700">Value approaching upper limit</div>
                  <div className="text-yellow-600 text-xs">2 hours ago</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
