
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, AlertCircle, Clock, ArrowLeft, ArrowRight, Play, X } from "lucide-react";
import { ProcedureField, ProcedureWithFields } from "@/lib/database/procedures-enhanced";
import { ExecutionFieldRenderer } from "./ExecutionFieldRenderer";

interface ProcedureExecutionProps {
  procedure: ProcedureWithFields;
  executionId?: string;
  workOrderId?: string;
  onComplete: (answers: any, score: number) => void;
  onCancel: () => void;
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

  const fields = procedure.fields || [];
  const totalSteps = fields.length;
  const progress = totalSteps > 0 ? ((currentStep + 1) / totalSteps) * 100 : 100;

  const currentField = fields[currentStep];

  const validateField = (field: ProcedureField, value: any): string | null => {
    if (field.is_required && (!value || (Array.isArray(value) && value.length === 0))) {
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
    setAnswers(prev => ({ ...prev, [fieldId]: value }));
    setErrors(prev => ({ ...prev, [fieldId]: '' }));
  };

  const goToNextStep = () => {
    if (!currentField) return;

    const fieldId = `field_${currentStep}`;
    const value = answers[fieldId];
    const error = validateField(currentField, value);

    if (error) {
      setErrors(prev => ({ ...prev, [fieldId]: error }));
      return;
    }

    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeExecution();
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const calculateScore = (): number => {
    const requiredFields = fields.filter(f => f.is_required);
    if (requiredFields.length === 0) return 100;

    const completedRequired = requiredFields.filter(field => {
      const fieldId = `field_${fields.indexOf(field)}`;
      const value = answers[fieldId];
      return value !== undefined && value !== null && value !== '';
    }).length;

    return Math.round((completedRequired / requiredFields.length) * 100);
  };

  const completeExecution = () => {
    const score = calculateScore();
    onComplete(answers, score);
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

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex-shrink-0 border-b bg-gradient-to-r from-blue-50 to-indigo-50 p-3">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Play className="h-4 w-4 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">{procedure.title}</h2>
            </div>
            {procedure.description && (
              <p className="text-sm text-gray-600 mb-2">{procedure.description}</p>
            )}
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
            value={answers[`field_${currentStep}`] || ''}
            onChange={(value) => handleAnswerChange(`field_${currentStep}`, value)}
            error={errors[`field_${currentStep}`]}
            fieldId={`field_${currentStep}`}
          />
        )}
      </div>

      {/* Navigation */}
      <div className="flex-shrink-0 border-t bg-gray-50 p-3">
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={currentStep === 0 ? onCancel : goToPreviousStep}
            size="sm"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            {currentStep === 0 ? 'Cancel' : 'Previous'}
          </Button>

          <div className="text-center">
            <p className="text-xs text-gray-600">
              {fields.filter(f => f.is_required).length} required fields
            </p>
          </div>

          <Button onClick={goToNextStep} className="bg-blue-600 hover:bg-blue-700" size="sm">
            {currentStep === totalSteps - 1 ? (
              <>
                <CheckCircle className="h-4 w-4 mr-1" />
                Complete
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
              {fields.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    answers[`field_${index}`] ? 'bg-green-500' : 
                    index === currentStep ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
