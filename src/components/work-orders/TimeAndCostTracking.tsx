
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TimeEntries } from "./TimeEntries";
import { CostEntries } from "./CostEntries";

interface TimeAndCostTrackingProps {
  workOrderId: string;
}

export const TimeAndCostTracking = ({ workOrderId }: TimeAndCostTrackingProps) => {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="time" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="time">Time Entries</TabsTrigger>
          <TabsTrigger value="costs">Cost Entries</TabsTrigger>
        </TabsList>
        <TabsContent value="time" className="mt-6">
          <TimeEntries workOrderId={workOrderId} />
        </TabsContent>
        <TabsContent value="costs" className="mt-6">
          <CostEntries workOrderId={workOrderId} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
