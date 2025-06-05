
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, FileBarChart, Download, Settings } from "lucide-react";

interface ReportingHeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const ReportingHeader = ({ activeTab, onTabChange }: ReportingHeaderProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            Reports & Analytics
          </h1>
          <p className="text-muted-foreground">
            Gain insights into your maintenance operations
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export Data
          </Button>
          <Button variant="outline" className="gap-2">
            <Settings className="h-4 w-4" />
            Configure
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={onTabChange}>
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="dashboard" className="gap-2">
            <FileBarChart className="h-4 w-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="builder" className="gap-2">
            <Settings className="h-4 w-4" />
            Report Builder
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};
