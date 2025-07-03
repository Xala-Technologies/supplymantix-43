import { useState, useEffect } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Paperclip, Plus, X, Search, Camera, Upload, FileImage, Eye, Edit, Trash2 } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { ProcedureSelectionDialog } from "../ProcedureSelectionDialog";
import { useNavigate } from "react-router-dom";
import { TitleField } from "../form-fields/TitleField";
import { PriorityField } from "../form-fields/PriorityField";
import { DateFields } from "../form-fields/DateFields";
import { ImageUploadSection } from "./ImageUploadSection";
import { ProcedureCard } from "./ProcedureCard";
import { ProcedureSelectionDialogEnhanced } from "./ProcedureSelectionDialogEnhanced";

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
  onDialogClose?: () => void;
}

export const EnhancedWorkOrderFormFields = ({ 
  form, 
  users = [], 
  assets = [], 
  locations = [],
  onDialogClose
}: EnhancedWorkOrderFormFieldsProps) => {
  const navigate = useNavigate();
  const [showProcedureDialog, setShowProcedureDialog] = useState(false);
  const [selectedProcedures, setSelectedProcedures] = useState<any[]>([]);
  const [assetSearch, setAssetSearch] = useState("");
  const [partsSearch, setPartsSearch] = useState("");
  const [categoriesSearch, setCategoriesSearch] = useState("");
  const [vendorsSearch, setVendorsSearch] = useState("");

  // Mock procedure data based on the reference images
  const mockProcedures = [
    {
      id: "1",
      title: "Første procedure",
      description: "Important checkboxes and greetings procedure",
      category: "Maintenance",
      estimatedDuration: 15,
      steps: [
        {
          id: "1",
          title: "Viktige checkboxes",
          type: "checkbox",
          required: true,
          options: ["A", "B", "C"]
        },
        {
          id: "2", 
          title: "Greetings",
          type: "checkbox",
          required: false,
          options: ["Hi", "Hey", "Hei", "Salam"]
        }
      ]
    }
  ];

  // Handle return from procedures page
  useEffect(() => {
    const handleReturnFromProcedures = () => {
      const returnAction = localStorage.getItem('workOrderReturnAction');
      if (returnAction === 'procedure-created') {
        localStorage.removeItem('workOrderReturnAction');
        localStorage.removeItem('workOrderReturnPath');
        // Refresh the procedure dialog to show newly created procedures
        setShowProcedureDialog(true);
      }
    };

    handleReturnFromProcedures();
  }, []);

  const handleProcedureSelect = (procedure: any) => {
    if (!selectedProcedures.find(p => p.id === procedure.id)) {
      setSelectedProcedures(prev => [...prev, procedure]);
    }
    setShowProcedureDialog(false);
  };

  const removeProcedure = (procedureId: string) => {
    setSelectedProcedures(prev => prev.filter(p => p.id !== procedureId));
  };

  const handleEditProcedure = (procedure: any) => {
    // Implementation for editing procedure
    console.log("Edit procedure:", procedure);
  };

  const handleCreateAndReturn = (type: 'asset' | 'parts' | 'categories' | 'vendors', searchValue: string) => {
    // Store the search value and return path in localStorage
    localStorage.setItem('workOrderReturnData', JSON.stringify({
      formData: form.getValues(),
      searchValue,
      fieldType: type
    }));
    
    // Close the current dialog
    onDialogClose?.();
    
    // Navigate to the appropriate page
    switch (type) {
      case 'asset':
        navigate('/dashboard/assets');
        break;
      case 'parts':
        navigate('/dashboard/inventory');
        break;
      case 'categories':
        navigate('/dashboard/categories');
        break;
      case 'vendors':
        navigate('/dashboard/vendors');
        break;
    }
  };

  return (
    <div className="space-y-6">
      <TitleField form={form} />
      
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
                  placeholder="Describe the work to be performed..."
                  className="min-h-[80px] resize-none"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      {/* Enhanced Procedure Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <FormLabel className="text-lg font-semibold text-gray-900">Procedure</FormLabel>
        </div>
        
        {/* Selected Procedures */}
        {selectedProcedures.length > 0 ? (
          <div className="space-y-3">
            {selectedProcedures.map((procedure) => (
              <ProcedureCard
                key={procedure.id}
                procedure={procedure}
                onEdit={handleEditProcedure}
                onDelete={removeProcedure}
                onPreview={(proc) => console.log("Preview:", proc)}
              />
            ))}
            
            {/* Add Another Procedure Button */}
            <Button
              type="button"
              variant="ghost"
              onClick={() => setShowProcedureDialog(true)}
              className="w-full justify-start text-blue-600 hover:text-blue-700 hover:bg-blue-50 border border-dashed border-blue-200 hover:border-blue-300 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Another Procedure
            </Button>
          </div>
        ) : (
          /* Empty State */
          <div className="border border-gray-200 rounded-lg p-6">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="p-3 bg-blue-50 rounded-full">
                  <div className="text-2xl">📋</div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  No procedures added
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Create or attach new Form, Procedure or Checklist
                </p>
              </div>
              <div className="flex justify-center">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowProcedureDialog(true)}
                  className="border-blue-200 text-blue-600 hover:bg-blue-50"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Procedure
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

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
                    <SelectValue placeholder="Start typing..." />
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
              <div className="space-y-2">
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
                <Button
                  type="button"
                  variant="link"
                  className="text-blue-600 text-sm p-0 h-auto"
                  onClick={() => handleCreateAndReturn('asset', assetSearch)}
                >
                  + Add multiple assets
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Assign to */}
      <div className="space-y-2">
        <FormLabel className="text-sm font-medium text-gray-700">Assign to</FormLabel>
        <FormField
          control={form.control}
          name="assignedTo"
          render={({ field }) => (
            <FormItem>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Type name, email or phone number" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.first_name && user.last_name 
                        ? `${user.first_name} ${user.last_name}`
                        : user.email
                      }
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Estimated Time */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <FormLabel className="text-sm font-medium text-gray-700">Estimated Time</FormLabel>
          <div className="space-y-1">
            <FormLabel className="text-xs text-gray-500">Hours</FormLabel>
            <FormField
              control={form.control}
              name="estimatedHours"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="number" placeholder="1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="space-y-2">
          <FormLabel className="text-sm font-medium text-gray-700">&nbsp;</FormLabel>
          <div className="space-y-1">
            <FormLabel className="text-xs text-gray-500">Minutes</FormLabel>
            <FormField
              control={form.control}
              name="estimatedMinutes"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </div>

      <DateFields form={form} />

      {/* Recurrence */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <FormLabel className="text-sm font-medium text-gray-700">Recurrence</FormLabel>
          <FormField
            control={form.control}
            name="recurrence"
            render={({ field }) => (
              <FormItem>
                <Select onValueChange={field.onChange} value={field.value} defaultValue="none">
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Does not repeat" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="none">Does not repeat</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="space-y-2">
          <FormLabel className="text-sm font-medium text-gray-700">Work Type</FormLabel>
          <FormField
            control={form.control}
            name="workType"
            render={({ field }) => (
              <FormItem>
                <Select onValueChange={field.onChange} value={field.value} defaultValue="reactive">
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Reactive" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="reactive">Reactive</SelectItem>
                    <SelectItem value="preventive">Preventive</SelectItem>
                    <SelectItem value="predictive">Predictive</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <PriorityField form={form} />

      {/* Enhanced File Upload Section */}
      <div className="space-y-3">
        <FormLabel className="text-sm font-medium text-gray-700">
          <FileImage className="h-4 w-4 inline mr-2" />
          Photos & Attachments
        </FormLabel>
        <ImageUploadSection
          onFilesChange={(files) => {
            // Update form with uploaded files
            form.setValue('attachments', files);
          }}
          maxFiles={20}
          maxFileSize={25}
        />
      </div>

      {/* Parts */}
      <div className="space-y-2">
        <FormLabel className="text-sm font-medium text-gray-700">Parts</FormLabel>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input 
            placeholder="Start typing..." 
            className="pl-10"
            value={partsSearch}
            onChange={(e) => setPartsSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && partsSearch.trim()) {
                e.preventDefault();
                handleCreateAndReturn('parts', partsSearch);
              }
            }}
          />
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-2">
        <FormLabel className="text-sm font-medium text-gray-700">Categories</FormLabel>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input 
            placeholder="Start typing..." 
            className="pl-10"
            value={categoriesSearch}
            onChange={(e) => setCategoriesSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && categoriesSearch.trim()) {
                e.preventDefault();
                handleCreateAndReturn('categories', categoriesSearch);
              }
            }}
          />
        </div>
      </div>

      {/* Vendors */}
      <div className="space-y-2">
        <FormLabel className="text-sm font-medium text-gray-700">Vendors</FormLabel>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input 
            placeholder="Start typing..." 
            className="pl-10"
            value={vendorsSearch}
            onChange={(e) => setVendorsSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && vendorsSearch.trim()) {
                e.preventDefault();
                handleCreateAndReturn('vendors', vendorsSearch);
              }
            }}
          />
        </div>
      </div>

      {/* Enhanced Procedure Selection Dialog */}
      <ProcedureSelectionDialogEnhanced
        open={showProcedureDialog}
        onOpenChange={setShowProcedureDialog}
        onSelectProcedure={handleProcedureSelect}
        selectedProcedures={selectedProcedures}
      />
    </div>
  );
};