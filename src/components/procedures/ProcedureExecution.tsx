
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, AlertCircle, Clock, ArrowLeft, ArrowRight } from "lucide-react";
import { ProcedureField, ProcedureWithFields } from "@/lib/database/procedures-enhanced";

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
    // Simple scoring: percentage of completed required fields
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

  const renderField = (field: ProcedureField, index: number) => {
    const fieldId = `field_${index}`;
    const value = answers[fieldId] || '';
    const error = errors[fieldId];

    switch (field.field_type) {
      case 'text':
        return (
          <div>
            <Label htmlFor={fieldId}>{field.label}</Label>
            <Input
              id={fieldId}
              value={value}
              onChange={(e) => handleAnswerChange(fieldId, e.target.value)}
              placeholder={`Enter ${field.label.toLowerCase()}`}
            />
          </div>
        );

      case 'number':
        return (
          <div>
            <Label htmlFor={fieldId}>{field.label}</Label>
            <Input
              id={fieldId}
              type="number"
              value={value}
              onChange={(e) => handleAnswerChange(fieldId, e.target.value)}
              placeholder={`Enter ${field.label.toLowerCase()}`}
            />
          </div>
        );

      case 'date':
        return (
          <div>
            <Label htmlFor={fieldId}>{field.label}</Label>
            <Input
              id={fieldId}
              type="date"
              value={value}
              onChange={(e) => handleAnswerChange(fieldId, e.target.value)}
            />
          </div>
        );

      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={fieldId}
              checked={value === true}
              onCheckedChange={(checked) => handleAnswerChange(fieldId, checked)}
            />
            <Label htmlFor={fieldId}>{field.label}</Label>
          </div>
        );

      case 'select':
        return (
          <div>
            <Label htmlFor={fieldId}>{field.label}</Label>
            <Select value={value} onValueChange={(val) => handleAnswerChange(fieldId, val)}>
              <SelectTrigger>
                <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.choices?.map((choice: string) => (
                  <SelectItem key={choice} value={choice}>
                    {choice}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );

      case 'multiselect':
        return (
          <div>
            <Label>{field.label}</Label>
            <div className="space-y-2 mt-2">
              {field.options?.choices?.map((choice: string) => (
                <div key={choice} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${fieldId}_${choice}`}
                    checked={(value || []).includes(choice)}
                    onCheckedChange={(checked) => {
                      const currentValues = value || [];
                      const newValues = checked
                        ? [...currentValues, choice]
                        : currentValues.filter((v: string) => v !== choice);
                      handleAnswerChange(fieldId, newValues);
                    }}
                  />
                  <Label htmlFor={`${fieldId}_${choice}`}>{choice}</Label>
                </div>
              ))}
            </div>
          </div>
        );

      case 'file':
        return (
          <div>
            <Label htmlFor={fieldId}>{field.label}</Label>
            <Input
              id={fieldId}
              type="file"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleAnswerChange(fieldId, {
                    name: file.name,
                    size: file.size,
                    type: file.type
                  });
                }
              }}
            />
          </div>
        );

      case 'section':
        return (
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900">{field.label}</h3>
            <p className="text-gray-600 mt-2">Section header - click Next to continue</p>
          </div>
        );

      default:
        return (
          <div>
            <Label htmlFor={fieldId}>{field.label}</Label>
            <Textarea
              id={fieldId}
              value={value}
              onChange={(e) => handleAnswerChange(fieldId, e.target.value)}
              placeholder={`Enter ${field.label.toLowerCase()}`}
              rows={3}
            />
          </div>
        );
    }
  };

  if (totalSteps === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold">No Fields Configured</h3>
          <p className="text-gray-600 mt-2">This procedure has no fields to execute.</p>
          <Button onClick={onCancel} className="mt-4">
            Go Back
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{procedure.title}</CardTitle>
              <p className="text-gray-600 mt-1">{procedure.description}</p>
            </div>
            <Badge variant="outline">
              Step {currentStep + 1} of {totalSteps}
            </Badge>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardHeader>
      </Card>

      {/* Current Field */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            {currentField?.label}
            {currentField?.is_required && <span className="text-red-500">*</span>}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentField && renderField(currentField, currentStep)}
          
          {errors[`field_${currentStep}`] && (
            <div className="flex items-center gap-2 text-red-600 text-sm">
              <AlertCircle className="h-4 w-4" />
              {errors[`field_${currentStep}`]}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={currentStep === 0 ? onCancel : goToPreviousStep}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {currentStep === 0 ? 'Cancel' : 'Previous'}
        </Button>

        <Button onClick={goToNextStep}>
          {currentStep === totalSteps - 1 ? (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              Complete
            </>
          ) : (
            <>
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </>
          )}
        </Button>
      </div>

      {/* Summary of answers */}
      {Object.keys(answers).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Answers Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              {Object.entries(answers).map(([fieldId, value]) => {
                const fieldIndex = parseInt(fieldId.split('_')[1]);
                const field = fields[fieldIndex];
                if (!field || !value) return null;

                return (
                  <div key={fieldId} className="flex justify-between">
                    <span className="text-gray-600">{field.label}:</span>
                    <span className="font-medium">
                      {Array.isArray(value) ? value.join(', ') : 
                       typeof value === 'object' ? value.name || JSON.stringify(value) :
                       value.toString()}
                    </span>
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
