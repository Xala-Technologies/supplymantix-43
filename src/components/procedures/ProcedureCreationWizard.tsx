
import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FireExtinguisher, ArrowRight, ArrowLeft } from 'lucide-react';
import { ProcedureField } from '@/lib/database/procedures-enhanced';
import { UnifiedProcedureBuilder } from './UnifiedProcedureBuilder';

interface ProcedureCreationWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: {
    title: string;
    description: string;
    category: string;
    tags: string[];
    is_global: boolean;
    fields: ProcedureField[];
  }) => void;
  isLoading?: boolean;
}

const CATEGORIES = [
  { value: 'Inspection', label: 'Inspection', color: 'bg-blue-500' },
  { value: 'Safety', label: 'Safety', color: 'bg-red-500' },
  { value: 'Calibration', label: 'Calibration', color: 'bg-purple-500' },
  { value: 'Reactive Maintenance', label: 'Reactive Maintenance', color: 'bg-orange-500' },
  { value: 'Preventive Maintenance', label: 'Preventive Maintenance', color: 'bg-green-500' },
  { value: 'Quality Control', label: 'Quality Control', color: 'bg-indigo-500' },
  { value: 'Training', label: 'Training', color: 'bg-yellow-500' },
  { value: 'Other', label: 'Other', color: 'bg-gray-500' }
];

export const ProcedureCreationWizard: React.FC<ProcedureCreationWizardProps> = ({
  open,
  onOpenChange,
  onSave,
  isLoading = false
}) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Inspection',
    tags: [] as string[],
    is_global: false,
    fields: [] as ProcedureField[]
  });

  const handleNext = () => {
    if (step === 1 && formData.title.trim()) {
      setStep(2);
    }
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
    }
  };

  const handleClose = () => {
    setStep(1);
    setFormData({
      title: '',
      description: '',
      category: 'Inspection',
      tags: [],
      is_global: false,
      fields: []
    });
    onOpenChange(false);
  };

  const handleSave = (data: any) => {
    console.log('Saving new procedure:', data);
    onSave(data);
    handleClose();
  };

  const canProceed = step === 1 && formData.title.trim().length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={step === 1 ? "max-w-md" : "max-w-none w-screen h-screen m-0 p-0 rounded-none"}>
        {step === 1 ? (
          <div className="p-8 text-center">
            <div className="mb-8">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
                <FireExtinguisher className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Create New Procedure
              </h2>
              <p className="text-gray-600">
                Let's set up the basic information for your procedure
              </p>
            </div>

            <div className="space-y-6 text-left">
              <div>
                <Label htmlFor="title" className="text-base font-medium text-gray-700 mb-2 block">
                  Procedure Name *
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Fire Extinguisher Inspection"
                  className="text-base py-3 px-4 border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-base font-medium text-gray-700 mb-2 block">
                  Description <span className="text-sm text-gray-500 font-normal">(optional)</span>
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Routine fire extinguisher inspection to ensure operability and compliance."
                  className="text-base py-3 px-4 border-2 border-gray-200 focus:border-blue-500 rounded-lg resize-none"
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="category" className="text-base font-medium text-gray-700 mb-2 block">
                  Category
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger className="text-base py-3 px-4 border-2 border-gray-200 focus:border-blue-500 rounded-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(category => (
                      <SelectItem key={category.value} value={category.value}>
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${category.color}`} />
                          {category.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={handleClose}
                className="px-6 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </Button>
              <Button
                onClick={handleNext}
                disabled={!canProceed}
                className="px-8 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col">
            <div className="bg-white border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleBack}
                    className="gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </Button>
                  <div className="h-6 w-px bg-gray-300" />
                  <div>
                    <h1 className="text-xl font-semibold text-gray-900">
                      {formData.title}
                    </h1>
                    <p className="text-sm text-gray-600">
                      Configure fields and settings for your procedure
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex-1 overflow-hidden">
              <UnifiedProcedureBuilder
                initialData={formData}
                onSave={handleSave}
                onCancel={handleBack}
                isLoading={isLoading}
                mode="create"
              />
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
