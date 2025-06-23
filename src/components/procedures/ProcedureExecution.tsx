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
  // Add scheduled date - could come from work order or procedure settings
  const [scheduledDate] = useState<Date | undefined>(
    workOrderId ? new Date(Date.now() + 24 * 60 * 60 * 1000) : undefined // Example: scheduled for tomorrow
  );
  
  const submitExecution = useSubmitExecution();
  const fields = procedure.fields || [];
  const totalSteps = fields.length;
  const progress = totalSteps > 0 ? (currentStep + 1) / totalSteps * 100 : 100;
  const currentField = fields[currentStep];

  // Estimate duration based on field count and complexity
  const estimateDuration = (): number => {
    const baseTimePerField = 2; // 2 minutes per field base
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
  };

  const validateField = (field: ProcedureField, value: any): string | null => {
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
  };

  const handleAnswerChange = (fieldId: string, value: any) => {
    setAnswers(prev => ({
      ...prev,
      [fieldId]: value
    }));
    setErrors(prev => ({
      ...prev,
      [fieldId]: ''
    }));
  };

  const goToNextStep = () => {
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
  };

  const goToPreviousStep = () => {
    if (showSummary) {
      setShowSummary(false);
      return;
    }
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const calculateScore = (): number => {
    const requiredFields = fields.filter(f => f.is_required);
    if (requiredFields.length === 0) return 100;

    const completedRequired = requiredFields.filter(field => {
      const fieldId = field.id || `field_${fields.indexOf(field)}`;
      const value = answers[fieldId];
      return value !== undefined && value !== null && value !== '' && 
             (!Array.isArray(value) || value.length > 0);
    }).length;

    return Math.round(completedRequired / requiredFields.length * 100);
  };

  const getFormattedAnswers = (): FieldAnswer[] => {
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
  };

  const formatAnswerValue = (answer: FieldAnswer): string => {
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
  };

  const completeExecution = async () => {
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
  };

  if (totalSteps === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <AlertCircle className="h-12 w-12 text-yellow-500 mb-3" />
        <h3 className="text-lg font-semibold mb-2">No Fields Configured</h3>
        <p className="text-sm text-gray-600 mb-4 text-center">This procedure has no fields to execute.</p>
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
        {/* Timeline */}
        <div className="flex-shrink-0 p-4 border-b">
          <ExecutionTimeline
            startTime={executionStartTime}
            scheduledDate={scheduledDate}
            estimatedDurationMinutes={estimateDuration()}
            currentStep={totalSteps}
            totalSteps={totalSteps}
            isCompleted={true}
            executorName="Current User" // This could come from auth context
            location={procedure.category} // Use category as location for now
            priority="medium" // This could come from work order or procedure settings
          />
        </div>

        {/* Header */}
        <div className="flex-shrink-0 border-b bg-gradient-to-r from-green-50 to-emerald-50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-5 w-5 text-green-600" />
            <h2 className="text-lg font-semibold text-gray-900">Execution Summary</h2>
          </div>
          <p className="text-sm text-gray-600">{procedure.title}</p>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline" className="border-green-300 text-green-700">
              Score: {score}%
            </Badge>
            <Badge variant="secondary">
              {formattedAnswers.length} of {totalSteps} fields completed
            </Badge>
          </div>
        </div>

        {/* Summary Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {formattedAnswers.length > 0 ? (
            formattedAnswers.map((answer, index) => (
              <Card key={index} className="border-l-4 border-l-blue-400">
                <CardContent className="p-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 text-sm">{answer.label}</h4>
                      <p className="text-sm text-gray-600 mt-1">{formatAnswerValue(answer)}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {answer.fieldType}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-8">
              <AlertCircle className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <p className="text-sm text-gray-600">No fields completed</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex-shrink-0 border-t bg-gray-50 p-4">
          <div className="flex justify-between items-center">
            <Button variant="outline" onClick={goToPreviousStep} size="sm">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Edit
            </Button>

            <div className="flex gap-2">
              <Button variant="ghost" onClick={onCancel} size="sm">
                Cancel
              </Button>
              <Button 
                onClick={completeExecution} 
                className="bg-green-600 hover:bg-green-700" 
                size="sm"
                disabled={submitExecution.isPending}
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                {submitExecution.isPending ? 'Saving...' : 'Complete Procedure'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Timeline */}
      <div className="flex-shrink-0 p-4 border-b">
        <ExecutionTimeline
          startTime={executionStartTime}
          scheduledDate={scheduledDate}
          estimatedDurationMinutes={estimateDuration()}
          currentStep={currentStep}
          totalSteps={totalSteps}
          isCompleted={false}
          executorName="Current User" // This could come from auth context
          location={procedure.category} // Use category as location for now
          priority="medium" // This could come from work order or procedure settings
        />
      </div>

      {/* Header */}
      <div className="flex-shrink-0 border-b bg-gradient-to-r from-blue-50 to-indigo-50 p-3">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Play className="h-4 w-4 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">{procedure.title}</h2>
            </div>
            {procedure.description && <p className="text-sm text-gray-600 mb-2">{procedure.description}</p>}
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-blue-300 text-blue-700 text-xs">
                {procedure.category}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                Step {currentStep + 1} of {totalSteps}
              </Badge>
            </div>
          </div>
          
          <Button variant="ghost" size="sm" onClick={onCancel} className="text-gray-500 hover:text-gray-700">
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div>
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Progress</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Current Field */}
      <div className="flex-1 overflow-y-auto p-4">
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

      {/* Navigation */}
      <div className="flex-shrink-0 border-t bg-gray-50 p-3">
        <div className="flex justify-between items-center">
          <Button variant="outline" onClick={currentStep === 0 ? onCancel : goToPreviousStep} size="sm">
            <ArrowLeft className="h-4 w-4 mr-1" />
            {currentStep === 0 ? 'Cancel' : 'Previous'}
          </Button>

          <div className="text-center">
            
          </div>

          <Button onClick={goToNextStep} className="bg-blue-600 hover:bg-blue-700" size="sm">
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

      {/* Progress Summary */}
      {Object.keys(answers).length > 0 && (
        <div className="flex-shrink-0 border-t bg-gray-50 p-2">
          <div className="text-center">
            <p className="text-xs text-gray-600 mb-1">
              <Clock className="h-3 w-3 inline mr-1" />
              {Object.keys(answers).length} of {totalSteps} fields completed
            </p>
            <div className="flex justify-center space-x-1">
              {fields.map((field, index) => {
                const fieldId = field.id || `field_${index}`;
                return (
                  <div 
                    key={index} 
                    className={`w-2 h-2 rounded-full ${
                      answers[fieldId] ? 'bg-green-500' : 
                      index === currentStep ? 'bg-blue-500' : 'bg-gray-300'
                    }`} 
                  />
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
