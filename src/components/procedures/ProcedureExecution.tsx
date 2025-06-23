import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, AlertCircle, Clock, ArrowLeft, ArrowRight, Play, X, FileText } from "lucide-react";
import { ProcedureField, ProcedureWithFields } from "@/lib/database/procedures-enhanced";
import { ExecutionFieldRenderer } from "./ExecutionFieldRenderer";
import { ExecutionTimeline } from "./ExecutionTimeline";
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
  const [executionStartTime] = useState(new Date());
  const [scheduledDate] = useState<Date | undefined>(
    workOrderId ? new Date(Date.now() + 24 * 60 * 60 * 1000) : undefined
  );
  
  const submitExecution = useSubmitExecution();
  const fields = procedure.fields || [];
  const totalSteps = fields.length;
  const progress = totalSteps > 0 ? (currentStep + 1) / totalSteps * 100 : 100;
  const currentField = fields[currentStep];

  function estimateDuration(): number {
    const baseTimePerField = 2;
    const complexityMultiplier = fields.reduce((acc, field) => {
      switch (field.field_type) {
        case 'file':
        case 'multiselect':
          return acc + 1.5;
        case 'section':
          return acc + 0.5;
        default:
          return acc + 1;
      }
    }, 0);
    return Math.ceil(baseTimePerField * complexityMultiplier);
  }

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
      <div className="flex flex-col items-center justify-center py-4">
        <AlertCircle className="h-6 w-6 text-yellow-500 mb-2" />
        <h3 className="text-sm font-semibold mb-1">No Fields Configured</h3>
        <p className="text-xs text-gray-600 mb-2 text-center">This procedure has no fields to execute.</p>
        <Button onClick={onCancel} variant="outline" size="sm">
          Go Back
        </Button>
      </div>
    );
  }

  if (showSummary) {
    const formattedAnswers = getFormattedAnswers();
    const score = calculateScore();
    
    return (
      <div className="flex flex-col h-full max-w-3xl mx-auto">
        {/* Ultra Compact Timeline */}
        <div className="flex-shrink-0 p-1 border-b bg-white">
          <ExecutionTimeline
            startTime={executionStartTime}
            scheduledDate={scheduledDate}
            estimatedDurationMinutes={estimateDuration()}
            currentStep={totalSteps}
            totalSteps={totalSteps}
            isCompleted={true}
            executorName="Current User"
            location={procedure.category}
            priority="medium"
          />
        </div>

        {/* Ultra Compact Header */}
        <div className="flex-shrink-0 border-b bg-gradient-to-r from-green-50 to-emerald-50 p-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded bg-green-100">
                <FileText className="h-3 w-3 text-green-600" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-900">Summary</h2>
                <p className="text-xs text-gray-600 mb-2 text-center">{procedure.title}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Badge variant="outline" className="border-green-300 text-green-700 text-xs px-1 py-0">
                {score}%
              </Badge>
              <Badge variant="secondary" className="text-xs px-1 py-0">
                {formattedAnswers.length}/{totalSteps}
              </Badge>
            </div>
          </div>
        </div>

        {/* Ultra Compact Summary Content */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {formattedAnswers.length > 0 ? (
            formattedAnswers.map((answer, index) => (
              <Card key={index} className="border-l-2 border-l-blue-400 shadow-none border-gray-200">
                <CardContent className="p-2">
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 text-xs truncate">{answer.label}</h4>
                      <p className="text-xs text-gray-600 mt-0.5 break-words">{formatAnswerValue(answer)}</p>
                    </div>
                    <Badge variant="outline" className="text-xs px-1 py-0 shrink-0">
                      {answer.fieldType}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-4">
              <AlertCircle className="h-4 w-4 text-yellow-500 mx-auto mb-1" />
              <p className="text-xs text-gray-600">No fields completed</p>
            </div>
          )}
        </div>

        {/* Ultra Compact Navigation */}
        <div className="flex-shrink-0 border-t bg-gray-50 p-2">
          <div className="flex justify-between items-center">
            <Button variant="outline" onClick={goToPreviousStep} size="sm" className="h-7 px-2 text-xs">
              <ArrowLeft className="h-3 w-3 mr-1" />
              Back
            </Button>
            <div className="flex gap-1">
              <Button variant="ghost" onClick={onCancel} size="sm" className="h-7 px-2 text-xs">
                Cancel
              </Button>
              <Button 
                onClick={completeExecution} 
                className="bg-green-600 hover:bg-green-700 h-7 px-2 text-xs" 
                size="sm"
                disabled={submitExecution.isPending}
              >
                <CheckCircle className="h-3 w-3 mr-1" />
                {submitExecution.isPending ? 'Saving...' : 'Complete'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-slate-50 to-white">
      {/* Ultra Compact Timeline */}
      <div className="flex-shrink-0 border-b bg-white shadow-sm">
        <ExecutionTimeline
          startTime={executionStartTime}
          scheduledDate={scheduledDate}
          estimatedDurationMinutes={estimateDuration()}
          currentStep={currentStep}
          totalSteps={totalSteps}
          isCompleted={false}
          executorName="Current User"
          location={procedure.category}
          priority="medium"
        />
      </div>

      {/* Modern Header with Gradient */}
      <div className="flex-shrink-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white">
        <div className="flex justify-between items-center p-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="p-2 rounded-lg bg-white/20 backdrop-blur-sm">
              <Play className="h-4 w-4 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-bold text-white truncate">{procedure.title}</h2>
              {procedure.description && (
                <p className="text-sm text-white/80 truncate">{procedure.description}</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2 shrink-0">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1">
              <span className="text-sm font-semibold text-white">
                {currentStep + 1}/{totalSteps}
              </span>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onCancel} 
              className="text-white hover:bg-white/20 p-1.5 h-auto w-auto rounded-lg"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Modern Progress Bar */}
        <div className="px-3 pb-3">
          <div className="bg-white/20 rounded-full h-2 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-white to-yellow-200 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-white/80 mt-1">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
        </div>
      </div>

      {/* Current Field - Full Height */}
      <div className="flex-1 overflow-y-auto bg-gradient-to-b from-slate-50 to-white p-4">
        {currentField && (
          <div className="max-w-2xl mx-auto">
            <ExecutionFieldRenderer 
              field={currentField}
              value={answers[currentField.id || `field_${currentStep}`] || ''} 
              onChange={value => handleAnswerChange(currentField.id || `field_${currentStep}`, value)} 
              error={errors[currentField.id || `field_${currentStep}`]} 
              fieldId={currentField.id || `field_${currentStep}`} 
            />
          </div>
        )}
      </div>

      {/* Modern Navigation Footer */}
      <div className="flex-shrink-0 bg-white border-t shadow-lg">
        <div className="flex justify-between items-center p-4">
          <Button 
            variant="outline" 
            onClick={currentStep === 0 ? onCancel : goToPreviousStep} 
            className="flex items-center gap-2 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            {currentStep === 0 ? 'Cancel' : 'Previous'}
          </Button>

          <div className="flex items-center gap-4">
            {/* Step Indicator */}
            <div className="flex gap-1">
              {fields.map((_, index) => (
                <div 
                  key={index} 
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    answers[fields[index].id || `field_${index}`] ? 'bg-green-500 scale-110' : 
                    index === currentStep ? 'bg-blue-500 scale-110' : 'bg-gray-300'
                  }`} 
                />
              ))}
            </div>
            
            <Button 
              onClick={goToNextStep} 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
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
    </div>
  );
};
