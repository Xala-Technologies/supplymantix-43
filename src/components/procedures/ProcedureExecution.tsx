
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, AlertCircle, ArrowLeft, ArrowRight, Save, Pause, FileText, X, Clock, Target, PlayCircle, Zap } from "lucide-react";
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
      <div className="flex flex-col items-center justify-center h-64 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl border border-orange-200">
        <div className="bg-orange-100 p-4 rounded-full mb-4">
          <AlertCircle className="h-8 w-8 text-orange-600" />
        </div>
        <h3 className="font-bold text-xl mb-2 text-gray-900">No Fields Configured</h3>
        <p className="text-gray-600 mb-6 text-center max-w-md">This procedure doesn't have any fields to execute. Please configure fields first.</p>
        <Button onClick={onCancel} variant="outline" className="bg-white">
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
      <div className="h-full flex flex-col bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
        {/* Summary Header */}
        <div className="bg-white/90 backdrop-blur-sm border-b-2 border-green-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                <CheckCircle className="h-7 w-7 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-2xl text-gray-900">Review & Submit</h2>
                <p className="text-gray-600">Verify your responses before completion</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center bg-green-100 p-4 rounded-xl">
                <div className="text-3xl font-bold text-green-600">{score}%</div>
                <div className="text-sm text-green-700 font-medium">Complete</div>
              </div>
              <Badge className="bg-green-500 text-white px-4 py-2 text-base">
                {formattedAnswers.length}/{totalSteps} Fields
              </Badge>
            </div>
          </div>
        </div>

        {/* Answers Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid gap-4 max-w-5xl mx-auto">
            {formattedAnswers.length > 0 ? (
              formattedAnswers.map((answer, index) => (
                <Card key={index} className="bg-white/80 backdrop-blur-sm hover:bg-white hover:shadow-lg transition-all duration-300 border-l-4 border-l-green-500">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-bold text-lg text-gray-900 mb-2">{answer.label}</h4>
                        <p className="text-gray-700 text-base">{formatAnswerValue(answer)}</p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => jumpToStep(fields.findIndex(f => (f.id || `field_${fields.indexOf(f)}`) === answer.fieldId))}
                        className="text-green-600 hover:text-green-800 hover:bg-green-50"
                      >
                        Edit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="bg-yellow-100 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <AlertCircle className="h-10 w-10 text-yellow-600" />
                </div>
                <p className="text-gray-600 text-lg">No fields completed yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Action Footer */}
        <div className="bg-white/90 backdrop-blur-sm border-t-2 border-green-200 p-6">
          <div className="flex justify-between items-center max-w-5xl mx-auto">
            <Button variant="outline" onClick={goToPreviousStep} className="flex items-center gap-2 px-6 py-3">
              <ArrowLeft className="h-5 w-5" />
              Back to Fields
            </Button>
            
            <div className="flex gap-4">
              <Button variant="ghost" onClick={onCancel} className="px-6 py-3">Cancel</Button>
              <Button 
                onClick={completeExecution} 
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3 shadow-lg"
                disabled={submitExecution.isPending}
              >
                <CheckCircle className="h-5 w-5 mr-2" />
                {submitExecution.isPending ? 'Completing...' : 'Complete Procedure'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Enhanced Header */}
      <div className="bg-white/95 backdrop-blur-lg border-b border-blue-200/50 shadow-lg">
        {/* Top Bar with Enhanced Design */}
        <div className="flex items-center justify-between px-8 py-6 bg-gradient-to-r from-white to-blue-50/50">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl ring-4 ring-blue-100">
                <PlayCircle className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-2xl text-gray-900 mb-1">{procedure.title}</h2>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full">
                    <Target className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-blue-700">Step {currentStep + 1} of {totalSteps}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full">
                    <Clock className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-green-700">~{Math.ceil(totalSteps * 1.5)} min</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 text-sm text-gray-500 bg-gradient-to-r from-green-50 to-emerald-50 px-4 py-2 rounded-full border border-green-200">
              <Save className="h-4 w-4 text-green-600" />
              <span className="text-green-700 font-semibold">Auto-saved</span>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="font-bold text-base px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-300 text-blue-700">
                {Math.round(progress)}% Complete
              </Badge>
              <Button variant="ghost" size="sm" onClick={onCancel} className="p-3 hover:bg-red-50 rounded-xl transition-all duration-200">
                <X className="h-5 w-5 text-red-500" />
              </Button>
            </div>
          </div>
        </div>
        
        {/* Enhanced Progress Section */}
        <div className="px-8 pb-6">
          <div className="mb-4">
            <Progress value={progress} className="h-4 bg-gray-100 rounded-full overflow-hidden shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 transition-all duration-700 ease-out rounded-full shadow-sm"
                style={{ width: `${progress}%` }}
              />
            </Progress>
          </div>
          <div className="flex justify-center gap-2">
            {fields.map((_, index) => (
              <button
                key={index}
                onClick={() => jumpToStep(index)}
                className={`h-4 rounded-full transition-all duration-300 shadow-sm hover:shadow-md ${
                  answers[fields[index].id || `field_${index}`] ? 
                    'bg-gradient-to-r from-green-500 to-emerald-500 w-10 shadow-green-200' : 
                  index === currentStep ? 
                    'bg-gradient-to-r from-blue-500 to-indigo-500 w-12 shadow-blue-200 ring-2 ring-blue-200' : 
                    'bg-gray-300 hover:bg-gray-400 w-4'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Current Field - Enhanced */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-3xl">
            {currentField && (
              <div className="animate-fade-in">
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
        </div>

        {/* Enhanced Side Panel */}
        <div className="w-80 bg-white/90 backdrop-blur-sm border-l-2 border-blue-200 flex flex-col shadow-lg">
          <div className="p-6 border-b border-blue-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Target className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="font-bold text-lg text-gray-900">Procedure Info</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">Progress</span>
                </div>
                <span className="font-bold text-blue-600">{currentStep + 1}/{totalSteps}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-gray-700">Est. Time</span>
                </div>
                <span className="font-bold text-green-600">{Math.ceil(totalSteps * 1.5)} min</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium text-gray-700">Completed</span>
                </div>
                <span className="font-bold text-purple-600">{Object.keys(answers).length}</span>
              </div>
            </div>
          </div>

          {/* Upcoming Steps */}
          <div className="flex-1 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="h-5 w-5 text-orange-500" />
              <h4 className="font-bold text-gray-900">Upcoming Steps</h4>
            </div>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {fields.slice(currentStep + 1, currentStep + 6).map((field, index) => (
                <div key={index} className="p-3 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-gray-200 hover:shadow-md transition-all">
                  <div className="font-semibold text-gray-900 text-sm">{field.label}</div>
                  <div className="text-xs text-gray-500 mt-1 capitalize">{field.field_type}</div>
                </div>
              ))}
              {fields.slice(currentStep + 1).length === 0 && (
                <div className="text-center p-4 text-gray-500">
                  <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
                  <p className="text-sm">Almost done!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Bottom Navigation */}
      <div className="bg-white/95 backdrop-blur-lg border-t border-blue-200/50 p-6 shadow-lg">
        <div className="flex justify-between items-center max-w-5xl mx-auto">
          <Button 
            variant="outline" 
            onClick={currentStep === 0 ? onCancel : goToPreviousStep}
            className="flex items-center gap-3 px-8 py-3 hover:bg-gray-50 border-gray-300 rounded-xl transition-all duration-200"
          >
            <ArrowLeft className="h-5 w-5" />
            {currentStep === 0 ? 'Cancel' : 'Previous'}
          </Button>
          
          <Button 
            onClick={goToNextStep} 
            className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white flex items-center gap-3 px-10 py-3 shadow-xl rounded-xl transition-all duration-200 transform hover:scale-105"
          >
            {currentStep === totalSteps - 1 ? (
              <>
                <FileText className="h-5 w-5" />
                Review & Submit
              </>
            ) : (
              <>
                Next Step
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
