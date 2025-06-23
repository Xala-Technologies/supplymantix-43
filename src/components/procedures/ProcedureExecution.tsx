
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, AlertCircle, Clock, ArrowLeft, ArrowRight, Play } from "lucide-react";
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
      <Card className="max-w-lg mx-auto">
        <CardContent className="text-center py-8">
          <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-3" />
          <h3 className="text-lg font-semibold mb-2">No Fields Configured</h3>
          <p className="text-gray-600 mb-4">This procedure has no fields to execute.</p>
          <Button onClick={onCancel} variant="outline">
            Go Back
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Play className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-lg">{procedure.title}</CardTitle>
              </div>
              {procedure.description && (
                <p className="text-sm text-gray-700">{procedure.description}</p>
              )}
              <div className="flex items-center gap-2 pt-1">
                <Badge variant="outline" className="border-blue-300 text-blue-700 text-xs">
                  {procedure.category}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  Step {currentStep + 1} of {totalSteps}
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-700 mb-1">
              <span>Progress</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2 bg-white" />
          </div>
        </CardHeader>
      </Card>

      {/* Current Field */}
      {currentField && (
        <ExecutionFieldRenderer
          field={currentField}
          value={answers[`field_${currentStep}`] || ''}
          onChange={(value) => handleAnswerChange(`field_${currentStep}`, value)}
          error={errors[`field_${currentStep}`]}
          fieldId={`field_${currentStep}`}
        />
      )}

      {/* Navigation */}
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={currentStep === 0 ? onCancel : goToPreviousStep}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {currentStep === 0 ? 'Cancel' : 'Previous'}
            </Button>

            <div className="text-center">
              <p className="text-xs text-gray-600">
                {fields.filter(f => f.is_required).length} required fields
              </p>
            </div>

            <Button onClick={goToNextStep} className="bg-blue-600 hover:bg-blue-700">
              {currentStep === totalSteps - 1 ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Complete
                </>
              ) : (
                <>
                  Next Step
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary of answers */}
      {Object.keys(answers).length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Current Answers
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {Object.entries(answers).map(([fieldId, value]) => {
                const fieldIndex = parseInt(fieldId.split('_')[1]);
                const field = fields[fieldIndex];
                if (!field || !value) return null;

                return (
                  <div key={fieldId} className="p-2 bg-gray-50 rounded text-sm">
                    <div className="font-medium text-gray-700 mb-0.5">
                      {field.label}
                    </div>
                    <div className="text-gray-900 text-xs">
                      {Array.isArray(value) ? value.join(', ') : 
                       typeof value === 'object' ? value.name || JSON.stringify(value) :
                       value.toString()}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
