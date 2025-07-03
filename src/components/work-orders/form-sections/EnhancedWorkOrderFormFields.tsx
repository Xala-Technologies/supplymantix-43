import { useState } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Paperclip, Plus, X, Search } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { UseFormReturn } from "react-hook-form";
import { Badge } from "@/components/ui/badge";
import { ProcedureSelectionDialog } from "../ProcedureSelectionDialog";

interface Asset {
  id: string;
  name: string;
  location?: string;
}

interface Location {
  id: string;
  name: string;
}

interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
}

interface EnhancedWorkOrderFormFieldsProps {
  form: UseFormReturn<any>;
  users?: User[];
  assets?: Asset[];
  locations?: Location[];
}

export const EnhancedWorkOrderFormFields = ({ 
  form, 
  users = [], 
  assets = [], 
  locations = [] 
}: EnhancedWorkOrderFormFieldsProps) => {
  const [showProcedureDialog, setShowProcedureDialog] = useState(false);
  const [selectedProcedures, setSelectedProcedures] = useState<string[]>([]);
  const [attachedFiles, setAttachedFiles] = useState<string[]>([]);
  const [selectedParts, setSelectedParts] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedVendors, setSelectedVendors] = useState<string[]>([]);

  const handleProcedureSelect = (procedure: any) => {
    setSelectedProcedures(prev => [...prev, procedure.id]);
    setShowProcedureDialog(false);
  };

  const removeProcedure = (procedureId: string) => {
    setSelectedProcedures(prev => prev.filter(id => id !== procedureId));
  };

  return (
    <div className="space-y-6">
      {/* Title Field */}
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input 
                placeholder="Start typing..." 
                className="text-lg font-medium border-0 border-b border-gray-200 rounded-none px-0 focus:border-blue-500"
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Description */}
      <div className="space-y-2">
        <FormLabel className="text-sm font-medium text-gray-700">Description</FormLabel>
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea 
                  placeholder="Add a description"
                  className="min-h-[80px] resize-none"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Procedure Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <FormLabel className="text-sm font-medium text-gray-700">Procedure</FormLabel>
        </div>
        
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-center mb-4">
            <div className="text-blue-500">📋</div>
          </div>
          <p className="text-sm text-gray-600 text-center mb-4">
            Create or attach new Form, Procedure or Checklist
          </p>
          <div className="flex justify-center">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowProcedureDialog(true)}
              className="border-blue-200 text-blue-600 hover:bg-blue-50"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Procedure
            </Button>
          </div>
          
          {/* Selected Procedures */}
          {selectedProcedures.length > 0 && (
            <div className="mt-4 space-y-2">
              {selectedProcedures.map((procedureId) => (
                <div key={procedureId} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                  <span className="text-sm">Procedure {procedureId}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeProcedure(procedureId)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Assign To */}
          <div className="space-y-2">
            <FormLabel className="text-sm font-medium text-gray-700">Assign to</FormLabel>
            <FormField
              control={form.control}
              name="assignedTo"
              render={({ field }) => (
                <FormItem>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="flex items-center gap-2">
                        <div className="flex items-center gap-2 flex-1">
                          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
                            {field.value ? 'ZB' : '👤'}
                          </div>
                          <SelectValue placeholder="Select assignee" />
                        </div>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="unassigned">Unassigned</SelectItem>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
                              {user.first_name?.[0] || user.email[0].toUpperCase()}
                            </div>
                            {user.first_name && user.last_name 
                              ? `${user.first_name} ${user.last_name}`
                              : user.email
                            }
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Due Date */}
          <div className="space-y-2">
            <FormLabel className="text-sm font-medium text-gray-700">Due Date & Schedule</FormLabel>
            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? format(field.value, "MM/dd/yyyy") : "mm/dd/yyyy"}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  <Button
                    type="button"
                    variant="link"
                    className="text-blue-600 text-sm p-0 h-auto"
                  >
                    Add repeating schedule
                  </Button>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Location */}
          <div className="space-y-2">
            <FormLabel className="text-sm font-medium text-gray-700">Location</FormLabel>
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">No Location</SelectItem>
                      {locations.map((location) => (
                        <SelectItem key={location.id} value={location.id}>
                          {location.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Asset */}
          <div className="space-y-2">
            <FormLabel className="text-sm font-medium text-gray-700">Asset</FormLabel>
            <FormField
              control={form.control}
              name="asset"
              render={({ field }) => (
                <FormItem>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="pl-10">
                          <SelectValue placeholder="Start typing..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">No Asset</SelectItem>
                        {assets.map((asset) => (
                          <SelectItem key={asset.id} value={asset.id}>
                            {asset.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Files */}
          <div className="space-y-2">
            <FormLabel className="text-sm font-medium text-gray-700">Files</FormLabel>
            <Button
              type="button"
              variant="outline"
              className="w-full justify-center border-dashed"
            >
              <Paperclip className="h-4 w-4 mr-2" />
              Attach files
            </Button>
          </div>

          {/* Parts */}
          <div className="space-y-2">
            <FormLabel className="text-sm font-medium text-gray-700">Parts</FormLabel>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input placeholder="Start typing..." className="pl-10" />
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-2">
            <FormLabel className="text-sm font-medium text-gray-700">Categories</FormLabel>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input placeholder="Start typing..." className="pl-10" />
            </div>
          </div>

          {/* Vendors */}
          <div className="space-y-2">
            <FormLabel className="text-sm font-medium text-gray-700">Vendors</FormLabel>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input placeholder="Start typing..." className="pl-10" />
            </div>
          </div>
        </div>
      </div>

      {/* Procedure Selection Dialog */}
      <ProcedureSelectionDialog
        open={showProcedureDialog}
        onOpenChange={setShowProcedureDialog}
        onSelect={handleProcedureSelect}
        selectedProcedures={selectedProcedures}
      />
    </div>
  );
};