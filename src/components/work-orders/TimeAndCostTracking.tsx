
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TimeEntries } from "./TimeEntries";
import { CostEntries } from "./CostEntries";

interface TimeAndCostTrackingProps {
  workOrderId: string;
  onTimeLogSubmit?: (timeData: any) => void;
  onCostEntrySubmit?: (costData: any) => void;
}

export const TimeAndCostTracking = ({ 
  workOrderId, 
  onTimeLogSubmit,
  onCostEntrySubmit 
}: TimeAndCostTrackingProps) => {
  const handleTimeSubmit = (timeData: any) => {
    console.log('Time entry submitted:', timeData);
    if (onTimeLogSubmit) {
      onTimeLogSubmit(timeData);
    }
  };

  const handleCostSubmit = (costData: any) => {
    console.log('Cost entry submitted:', costData);
    if (onCostEntrySubmit) {
      onCostEntrySubmit(costData);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="time" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="time">Time Entries</TabsTrigger>
          <TabsTrigger value="costs">Cost Entries</TabsTrigger>
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
    </div>
  );
};
