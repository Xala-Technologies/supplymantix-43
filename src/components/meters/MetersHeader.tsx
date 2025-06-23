
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, BarChart3, TrendingUp, Filter, Activity, Zap, Settings, AlertTriangle } from "lucide-react";

interface MetersHeaderProps {
  onCreateMeter: () => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  typeFilter: string;
  onTypeFilterChange: (value: string) => void;
  statusFilter?: string;
  onStatusFilterChange?: (value: string) => void;
}

export const MetersHeader = ({
  onCreateMeter,
  searchQuery,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
  statusFilter = "all",
  onStatusFilterChange,
}: MetersHeaderProps) => {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/10 via-teal-600/10 to-blue-600/10 rounded-3xl"></div>
        <Card className="relative border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
                    <BarChart3 className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-400 rounded-full animate-pulse"></div>
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    Meters & Monitoring
                  </h1>
                  <p className="text-lg text-gray-600 mt-2">
                    Track and monitor asset performance metrics in real-time
                  </p>
                  <div className="flex items-center gap-4 mt-4">
                    <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 border-emerald-200">
                      <Activity className="h-3 w-3 mr-1" />
                      Real-time Monitoring
                    </Badge>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Analytics Ready
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Button 
                  variant="outline" 
                  className="gap-2 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700 transition-all duration-200"
                >
                  <TrendingUp className="h-4 w-4" />
                  Analytics Dashboard
                </Button>
                <Button 
                  onClick={onCreateMeter} 
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 gap-2 shadow-lg hover:shadow-xl transition-all duration-200 px-6"
                  size="lg"
                >
                  <Plus className="h-5 w-5" />
                  Add New Meter
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Search and Filters */}
      <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search meters, assets, or locations..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-12 h-12 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 bg-white/80 backdrop-blur-sm"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                <Filter className="h-4 w-4" />
                Filters:
              </div>
              
              <Select value={typeFilter} onValueChange={onTypeFilterChange}>
                <SelectTrigger className="w-48 h-12 bg-white/80 backdrop-blur-sm border-gray-200">
                  <div className="flex items-center gap-2">
                    <Settings className="h-4 w-4 text-gray-500" />
                    <SelectValue placeholder="Type" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="manual">
                    <div className="flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      Manual Reading
                    </div>
                  </SelectItem>
                  <SelectItem value="automated">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4" />
                      Automated
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>

              {onStatusFilterChange && (
                <Select value={statusFilter} onValueChange={onStatusFilterChange}>
                  <SelectTrigger className="w-48 h-12 bg-white/80 backdrop-blur-sm border-gray-200">
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-gray-500" />
                      <SelectValue placeholder="Status" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Active
                      </div>
                    </SelectItem>
                    <SelectItem value="warning">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        Warning
                      </div>
                    </SelectItem>
                    <SelectItem value="critical">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        Critical
                      </div>
                    </SelectItem>
                    <SelectItem value="inactive">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        Inactive
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
