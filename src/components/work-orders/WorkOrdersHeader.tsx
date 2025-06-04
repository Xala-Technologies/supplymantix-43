
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, User, Calendar, MapPin, Tag, AlertTriangle, CircleCheck, Filter, Settings } from "lucide-react";

export const WorkOrdersHeader = () => {
  return (
    <div className="border-b bg-white p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-semibold text-gray-900">Work Orders</h1>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs">📋</Badge>
            <Badge variant="outline" className="text-xs">📊</Badge>
            <Badge variant="outline" className="text-xs">📅</Badge>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input 
              placeholder="Search Work Orders" 
              className="pl-10 w-64"
            />
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            New Work Order
          </Button>
        </div>
      </div>
      
      <div className="flex items-center space-x-4 text-sm">
        <div className="flex items-center space-x-2">
          <User className="h-4 w-4 text-gray-500" />
          <span className="text-gray-600">Assigned To</span>
        </div>
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          <span className="text-gray-600">Due Date</span>
        </div>
        <div className="flex items-center space-x-2">
          <MapPin className="h-4 w-4 text-gray-500" />
          <span className="text-gray-600">Location</span>
        </div>
        <div className="flex items-center space-x-2">
          <Tag className="h-4 w-4 text-gray-500" />
          <span className="text-gray-600">Category</span>
        </div>
        <div className="flex items-center space-x-2">
          <AlertTriangle className="h-4 w-4 text-gray-500" />
          <span className="text-gray-600">Priority</span>
        </div>
        <div className="flex items-center space-x-2">
          <CircleCheck className="h-4 w-4 text-gray-500" />
          <span className="text-gray-600">Status</span>
        </div>
        <div className="flex items-center space-x-2 ml-auto">
          <Filter className="h-4 w-4 text-gray-500" />
          <span className="text-blue-600">Add Filter</span>
        </div>
        <div className="flex items-center space-x-2">
          <Settings className="h-4 w-4 text-gray-500" />
          <span className="text-blue-600">My Filters</span>
        </div>
      </div>
    </div>
  );
};
