
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Paperclip, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProcedureFieldRendererProps {
  field: any;
  index: number;
  value: any;
  onChange: (fieldId: string, value: any) => void;
}

export const ProcedureFieldRenderer: React.FC<ProcedureFieldRendererProps> = ({
  field,
  index,
  value,
  onChange
}) => {
  const fieldValue = value || field.options?.defaultValue || '';

  const renderAttachedFile = () => {
    if (!field.options?.attachedFile) return null;

    const { attachedFile } = field.options;
    return (
      <div className="mt-3 p-4 bg-gray-50 rounded-lg border">
        <div className="flex items-start gap-4">
          <div className="flex items-center gap-3 flex-1">
            <Paperclip className="h-4 w-4 text-gray-500" />
            <div>
              <div className="text-sm font-medium text-gray-700">{attachedFile.name}</div>
              <div className="text-xs text-gray-500">
                {attachedFile.type} • {(attachedFile.size / 1024).toFixed(1)} KB
              </div>
            </div>
          </div>
          {attachedFile.type.startsWith('image/') && (
            <div className="flex-shrink-0">
              <img 
                src={attachedFile.url} 
                alt="Attachment preview" 
                className="w-32 h-32 object-cover rounded-lg border shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => window.open(attachedFile.url, '_blank')}
              />
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderFieldWithAttachment = (fieldContent: React.ReactNode) => (
    <div className="space-y-2">
      {fieldContent}
      {renderAttachedFile()}
    </div>
  );

  switch (field.field_type || field.type) {
    case 'text':
      return renderFieldWithAttachment(
        <div key={field.id || index} className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            {field.label || field.title}
            {field.is_required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <Input
            value={fieldValue}
            onChange={(e) => onChange(field.id, e.target.value)}
            placeholder={field.options?.placeholder || ''}
          />
          {field.options?.helpText && (
            <p className="text-xs text-gray-500">{field.options.helpText}</p>
          )}
        </div>
      );

    case 'textarea':
      return renderFieldWithAttachment(
        <div key={field.id || index} className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            {field.label || field.title}
            {field.is_required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <Textarea
            value={fieldValue}
            onChange={(e) => onChange(field.id, e.target.value)}
            placeholder={field.options?.placeholder || ''}
            className="min-h-[80px]"
          />
        </div>
      );

    case 'checkbox':
      return renderFieldWithAttachment(
        <div key={field.id || index} className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id={field.id}
              checked={Boolean(fieldValue)}
              onCheckedChange={(checked) => onChange(field.id, Boolean(checked))}
            />
            <label htmlFor={field.id} className="text-sm font-medium text-gray-700">
              {field.label || field.title}
              {field.is_required && <span className="text-red-500 ml-1">*</span>}
            </label>
          </div>
          {field.description && (
            <p className="text-xs text-gray-500 ml-5">{field.description}</p>
          )}
        </div>
      );

    case 'select':
    case 'radio':
      return renderFieldWithAttachment(
        <div key={field.id || index} className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            {field.label || field.title}
            {field.is_required && <span className="text-red-500 ml-1">*</span>}
          </label>
          {field.field_type === 'radio' ? (
            <div className="flex gap-3">
              {field.options?.choices?.map((choice: string, choiceIndex: number) => (
                <div key={choiceIndex} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id={`${field.id}-${choiceIndex}`}
                    name={field.id}
                    value={choice}
                    checked={fieldValue === choice}
                    onChange={(e) => onChange(field.id, e.target.value)}
                    className="w-4 h-4 text-gray-600"
                  />
                  <label htmlFor={`${field.id}-${choiceIndex}`} className="text-sm text-gray-700">
                    {choice}
                  </label>
                </div>
              ))}
            </div>
          ) : (
            <Select value={fieldValue} onValueChange={(value) => onChange(field.id, value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                {field.options?.choices?.map((choice: string, choiceIndex: number) => (
                  <SelectItem key={choiceIndex} value={choice}>
                    {choice}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      );

    case 'number':
      return renderFieldWithAttachment(
        <div key={field.id || index} className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            {field.label || field.title}
            {field.is_required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <Input
            type="number"
            value={fieldValue}
            onChange={(e) => onChange(field.id, parseFloat(e.target.value) || 0)}
            min={field.options?.minValue}
            max={field.options?.maxValue}
            step={field.options?.step || 1}
          />
        </div>
      );

    case 'date':
      return renderFieldWithAttachment(
        <div key={field.id || index} className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            {field.label || field.title}
            {field.is_required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <Input
            type="date"
            value={fieldValue}
            onChange={(e) => onChange(field.id, e.target.value)}
          />
        </div>
      );

    case 'section':
      return renderFieldWithAttachment(
        <div key={field.id || index} className="py-3">
          <h3 className="text-lg font-semibold text-gray-900 border-b pb-1">
            {field.label || field.title}
          </h3>
          {field.description && (
            <p className="text-sm text-gray-600 mt-1">{field.description}</p>
          )}
        </div>
      );

    case 'info':
      return renderFieldWithAttachment(
        <div key={field.id || index} className="bg-gray-50 p-3 rounded-lg border">
          <div className="flex items-start gap-2">
            <FileText className="h-4 w-4 text-gray-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-gray-900">{field.label || field.title}</h4>
              {field.options?.infoText && (
                <p className="text-sm text-gray-600 mt-1">{field.options.infoText}</p>
              )}
            </div>
          </div>
        </div>
      );

    default:
      return renderFieldWithAttachment(
        <div key={field.id || index} className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            {field.label || field.title}
            {field.is_required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <Input
            value={fieldValue}
            onChange={(e) => onChange(field.id, e.target.value)}
          />
        </div>
      );
  }
};
