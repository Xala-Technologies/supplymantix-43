import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface AdvancedPartFormProps {
  onSuccess: () => void;
  part?: any; // For edit mode, can be typed later
}

export const AdvancedPartForm: React.FC<AdvancedPartFormProps> = ({ onSuccess, part }) => {
  // Placeholder state for all fields
  // In a real implementation, use react-hook-form or Formik for validation and state
  return (
    <form className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow space-y-6">
      <h2 className="text-2xl font-bold mb-4">{part ? 'Edit Part' : 'New Part'}</h2>
      <div>
        <Label htmlFor="name">Part Name</Label>
        <Input id="name" placeholder="Enter Part Name" defaultValue={part?.name} required />
      </div>
      <div>
        <Label>Pictures</Label>
        <div className="border-2 border-dashed border-blue-200 rounded-lg p-6 text-center text-blue-500 bg-blue-50 cursor-pointer">
          <span className="block mb-2">Add or drag pictures</span>
          <span className="text-xs text-gray-400">(Not implemented)</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="unit_cost">Unit Cost</Label>
          <Input id="unit_cost" type="number" min={0} step={0.01} placeholder="0" defaultValue={part?.unit_cost} />
        </div>
        <div>
          <Label htmlFor="barcode">QR Code/Barcode</Label>
          <Input id="barcode" placeholder="QR Code/Barcode" defaultValue={part?.barcode} />
          <span className="text-xs text-blue-600 cursor-pointer">or Generate Code</span>
        </div>
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" placeholder="Add a description" defaultValue={part?.description} />
      </div>
      <div>
        <Label htmlFor="part_types">Part Types</Label>
        <Input id="part_types" placeholder="Start typing..." />
      </div>
      <div className="grid grid-cols-4 gap-4 items-end">
        <div className="col-span-2">
          <Label htmlFor="location">Location</Label>
          <Input id="location" placeholder="General" defaultValue={part?.location} />
        </div>
        <div>
          <Label htmlFor="area">Area</Label>
          <Input id="area" placeholder="" />
        </div>
        <div>
          <Label htmlFor="units_in_stock">Units in Stock</Label>
          <Input id="units_in_stock" type="number" min={0} defaultValue={part?.quantity} />
        </div>
        <div>
          <Label htmlFor="min_in_stock">Minimum in Stock</Label>
          <Input id="min_in_stock" type="number" min={0} defaultValue={part?.min_quantity} />
        </div>
        <div className="col-span-4">
          <span className="text-xs text-blue-600 cursor-pointer">+ Add location</span>
        </div>
      </div>
      <div>
        <Label htmlFor="assets">Assets</Label>
        <Input id="assets" placeholder="Start typing..." />
      </div>
      <div>
        <Label htmlFor="teams">Teams in Charge</Label>
        <Input id="teams" placeholder="Start typing..." />
      </div>
      <div>
        <Label htmlFor="vendors">Vendors</Label>
        <Input id="vendors" placeholder="Start typing..." />
      </div>
      <div>
        <Label htmlFor="files">Files</Label>
        <Button variant="outline" type="button">Attach files</Button>
      </div>
      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onSuccess}>Cancel</Button>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">{part ? 'Save' : 'Create'}</Button>
      </div>
    </form>
  );
}; 