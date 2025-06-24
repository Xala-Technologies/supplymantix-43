
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, AlertCircle, ArrowLeft, ArrowRight, Save, Pause, FileText, X } from "lucide-react";
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
  onBack?: () => void;
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
  onCancel,
  onBack
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSummary, setShowSummary] = useState(false);
  
  const submitExecution = useSubmitExecution();
  const fields = procedure.fields || [];
  const totalSteps = fields.length;
  const progress = totalSteps > 0 ? ((currentStep + 1) / totalSteps) * 100 : 100;
  const currentField = fields[currentStep];

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
      <div className="flex flex-col items-center justify-center py-8">
        <AlertCircle className="h-10 w-10 text-yellow-500 mb-3" />
        <h3 className="font-semibold mb-2">No Fields Configured</h3>
        <p className="text-gray-600 mb-4 text-center text-sm">This procedure has no fields to execute.</p>
        <Button onClick={onCancel} variant="outline">Go Back</Button>
      </div>
    );
  }

  if (showSummary) {
    const formattedAnswers = getFormattedAnswers();
    const score = calculateScore();
    
    return (
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-3 border-b bg-green-50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Review & Submit</h3>
              <p className="text-sm text-gray-600">Verify your responses</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-right">
                <div className="text-lg font-bold text-green-600">{score}%</div>
                <div className="text-xs text-gray-600">Complete</div>
              </div>
              <Badge variant="secondary" className="text-xs">
                {formattedAnswers.length}/{totalSteps}
              </Badge>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {formattedAnswers.length > 0 ? (
            formattedAnswers.map((answer, index) => (
              <Card key={index} className="hover:shadow-sm transition-shadow">
                <CardContent className="p-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm mb-1">{answer.label}</h4>
                      <p className="text-gray-700 text-sm">{formatAnswerValue(answer)}</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => jumpToStep(fields.findIndex(f => (f.id || `field_${fields.indexOf(f)}`) === answer.fieldId))}
                      className="text-blue-600 hover:text-blue-800 text-xs h-auto p-1"
                    >
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-6">
              <AlertCircle className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <p className="text-gray-600 text-sm">No fields completed</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-3">
          <div className="flex justify-between items-center">
            <Button variant="outline" onClick={goToPreviousStep} size="sm">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            
            <div className="flex gap-2">
              <Button variant="ghost" onClick={onCancel} size="sm">Cancel</Button>
              <Button 
                onClick={completeExecution} 
                className="bg-green-600 hover:bg-green-700" 
                size="sm"
                disabled={submitExecution.isPending}
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                {submitExecution.isPending ? 'Completing...' : 'Complete'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-3 border-b bg-gray-50">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {onBack && (
              <Button variant="ghost" size="sm" onClick={onBack} className="p-1">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <div>
              <h3 className="font-semibold text-sm">Step {currentStep + 1} of {totalSteps}</h3>
              <p className="text-xs text-gray-600">{currentField?.label}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs px-2 py-0">
              {Math.round(progress)}%
            </Badge>
            <Button variant="ghost" size="sm" onClick={onCancel} className="p-1">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <Progress value={progress} className="h-1.5" />
        
        {/* Step dots */}
        <div className="flex justify-center gap-1 mt-2">
          {fields.map((_, index) => (
            <button
              key={index}
              onClick={() => jumpToStep(index)}
              className={`w-1.5 h-1.5 rounded-full transition-all ${
                answers[fields[index].id || `field_${index}`] ? 'bg-green-500' : 
                index === currentStep ? 'bg-blue-500 w-4' : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Current Field */}
      <div className="flex-1 overflow-y-auto p-3">
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

      {/* Footer */}
      <div className="border-t p-3">
        <div className="flex justify-between items-center">
          <Button 
            variant="outline" 
            onClick={currentStep === 0 ? onCancel : goToPreviousStep} 
            size="sm"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            {currentStep === 0 ? 'Cancel' : 'Previous'}
          </Button>
          
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Save className="h-3 w-3" />
            Auto-saved
          </div>
          
          <Button 
            onClick={goToNextStep} 
            className="bg-blue-600 hover:bg-blue-700" 
            size="sm"
          >
            {currentStep === totalSteps - 1 ? (
              <>
                <FileText className="h-4 w-4 mr-1" />
                Review
              </>
            ) : (
              <>
                Next
                <ArrowRight className="h-4 w-4 ml-1" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
