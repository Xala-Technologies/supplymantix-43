
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, DollarSign, TrendingUp, Calculator } from "lucide-react";
import { TimeEntries } from "./TimeEntries";
import { CostEntries } from "./CostEntries";

interface TimeAndCostTrackingProps {
  workOrderId: string;
}

export const TimeAndCostTracking = ({ workOrderId }: TimeAndCostTrackingProps) => {
  const handleTimeSubmit = (timeData: any) => {
    console.log('Time entry submitted:', timeData);
    // Here you would typically update the work order's total time
  };

  const handleCostSubmit = (costData: any) => {
    console.log('Cost entry submitted:', costData);
    // Here you would typically update the work order's total cost
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Time</p>
                <p className="text-2xl font-bold text-gray-900">3.5h</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Cost</p>
                <p className="text-2xl font-bold text-gray-900">$200.50</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Calculator className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Cost/Hour</p>
                <p className="text-2xl font-bold text-gray-900">$57.29</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Tracking */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Time & Cost Tracking
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="time" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="time" className="gap-2">
                <Clock className="w-4 h-4" />
                Time Entries
              </TabsTrigger>
              <TabsTrigger value="costs" className="gap-2">
                <DollarSign className="w-4 h-4" />
                Cost Entries
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="time" className="mt-6">
              <TimeEntries 
                workOrderId={workOrderId}
                onSubmit={handleTimeSubmit}
              />
            </TabsContent>
            
            <TabsContent value="costs" className="mt-6">
              <CostEntries 
                workOrderId={workOrderId}
                onSubmit={handleCostSubmit}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
