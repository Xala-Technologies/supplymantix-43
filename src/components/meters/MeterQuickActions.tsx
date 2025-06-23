
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useMeters } from "@/hooks/useMeters";
import { MeterReadingForm } from "./MeterReadingForm";
import { 
  Plus, 
  AlertTriangle, 
  Activity, 
  Clock, 
  BarChart3,
  Zap
} from "lucide-react";

interface MeterQuickActionsProps {
  onCreateMeter: () => void;
}

export const MeterQuickActions = ({ onCreateMeter }: MeterQuickActionsProps) => {
  const [showQuickReading, setShowQuickReading] = useState(false);
  const [selectedMeter, setSelectedMeter] = useState<any>(null);
  
  const { data: meters } = useMeters();

  const criticalMeters = meters?.filter(m => m.status === 'critical') || [];
  const warningMeters = meters?.filter(m => m.status === 'warning') || [];
  const overdueReadings = meters?.filter(m => {
    if (!m.last_reading_at || m.reading_frequency === 'none') return false;
    const lastReading = new Date(m.last_reading_at);
    const now = new Date();
    const hoursDiff = (now.getTime() - lastReading.getTime()) / (1000 * 60 * 60);
    
    switch (m.reading_frequency) {
      case 'hour': return hoursDiff > 1;
      case 'day': return hoursDiff > 24;
      case 'week': return hoursDiff > 168;
      case 'month': return hoursDiff > 720;
      default: return false;
    }
  }) || [];

  const handleQuickReading = (meter: any) => {
    setSelectedMeter(meter);
    setShowQuickReading(true);
  };

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button onClick={onCreateMeter} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              New Meter
            </Button>
            <Button variant="outline">
              <BarChart3 className="h-4 w-4 mr-2" />
              View Analytics
            </Button>
            <Button variant="outline">
              <Activity className="h-4 w-4 mr-2" />
              System Health
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Alerts */}
      {(criticalMeters.length > 0 || warningMeters.length > 0) && (
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="h-5 w-5" />
              Attention Required
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {criticalMeters.slice(0, 3).map(meter => (
              <div key={meter.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div>
                  <p className="font-medium text-red-900">{meter.name}</p>
                  <p className="text-sm text-red-700">Critical status - Immediate action required</p>
                </div>
                <Badge variant="destructive">Critical</Badge>
              </div>
            ))}
            
            {warningMet Ders.slice(0, 2).map(meter => (
              <div key={meter.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div>
                  <p className="font-medium text-yellow-900">{meter.name}</p>
                  <p className="text-sm text-yellow-700">Warning status - Needs attention</p>
                </div>
                <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Overdue Readings */}
      {overdueReadings.length > 0 && (
        <Card className="border-orange-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-700">
              <Clock className="h-5 w-5" />
              Overdue Readings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {overdueReadings.slice(0, 3).map(meter => (
              <div key={meter.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <div>
                  <p className="font-medium text-orange-900">{meter.name}</p>
                  <p className="text-sm text-orange-700">
                    Reading overdue - Last: {new Date(meter.last_reading_at).toLocaleDateString()}
                  </p>
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleQuickReading(meter)}
                >
                  Record Reading
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {showQuickReading && selectedMeter && (
        <MeterReadingForm
          meterId={selectedMeter.id}
          meterName={selectedMeter.name}
          unit={selectedMeter.unit}
          onClose={() => {
            setShowQuickReading(false);
            setSelectedMeter(null);
          }}
        />
      )}
    </div>
  );
};
