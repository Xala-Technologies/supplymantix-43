import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, AlertCircle, ArrowLeft, ArrowRight, Save, Pause, FileText, X, Clock, Target } from "lucide-react";
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
      <div className="flex flex-col items-center justify-center h-64">
        <AlertCircle className="h-12 w-12 text-yellow-500 mb-3" />
        <h3 className="font-semibold text-lg mb-2">No Fields Configured</h3>
        <p className="text-gray-600 mb-4 text-center">This procedure has no fields to execute.</p>
        <Button onClick={onCancel} variant="outline">Go Back</Button>
      </div>
    );
  }

  if (showSummary) {
    const formattedAnswers = getFormattedAnswers();
    const score = calculateScore();
    
    return (
      <div className="h-full flex flex-col bg-gradient-to-br from-green-50 to-emerald-50">
        {/* Compact Header */}
        <div className="bg-white border-b shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Review & Submit</h3>
                <p className="text-sm text-gray-600">Verify your responses before completion</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{score}%</div>
                <div className="text-xs text-gray-500">Complete</div>
              </div>
              <Badge className="bg-green-100 text-green-800 border-green-200">
                {formattedAnswers.length}/{totalSteps} Fields
              </Badge>
            </div>
          </div>
        </div>

        {/* Answers Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid gap-3 max-w-4xl mx-auto">
            {formattedAnswers.length > 0 ? (
              formattedAnswers.map((answer, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">{answer.label}</h4>
                        <p className="text-gray-700">{formatAnswerValue(answer)}</p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => jumpToStep(fields.findIndex(f => (f.id || `field_${fields.indexOf(f)}`) === answer.fieldId))}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Edit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8">
                <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-3" />
                <p className="text-gray-600">No fields completed</p>
              </div>
            )}
          </div>
        </div>

        {/* Action Footer */}
        <div className="bg-white border-t p-4">
          <div className="flex justify-between items-center max-w-4xl mx-auto">
            <Button variant="outline" onClick={goToPreviousStep} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Fields
            </Button>
            
            <div className="flex gap-3">
              <Button variant="ghost" onClick={onCancel}>Cancel</Button>
              <Button 
                onClick={completeExecution} 
                className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
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
    <div className="h-full flex flex-col bg-gray-50">
      {/* Unified Header with Progress */}
      <div className="bg-white border-b shadow-sm">
        {/* Top Bar */}
        <div className="flex items-center justify-between p-4 pb-2">
          <div className="flex items-center gap-3">
            {onBack && (
              <Button variant="ghost" size="sm" onClick={onBack} className="p-2">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <div>
              <h2 className="font-bold text-lg">{procedure.title}</h2>
              <p className="text-sm text-gray-600">Step {currentStep + 1} of {totalSteps}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Save className="h-4 w-4" />
              Auto-saved
            </div>
            <Badge variant="outline" className="font-medium">
              {Math.round(progress)}%
            </Badge>
            <Button variant="ghost" size="sm" onClick={onCancel} className="p-2">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="px-4 pb-3">
          <Progress value={progress} className="h-2 mb-2" />
          <div className="flex justify-center gap-1">
            {fields.map((_, index) => (
              <button
                key={index}
                onClick={() => jumpToStep(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  answers[fields[index].id || `field_${index}`] ? 'bg-green-500' : 
                  index === currentStep ? 'bg-blue-500 w-6' : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Current Field - Centered */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-2xl">
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

        {/* Side Panel - Procedure Info */}
        <div className="w-80 bg-white border-l flex flex-col">
          <div className="p-4 border-b">
            <h3 className="font-semibold text-lg mb-2">Procedure Info</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Target className="h-4 w-4 text-blue-500" />
                <span className="text-gray-600">Progress:</span>
                <span className="font-medium">{currentStep + 1}/{totalSteps}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-green-500" />
                <span className="text-gray-600">Est. Time:</span>
                <span className="font-medium">{Math.ceil(totalSteps * 1.5)} min</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-purple-500" />
                <span className="text-gray-600">Completed:</span>
                <span className="font-medium">{Object.keys(answers).length}</span>
              </div>
            </div>
          </div>

          {/* Field Preview */}
          <div className="flex-1 p-4">
            <h4 className="font-medium mb-3">Upcoming Steps</h4>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {fields.slice(currentStep + 1, currentStep + 6).map((field, index) => (
                <div key={index} className="p-2 bg-gray-50 rounded text-sm">
                  <div className="font-medium text-gray-900">{field.label}</div>
                  <div className="text-gray-500 text-xs">{field.field_type}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="bg-white border-t p-4">
        <div className="flex justify-between items-center max-w-4xl mx-auto">
          <Button 
            variant="outline" 
            onClick={currentStep === 0 ? onCancel : goToPreviousStep}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            {currentStep === 0 ? 'Cancel' : 'Previous'}
          </Button>
          
          <Button 
            onClick={goToNextStep} 
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
          >
            {currentStep === totalSteps - 1 ? (
              <>
                <FileText className="h-4 w-4" />
                Review & Submit
              </>
            ) : (
              <>
                Next Step
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
