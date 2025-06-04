
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, User, Calendar, MapPin, Tag, AlertTriangle, CircleCheck, Filter, Settings } from "lucide-react";

export const WorkOrdersHeader = () => {
  return (
    <div className="border-b bg-white shadow-sm">
      <div className="p-4 lg:p-6">
        {/* Top row */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4 lg:mb-6">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Work Orders</h1>
            <div className="hidden sm:flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">📋</Badge>
              <Badge variant="outline" className="text-xs">📊</Badge>
              <Badge variant="outline" className="text-xs">📅</Badge>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input 
                placeholder="Search Work Orders" 
                className="pl-10 w-full sm:w-64"
              />
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700 whitespace-nowrap">
              <Plus className="h-4 w-4 mr-2" />
              New Work Order
            </Button>
          </div>
        </div>
        
        {/* Filter row - responsive */}
        <div className="flex flex-wrap items-center gap-3 lg:gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4 text-gray-500" />
            <span className="text-gray-600 hidden sm:inline">Assigned To</span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-gray-600 hidden sm:inline">Due Date</span>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-gray-500" />
            <span className="text-gray-600 hidden sm:inline">Location</span>
          </div>
          <div className="flex items-center space-x-2">
            <Tag className="h-4 w-4 text-gray-500" />
            <span className="text-gray-600 hidden sm:inline">Category</span>
          </div>
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4 text-gray-500" />
            <span className="text-gray-600 hidden sm:inline">Priority</span>
          </div>
          <div className="flex items-center space-x-2">
            <CircleCheck className="h-4 w-4 text-gray-500" />
            <span className="text-gray-600 hidden sm:inline">Status</span>
          </div>
          
          {/* Filter controls */}
          <div className="flex items-center space-x-4 ml-auto">
            <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors">
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline">Add Filter</span>
            </button>
            <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">My Filters</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
