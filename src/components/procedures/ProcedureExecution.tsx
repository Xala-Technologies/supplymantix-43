import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, AlertCircle, ArrowLeft, ArrowRight, Save, Pause, FileText } from "lucide-react";
import { ProcedureField, ProcedureWithFields } from "@/lib/database/procedures-enhanced";
import { ExecutionFieldRenderer } from "./ExecutionFieldRenderer";
import { useSubmitExecution } from "@/hooks/useProceduresEnhanced";
import { toast } from "sonner";

interface ProcedureExecutionProps {
  procedure: ProcedureWithFields;
  executionId?: string;
  workOrderId?: string;
  onComplete: (answers: any, score: number) => void;
  onCancel: () => void;
}

interface FieldAnswer {
  fieldId: string;
  label: string;
  value: any;
  fieldType: string;
}

export const ProcedureExecution: React.FC<ProcedureExecutionProps> = ({
  procedure,
  executionId,
  workOrderId,
  onComplete,
  onCancel
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSummary, setShowSummary] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  
  const submitExecution = useSubmitExecution();
  const fields = procedure.fields || [];
  const totalSteps = fields.length;
  const progress = totalSteps > 0 ? ((currentStep + 1) / totalSteps) * 100 : 100;
  const currentField = fields[currentStep];

  // Auto-save functionality
  const autoSave = () => {
    // Implementation for auto-saving answers
    console.log('Auto-saving answers:', answers);
    toast.success('Progress saved automatically');
  };

  function validateField(field: ProcedureField, value: any): string | null {
    if (field.is_required && (!value || (Array.isArray(value) && value.length === 0) || value === '')) {
      return `${field.label} is required`;
    }
    if (field.field_type === 'number' && value && isNaN(Number(value))) {
      return `${field.label} must be a valid number`;
    }
    if (field.field_type === 'date' && value && isNaN(Date.parse(value))) {
      return `${field.label} must be a valid date`;
    }
    return null;
  }

  function handleAnswerChange(fieldId: string, value: any) {
    setAnswers(prev => ({
      ...prev,
      [fieldId]: value
    }));
    setErrors(prev => ({
      ...prev,
      [fieldId]: ''
    }));
    // Auto-save after a short delay
    setTimeout(autoSave, 1000);
  }

  function goToNextStep() {
    if (!currentField) return;
    
    const fieldId = currentField.id || `field_${currentStep}`;
    const value = answers[fieldId];
    const error = validateField(currentField, value);
    
    if (error) {
      setErrors(prev => ({
        ...prev,
        [fieldId]: error
      }));
      return;
    }

    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowSummary(true);
    }
  }

  function goToPreviousStep() {
    if (showSummary) {
      setShowSummary(false);
      return;
    }
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }

  function jumpToStep(stepIndex: number) {
    if (stepIndex >= 0 && stepIndex < totalSteps) {
      setCurrentStep(stepIndex);
      setShowSummary(false);
    }
  }

  function handlePause() {
    setIsPaused(true);
    autoSave();
    toast.success('Execution paused. You can resume later.');
    onCancel();
  }

  function calculateScore(): number {
    const requiredFields = fields.filter(f => f.is_required);
    if (requiredFields.length === 0) return 100;

    const completedRequired = requiredFields.filter(field => {
      const fieldId = field.id || `field_${fields.indexOf(field)}`;
      const value = answers[fieldId];
      return value !== undefined && value !== null && value !== '' && 
             (!Array.isArray(value) || value.length > 0);
    }).length;

    return Math.round(completedRequired / requiredFields.length * 100);
  }

  function getFormattedAnswers(): FieldAnswer[] {
    return fields.map((field, index) => {
      const fieldId = field.id || `field_${index}`;
      const value = answers[fieldId];
      return {
        fieldId,
        label: field.label,
        value,
        fieldType: field.field_type
      };
    }).filter(answer => answer.value !== undefined && answer.value !== null && answer.value !== '');
  }

  function formatAnswerValue(answer: FieldAnswer): string {
    if (answer.value === null || answer.value === undefined || answer.value === '') {
      return 'Not answered';
    }
    
    switch (answer.fieldType) {
      case 'checkbox':
        return answer.value ? 'Yes' : 'No';
      case 'multiselect':
        return Array.isArray(answer.value) ? answer.value.join(', ') : answer.value;
      case 'file':
        return typeof answer.value === 'object' ? answer.value.name || 'File uploaded' : answer.value;
      case 'date':
        return new Date(answer.value).toLocaleDateString();
      default:
        return String(answer.value);
    }
  }

  async function completeExecution() {
    const score = calculateScore();
    const formattedAnswers = getFormattedAnswers();
    
    try {
      if (executionId) {
        await submitExecution.mutateAsync({
          executionId,
          answers: formattedAnswers,
          score
        });
        toast.success('Procedure completed successfully!');
      }
      
      onComplete(formattedAnswers, score);
    } catch (error) {
      console.error('Error completing execution:', error);
      toast.error('Failed to complete procedure. Please try again.');
    }
  }

  if (totalSteps === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <AlertCircle className="h-12 w-12 text-yellow-500 mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Fields Configured</h3>
        <p className="text-gray-600 mb-4 text-center">This procedure has no fields to execute.</p>
        <Button onClick={onCancel} variant="outline">
          Go Back
        </Button>
      </div>
    );
  }

  if (showSummary) {
    const formattedAnswers = getFormattedAnswers();
    const score = calculateScore();
    
    return (
      <div className="flex flex-col h-full">
        {/* Summary Header */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-b p-6 flex-shrink-0">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Review & Submit</h2>
                <p className="text-gray-600 mt-1">Review your responses before completing</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">{score}%</div>
                  <div className="text-sm text-gray-600">Complete</div>
                </div>
                <Badge variant="secondary" className="px-3 py-1">
                  {formattedAnswers.length}/{totalSteps} Answered
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-3">
            {formattedAnswers.length > 0 ? (
              formattedAnswers.map((answer, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-1">{answer.label}</h4>
                        <p className="text-gray-700 text-sm">{formatAnswerValue(answer)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {answer.fieldType}
                        </Badge>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => jumpToStep(fields.findIndex(f => (f.id || `field_${fields.indexOf(f)}`) === answer.fieldId))}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Edit
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8">
                <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                <p className="text-gray-600">No fields completed</p>
              </div>
            )}
          </div>
        </div>

        {/* Summary Footer */}
        <div className="border-t bg-white p-6 flex-shrink-0">
          <div className="flex justify-between items-center max-w-4xl mx-auto">
            <Button variant="outline" onClick={goToPreviousStep} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Fields
            </Button>
            
            <div className="flex gap-3">
              <Button variant="ghost" onClick={onCancel}>
                Cancel
              </Button>
              <Button 
                onClick={completeExecution} 
                className="bg-green-600 hover:bg-green-700 flex items-center gap-2" 
                disabled={submitExecution.isPending}
              >
                <CheckCircle className="h-4 w-4" />
                {submitExecution.isPending ? 'Completing...' : 'Complete Procedure'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Modern Progress Header */}
      <div className="bg-white border-b p-6 flex-shrink-0">
        <div className="max-w-4xl mx-auto">
          {/* Progress Info */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Step {currentStep + 1} of {totalSteps}
              </h3>
              <p className="text-sm text-gray-600">{currentField?.label}</p>
            </div>
            
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="px-3 py-1">
                {Math.round(progress)}% Complete
              </Badge>
              <Button variant="ghost" size="sm" onClick={handlePause} className="flex items-center gap-2">
                <Pause className="h-4 w-4" />
                Pause
              </Button>
            </div>
          </div>
          
          <Progress value={progress} className="h-2" />
          
          {/* Step Navigation Dots */}
          <div className="flex justify-center gap-1 mt-4">
            {fields.map((_, index) => (
              <button
                key={index}
                onClick={() => jumpToStep(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  answers[fields[index].id || `field_${index}`] ? 'bg-green-500' : 
                  index === currentStep ? 'bg-blue-500 w-6' : 'bg-gray-300 hover:bg-gray-400'
                }`}
                title={`Step ${index + 1}: ${fields[index].label}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Current Field */}
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
        <div className="max-w-2xl mx-auto">
          {currentField && (
            <ExecutionFieldRenderer 
              field={currentField}
              value={answers[currentField.id || `field_${currentStep}`] || ''} 
              onChange={value => handleAnswerChange(currentField.id || `field_${currentStep}`, value)} 
              error={errors[currentField.id || `field_${currentStep}`]} 
              fieldId={currentField.id || `field_${currentStep}`} 
            />
          )}
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="border-t bg-white p-6 flex-shrink-0">
        <div className="flex justify-between items-center max-w-4xl mx-auto">
          <Button 
            variant="outline" 
            onClick={currentStep === 0 ? onCancel : goToPreviousStep} 
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            {currentStep === 0 ? 'Cancel' : 'Previous'}
          </Button>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Auto-saved
            </Button>
          </div>
          
          <Button 
            onClick={goToNextStep} 
            className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
          >
            {currentStep === totalSteps - 1 ? (
              <>
                <FileText className="h-4 w-4" />
                Review
              </>
            ) : (
              <>
                Next
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
