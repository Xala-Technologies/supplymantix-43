
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Star, Clock, User } from "lucide-react";
import { ProcedureField } from "@/lib/database/procedures-enhanced";

interface ProcedurePreviewProps {
  procedure: {
    title: string;
    description: string;
    category: string;
    fields: ProcedureField[];
  };
  scoringEnabled: boolean;
  onClose: () => void;
}

export const ProcedurePreview: React.FC<ProcedurePreviewProps> = ({
  procedure,
  scoringEnabled,
  onClose
}) => {
  const totalPoints = scoringEnabled ? procedure.fields.reduce((sum, field) => 
    sum + (field.options?.points || 1), 0
  ) : 0;

  const renderField = (field: ProcedureField) => {
    if (field.field_type === 'section') {
      return (
        <div key={field.id} className="py-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
            {field.label}
          </h3>
        </div>
      );
    }

    return (
      <div key={field.id} className="space-y-2">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">
            {field.label}
            {field.is_required && <span className="text-red-500 ml-1">*</span>}
          </label>
          {scoringEnabled && (
            <Badge variant="outline" className="text-xs px-1 py-0 h-5 gap-1">
              <Star className="h-3 w-3" />
              {field.options?.points || 1}
            </Badge>
          )}
        </div>
        
        {field.options?.helpText && (
          <p className="text-xs text-gray-500">{field.options.helpText}</p>
        )}

        <div className="mock-field">
          {field.field_type === 'text' && (
            <div className="h-10 bg-gray-100 border border-gray-200 rounded px-3 flex items-center text-gray-400">
              Text will be entered here
            </div>
          )}
          
          {field.field_type === 'number' && (
            <div className="h-10 bg-gray-100 border border-gray-200 rounded px-3 flex items-center text-gray-400">
              0
            </div>
          )}
          
          {field.field_type === 'checkbox' && (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border border-gray-300 rounded"></div>
              <span className="text-sm text-gray-500">Check when complete</span>
            </div>
          )}
          
          {field.field_type === 'select' && (
            <div className="h-10 bg-gray-100 border border-gray-200 rounded px-3 flex items-center justify-between">
              <span className="text-gray-400">Select an option</span>
              <span className="text-gray-400">▼</span>
            </div>
          )}
          
          {field.field_type === 'multiselect' && (
            <div className="space-y-2">
              {(field.options?.choices || ['Option 1', 'Option 2']).slice(0, 3).map((choice, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="w-4 h-4 border border-gray-300 rounded"></div>
                  <span className="text-sm text-gray-600">{choice}</span>
                </div>
              ))}
            </div>
          )}
          
          {field.field_type === 'date' && (
            <div className="h-10 bg-gray-100 border border-gray-200 rounded px-3 flex items-center text-gray-400">
              mm/dd/yyyy
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 text-white p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1 pr-4">
              <h1 className="text-xl font-bold mb-2">{procedure.title}</h1>
              {procedure.description && (
                <p className="text-blue-100">{procedure.description}</p>
              )}
              
              <div className="flex items-center gap-4 mt-4 text-sm text-blue-100">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  Est. 15-30 min
                </div>
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {procedure.fields.length} fields
                </div>
                {scoringEnabled && (
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4" />
                    {totalPoints} points
                  </div>
                )}
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-blue-700"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <div className="space-y-6">
            {procedure.fields.map(renderField)}
          </div>
          
          {procedure.fields.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No fields added yet. Go back to add some fields to your procedure.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t">
          <div className="flex justify-between items-center">
            <Badge className="bg-blue-100 text-blue-800">
              {procedure.category}
            </Badge>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                Close Preview
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">
                Start Procedure
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
