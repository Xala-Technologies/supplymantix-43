
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, ArrowLeft, ArrowRight, Save, FileText, Clock, Target, PlayCircle, Zap } from "lucide-react";
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
      <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-xl border">
        <FileText className="h-12 w-12 text-gray-400 mb-4" />
        <h3 className="font-semibold text-lg mb-2">No Fields Configured</h3>
        <p className="text-gray-500 mb-4 text-center">This procedure doesn't have any fields to execute.</p>
        <Button onClick={onCancel} variant="outline">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Go Back
        </Button>
      </div>
    );
  }

  if (showSummary) {
    const formattedAnswers = getFormattedAnswers();
    const score = calculateScore();
    
    return (
      <div className="h-full flex flex-col bg-white">
        {/* Summary Header */}
        <div className="p-6 border-b bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h2 className="font-semibold text-xl">Review & Submit</h2>
                <p className="text-gray-600">Verify your responses before completion</p>
              </div>
            </div>
            <Badge className="bg-green-100 text-green-800 text-base px-4 py-2">
              {score}% Complete
            </Badge>
          </div>
        </div>

        {/* Answers List */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4 max-w-3xl">
            {formattedAnswers.length > 0 ? (
              formattedAnswers.map((answer, index) => (
                <Card key={index} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-1">{answer.label}</h4>
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
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No fields completed yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-6 border-t bg-white">
          <div className="flex justify-between items-center">
            <Button variant="outline" onClick={goToPreviousStep}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            
            <div className="flex gap-3">
              <Button variant="ghost" onClick={onCancel}>Cancel</Button>
              <Button 
                onClick={completeExecution} 
                className="bg-blue-600 hover:bg-blue-700"
                disabled={submitExecution.isPending}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                {submitExecution.isPending ? 'Completing...' : 'Complete Procedure'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="bg-white border-b">
        {/* Top Bar */}
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <PlayCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-xl text-gray-900">{procedure.title}</h2>
              <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                <div className="flex items-center gap-1">
                  <Target className="h-4 w-4" />
                  <span>Step {currentStep + 1} of {totalSteps}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>~{Math.ceil(totalSteps * 1.5)} min</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
              <Save className="h-4 w-4" />
              <span>Auto-saved</span>
            </div>
            <Badge variant="outline" className="text-blue-700 border-blue-200 bg-blue-50">
              {Math.round(progress)}% Complete
            </Badge>
          </div>
        </div>
        
        {/* Progress Section */}
        <div className="px-6 pb-4">
          <Progress value={progress} className="h-2 mb-3" />
          <div className="flex justify-center gap-2">
            {fields.map((_, index) => (
              <button
                key={index}
                onClick={() => jumpToStep(index)}
                className={`h-3 rounded-full transition-all duration-200 ${
                  answers[fields[index].id || `field_${index}`] ? 
                    'bg-green-500 w-8' : 
                  index === currentStep ? 
                    'bg-blue-500 w-10' : 
                    'bg-gray-300 w-3 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Current Field */}
        <div className="flex-1 flex items-center justify-center p-8">
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

        {/* Sidebar */}
        <div className="w-80 bg-gray-50 border-l flex flex-col">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Target className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold">Procedure Info</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                <span className="text-sm text-gray-600">Progress</span>
                <span className="font-medium text-blue-600">{currentStep + 1}/{totalSteps}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                <span className="text-sm text-gray-600">Est. Time</span>
                <span className="font-medium text-green-600">{Math.ceil(totalSteps * 1.5)} min</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                <span className="text-sm text-gray-600">Completed</span>
                <span className="font-medium text-purple-600">{Object.keys(answers).length}</span>
              </div>
            </div>
          </div>

          {/* Upcoming Steps */}
          <div className="flex-1 p-6 pt-0">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="h-4 w-4 text-orange-500" />
              <h4 className="font-medium">Upcoming Steps</h4>
            </div>
            <div className="space-y-2">
              {fields.slice(currentStep + 1, currentStep + 4).map((field, index) => (
                <div key={index} className="p-3 bg-white rounded-lg border">
                  <div className="font-medium text-sm text-gray-900">{field.label}</div>
                  <div className="text-xs text-gray-500 mt-1 capitalize">{field.field_type}</div>
                </div>
              ))}
              {fields.slice(currentStep + 1).length === 0 && (
                <div className="text-center p-4 text-gray-500">
                  <CheckCircle className="h-6 w-6 mx-auto mb-2 text-green-500" />
                  <p className="text-sm">Almost done!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="p-6 border-t bg-white">
        <div className="flex justify-between items-center">
          <Button 
            variant="outline" 
            onClick={currentStep === 0 ? onCancel : goToPreviousStep}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {currentStep === 0 ? 'Cancel' : 'Previous'}
          </Button>
          
          <Button 
            onClick={goToNextStep} 
            className="bg-blue-600 hover:bg-blue-700"
          >
            {currentStep === totalSteps - 1 ? (
              <>
                <FileText className="h-4 w-4 mr-2" />
                Review & Submit
              </>
            ) : (
              <>
                Next Step
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
