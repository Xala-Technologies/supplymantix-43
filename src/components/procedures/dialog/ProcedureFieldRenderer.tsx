import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { FileText, Paperclip, Star, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';

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

  const renderFieldImage = () => {
    if (!field.options?.image) return null;

    return (
      <div className="mt-3">
        <img 
          src={field.options.image} 
          alt="Field image" 
          className="w-full max-w-md h-auto rounded-lg border shadow-sm"
        />
      </div>
    );
  };

  const renderFieldWithAttachment = (fieldContent: React.ReactNode) => (
    <div className="space-y-2">
      {fieldContent}
      {renderFieldImage()}
      {renderAttachedFile()}
      {field.options?.helpText && (
        <p className="text-xs text-gray-500">{field.options.helpText}</p>
      )}
    </div>
  );

  const renderRatingField = () => {
    const maxRating = field.options?.maxRating || 5;
    const currentRating = fieldValue || 0;
    const allowHalfStars = field.options?.allowHalfStars || false;

    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: maxRating }, (_, i) => {
          const starValue = i + 1;
          const isSelected = currentRating >= starValue;
          const isHalfSelected = allowHalfStars && currentRating >= starValue - 0.5 && currentRating < starValue;
          
          return (
            <button
              key={i}
              type="button"
              onClick={() => onChange(field.id, starValue)}
              className="text-2xl focus:outline-none"
            >
              <Star 
                className={`h-6 w-6 ${
                  isSelected ? 'fill-yellow-400 text-yellow-400' : 
                  isHalfSelected ? 'fill-yellow-200 text-yellow-400' : 
                  'text-gray-300'
                }`}
              />
            </button>
          );
        })}
      </div>
    );
  };

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

    case 'amount':
      return renderFieldWithAttachment(
        <div key={field.id || index} className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            {field.label || field.title}
            {field.is_required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
            <Input
              type="number"
              value={fieldValue}
              onChange={(e) => onChange(field.id, parseFloat(e.target.value) || 0)}
              className="pl-8"
              min={field.options?.minValue}
              max={field.options?.maxValue}
              step={field.options?.step || 0.01}
            />
          </div>
        </div>
      );

    case 'email':
      return renderFieldWithAttachment(
        <div key={field.id || index} className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            {field.label || field.title}
            {field.is_required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <Input
            type="email"
            value={fieldValue}
            onChange={(e) => onChange(field.id, e.target.value)}
            placeholder={field.options?.placeholder || 'Enter email address'}
          />
        </div>
      );

    case 'phone':
      return renderFieldWithAttachment(
        <div key={field.id || index} className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            {field.label || field.title}
            {field.is_required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <Input
            type="tel"
            value={fieldValue}
            onChange={(e) => onChange(field.id, e.target.value)}
            placeholder={field.options?.placeholder || 'Enter phone number'}
          />
        </div>
      );

    case 'url':
      return renderFieldWithAttachment(
        <div key={field.id || index} className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            {field.label || field.title}
            {field.is_required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <Input
            type="url"
            value={fieldValue}
            onChange={(e) => onChange(field.id, e.target.value)}
            placeholder={field.options?.placeholder || 'https://example.com'}
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
        </div>
      );

    case 'select':
      return renderFieldWithAttachment(
        <div key={field.id || index} className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            {field.label || field.title}
            {field.is_required && <span className="text-red-500 ml-1">*</span>}
          </label>
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
        </div>
      );

    case 'multiselect':
      return renderFieldWithAttachment(
        <div key={field.id || index} className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            {field.label || field.title}
            {field.is_required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <div className="space-y-2">
            {field.options?.choices?.map((choice: string, choiceIndex: number) => {
              const selectedValues = Array.isArray(fieldValue) ? fieldValue : [];
              const isSelected = selectedValues.includes(choice);
              
              return (
                <div key={choiceIndex} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${field.id}-${choiceIndex}`}
                    checked={isSelected}
                    onCheckedChange={(checked) => {
                      const currentValues = Array.isArray(fieldValue) ? fieldValue : [];
                      const newValues = checked 
                        ? [...currentValues, choice]
                        : currentValues.filter(v => v !== choice);
                      onChange(field.id, newValues);
                    }}
                  />
                  <label htmlFor={`${field.id}-${choiceIndex}`} className="text-sm text-gray-700">
                    {choice}
                  </label>
                </div>
              );
            })}
            {field.options?.allowOther && (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`${field.id}-other`}
                  checked={fieldValue?.includes('__other__')}
                  onCheckedChange={(checked) => {
                    const currentValues = Array.isArray(fieldValue) ? fieldValue : [];
                    const newValues = checked 
                      ? [...currentValues.filter(v => v !== '__other__'), '__other__']
                      : currentValues.filter(v => v !== '__other__');
                    onChange(field.id, newValues);
                  }}
                />
                <Input
                  placeholder="Other (please specify)"
                  className="flex-1"
                  disabled={!fieldValue?.includes('__other__')}
                />
              </div>
            )}
          </div>
        </div>
      );

    case 'radio':
      return renderFieldWithAttachment(
        <div key={field.id || index} className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            {field.label || field.title}
            {field.is_required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <RadioGroup value={fieldValue} onValueChange={(value) => onChange(field.id, value)}>
            {field.options?.choices?.map((choice: string, choiceIndex: number) => (
              <div key={choiceIndex} className="flex items-center space-x-2">
                <RadioGroupItem value={choice} id={`${field.id}-${choiceIndex}`} />
                <Label htmlFor={`${field.id}-${choiceIndex}`} className="text-sm text-gray-700">
                  {choice}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      );

    case 'rating':
      return renderFieldWithAttachment(
        <div key={field.id || index} className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            {field.label || field.title}
            {field.is_required && <span className="text-red-500 ml-1">*</span>}
          </label>
          {renderRatingField()}
        </div>
      );

    case 'slider':
      return renderFieldWithAttachment(
        <div key={field.id || index} className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            {field.label || field.title}
            {field.is_required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <div className="px-3">
            <Slider
              value={[fieldValue || field.options?.minValue || 0]}
              onValueChange={(values) => onChange(field.id, values[0])}
              min={field.options?.minValue || 0}
              max={field.options?.maxValue || 100}
              step={field.options?.step || 1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{field.options?.minValue || 0}</span>
              <span className="font-medium">{fieldValue || field.options?.minValue || 0}</span>
              <span>{field.options?.maxValue || 100}</span>
            </div>
          </div>
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
            min={field.options?.minDate}
            max={field.options?.maxDate}
          />
        </div>
      );

    case 'time':
      return renderFieldWithAttachment(
        <div key={field.id || index} className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            {field.label || field.title}
            {field.is_required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <Input
            type="time"
            value={fieldValue}
            onChange={(e) => onChange(field.id, e.target.value)}
          />
        </div>
      );

    case 'datetime':
      return renderFieldWithAttachment(
        <div key={field.id || index} className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            {field.label || field.title}
            {field.is_required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <Input
            type="datetime-local"
            value={fieldValue}
            onChange={(e) => onChange(field.id, e.target.value)}
            min={field.options?.minDate}
            max={field.options?.maxDate}
          />
        </div>
      );

    case 'file':
    case 'image':
      return renderFieldWithAttachment(
        <div key={field.id || index} className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            {field.label || field.title}
            {field.is_required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
            <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">
              {field.field_type === 'image' ? 'Upload an image' : 'Upload a file'}
            </p>
            <input
              type="file"
              accept={field.field_type === 'image' ? 'image/*' : field.options?.allowedTypes || '*'}
              multiple={field.options?.allowMultipleFiles}
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                onChange(field.id, field.options?.allowMultipleFiles ? files : files[0]);
              }}
              className="mt-2 text-sm"
            />
          </div>
        </div>
      );

    case 'inspection':
      return renderFieldWithAttachment(
        <div key={field.id || index} className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            {field.label || field.title}
            {field.is_required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <div className="flex gap-2">
            {['Pass', 'Fail', 'Flag'].map((option) => (
              <Button
                key={option}
                type="button"
                variant={fieldValue === option ? "default" : "outline"}
                size="sm"
                onClick={() => onChange(field.id, option)}
                className={`${
                  option === 'Pass' ? 'data-[state=on]:bg-green-500 data-[state=on]:text-white' :
                  option === 'Fail' ? 'data-[state=on]:bg-red-500 data-[state=on]:text-white' :
                  'data-[state=on]:bg-yellow-500 data-[state=on]:text-white'
                }`}
              >
                {option}
              </Button>
            ))}
          </div>
          {field.options?.allowComments && (fieldValue === 'Fail' || fieldValue === 'Flag') && (
            <div className="mt-2">
              <Textarea
                placeholder="Add comments..."
                value={fieldValue?.comment || ''}
                onChange={(e) => onChange(field.id, { ...fieldValue, comment: e.target.value })}
                className="min-h-[60px]"
              />
            </div>
          )}
        </div>
      );

    case 'section':
      return renderFieldWithAttachment(
        <div key={field.id || index} className="py-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
            {field.label || field.title}
          </h3>
          {field.description && (
            <p className="text-sm text-gray-600 mt-2">{field.description}</p>
          )}
        </div>
      );

    case 'divider':
      return (
        <div key={field.id || index} className="py-2">
          <Separator className="my-2" />
        </div>
      );

    case 'info':
      return renderFieldWithAttachment(
        <div key={field.id || index} className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-start gap-3">
            <FileText className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-blue-900">{field.label || field.title}</h4>
              {field.options?.infoText && (
                <p className="text-sm text-blue-700 mt-1">{field.options.infoText}</p>
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
            placeholder={field.options?.placeholder || ''}
          />
          <p className="text-xs text-gray-400">Unknown field type: {field.field_type}</p>
        </div>
      );
  }
};
