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
      <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-start gap-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Paperclip className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <div className="text-sm font-medium text-blue-900">{attachedFile.name}</div>
              <div className="text-xs text-blue-600">
                {attachedFile.type} • {(attachedFile.size / 1024).toFixed(1)} KB
              </div>
            </div>
          </div>
          {attachedFile.type.startsWith('image/') && (
            <div className="flex-shrink-0">
              <img 
                src={attachedFile.url} 
                alt="Attachment preview" 
                className="w-20 h-20 object-cover rounded-lg border border-blue-200 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
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
      <div className="mt-4">
        <img 
          src={field.options.image} 
          alt="Field image" 
          className="w-full max-w-md h-auto rounded-lg border border-gray-200 shadow-sm"
        />
      </div>
    );
  };

  const renderFieldWithAttachment = (fieldContent: React.ReactNode) => (
    <div className="space-y-3">
      {fieldContent}
      {renderFieldImage()}
      {renderAttachedFile()}
      {field.options?.helpText && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-amber-800 flex items-start gap-2">
            <FileText className="h-4 w-4 mt-0.5 flex-shrink-0" />
            {field.options.helpText}
          </p>
        </div>
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
              className="text-2xl focus:outline-none hover:scale-110 transition-transform"
            >
              <Star 
                className={`h-7 w-7 ${
                  isSelected ? 'fill-yellow-400 text-yellow-400' : 
                  isHalfSelected ? 'fill-yellow-200 text-yellow-400' : 
                  'text-gray-300 hover:text-yellow-300'
                }`}
              />
            </button>
          );
        })}
        {currentRating > 0 && (
          <span className="ml-2 text-sm text-gray-600 font-medium">
            {currentRating} / {maxRating}
          </span>
        )}
      </div>
    );
  };

  switch (field.field_type || field.type) {
    case 'text':
      return renderFieldWithAttachment(
        <div key={field.id || index} className="space-y-3">
          <label className="text-sm font-semibold text-gray-900 block">
            {field.label || field.title}
            {field.is_required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <Input
            value={fieldValue}
            onChange={(e) => onChange(field.id, e.target.value)}
            placeholder={field.options?.placeholder || 'Enter text...'}
            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      );

    case 'textarea':
      return renderFieldWithAttachment(
        <div key={field.id || index} className="space-y-3">
          <label className="text-sm font-semibold text-gray-900 block">
            {field.label || field.title}
            {field.is_required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <Textarea
            value={fieldValue}
            onChange={(e) => onChange(field.id, e.target.value)}
            placeholder={field.options?.placeholder || 'Enter detailed text...'}
            className="min-h-[100px] border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      );

    case 'number':
      return renderFieldWithAttachment(
        <div key={field.id || index} className="space-y-3">
          <label className="text-sm font-semibold text-gray-900 block">
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
            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter number..."
          />
        </div>
      );

    case 'amount':
      return renderFieldWithAttachment(
        <div key={field.id || index} className="space-y-3">
          <label className="text-sm font-semibold text-gray-900 block">
            {field.label || field.title}
            {field.is_required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">$</span>
            <Input
              type="number"
              value={fieldValue}
              onChange={(e) => onChange(field.id, parseFloat(e.target.value) || 0)}
              className="pl-8 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              min={field.options?.minValue}
              max={field.options?.maxValue}
              step={field.options?.step || 0.01}
              placeholder="0.00"
            />
          </div>
        </div>
      );

    case 'email':
      return renderFieldWithAttachment(
        <div key={field.id || index} className="space-y-3">
          <label className="text-sm font-semibold text-gray-900 block">
            {field.label || field.title}
            {field.is_required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <Input
            type="email"
            value={fieldValue}
            onChange={(e) => onChange(field.id, e.target.value)}
            placeholder={field.options?.placeholder || 'Enter email address'}
            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      );

    case 'phone':
      return renderFieldWithAttachment(
        <div key={field.id || index} className="space-y-3">
          <label className="text-sm font-semibold text-gray-900 block">
            {field.label || field.title}
            {field.is_required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <Input
            type="tel"
            value={fieldValue}
            onChange={(e) => onChange(field.id, e.target.value)}
            placeholder={field.options?.placeholder || 'Enter phone number'}
            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      );

    case 'url':
      return renderFieldWithAttachment(
        <div key={field.id || index} className="space-y-3">
          <label className="text-sm font-semibold text-gray-900 block">
            {field.label || field.title}
            {field.is_required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <Input
            type="url"
            value={fieldValue}
            onChange={(e) => onChange(field.id, e.target.value)}
            placeholder={field.options?.placeholder || 'https://example.com'}
            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      );

    case 'checkbox':
      return renderFieldWithAttachment(
        <div key={field.id || index} className="space-y-3">
          <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <Checkbox
              id={field.id}
              checked={Boolean(fieldValue)}
              onCheckedChange={(checked) => onChange(field.id, Boolean(checked))}
              className="mt-0.5"
            />
            <label htmlFor={field.id} className="text-sm font-medium text-gray-900 cursor-pointer flex-1">
              {field.label || field.title}
              {field.is_required && <span className="text-red-500 ml-1">*</span>}
            </label>
          </div>
        </div>
      );

    case 'select':
      return renderFieldWithAttachment(
        <div key={field.id || index} className="space-y-3">
          <label className="text-sm font-semibold text-gray-900 block">
            {field.label || field.title}
            {field.is_required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <Select value={fieldValue} onValueChange={(value) => onChange(field.id, value)}>
            <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
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
        <div key={field.id || index} className="space-y-3">
          <label className="text-sm font-semibold text-gray-900 block">
            {field.label || field.title}
            {field.is_required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <div className="space-y-2 p-4 border border-gray-300 rounded-lg bg-gray-50">
            {field.options?.choices?.map((choice: string, choiceIndex: number) => {
              const selectedValues = Array.isArray(fieldValue) ? fieldValue : [];
              const isSelected = selectedValues.includes(choice);
              
              return (
                <div key={choiceIndex} className="flex items-center space-x-3 p-2 rounded hover:bg-white transition-colors">
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
                  <label htmlFor={`${field.id}-${choiceIndex}`} className="text-sm text-gray-900 cursor-pointer flex-1">
                    {choice}
                  </label>
                </div>
              );
            })}
          </div>
        </div>
      );

    case 'radio':
      return renderFieldWithAttachment(
        <div key={field.id || index} className="space-y-3">
          <label className="text-sm font-semibold text-gray-900 block">
            {field.label || field.title}
            {field.is_required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <RadioGroup value={fieldValue} onValueChange={(value) => onChange(field.id, value)} className="space-y-2">
            {field.options?.choices?.map((choice: string, choiceIndex: number) => (
              <div key={choiceIndex} className="flex items-center space-x-3 p-2 rounded hover:bg-gray-50 transition-colors">
                <RadioGroupItem value={choice} id={`${field.id}-${choiceIndex}`} />
                <Label htmlFor={`${field.id}-${choiceIndex}`} className="text-sm text-gray-900 cursor-pointer flex-1">
                  {choice}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      );

    case 'rating':
      return renderFieldWithAttachment(
        <div key={field.id || index} className="space-y-3">
          <label className="text-sm font-semibold text-gray-900 block">
            {field.label || field.title}
            {field.is_required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <div className="p-4 bg-gray-50 rounded-lg border">
            {renderRatingField()}
          </div>
        </div>
      );

    case 'slider':
      return renderFieldWithAttachment(
        <div key={field.id || index} className="space-y-3">
          <label className="text-sm font-semibold text-gray-900 block">
            {field.label || field.title}
            {field.is_required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <div className="px-4 py-6 bg-gray-50 rounded-lg border">
            <Slider
              value={[fieldValue || field.options?.minValue || 0]}
              onValueChange={(values) => onChange(field.id, values[0])}
              min={field.options?.minValue || 0}
              max={field.options?.maxValue || 100}
              step={field.options?.step || 1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-3">
              <span>{field.options?.minValue || 0}</span>
              <Badge variant="secondary" className="font-medium">
                {fieldValue || field.options?.minValue || 0}
              </Badge>
              <span>{field.options?.maxValue || 100}</span>
            </div>
          </div>
        </div>
      );

    case 'date':
      return renderFieldWithAttachment(
        <div key={field.id || index} className="space-y-3">
          <label className="text-sm font-semibold text-gray-900 block">
            {field.label || field.title}
            {field.is_required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <Input
            type="date"
            value={fieldValue}
            onChange={(e) => onChange(field.id, e.target.value)}
            min={field.options?.minDate}
            max={field.options?.maxDate}
            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      );

    case 'time':
      return renderFieldWithAttachment(
        <div key={field.id || index} className="space-y-3">
          <label className="text-sm font-semibold text-gray-900 block">
            {field.label || field.title}
            {field.is_required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <Input
            type="time"
            value={fieldValue}
            onChange={(e) => onChange(field.id, e.target.value)}
            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      );

    case 'datetime':
      return renderFieldWithAttachment(
        <div key={field.id || index} className="space-y-3">
          <label className="text-sm font-semibold text-gray-900 block">
            {field.label || field.title}
            {field.is_required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <Input
            type="datetime-local"
            value={fieldValue}
            onChange={(e) => onChange(field.id, e.target.value)}
            min={field.options?.minDate}
            max={field.options?.maxDate}
            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      );

    case 'file':
    case 'image':
      return renderFieldWithAttachment(
        <div key={field.id || index} className="space-y-3">
          <label className="text-sm font-semibold text-gray-900 block">
            {field.label || field.title}
            {field.is_required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-5 text-center">
            <Upload className="h-8 w-8 text-gray-400 mx-auto mb-3" />
            <p className="text-sm text-gray-700">
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
              className="mt-3 text-sm"
            />
          </div>
        </div>
      );

    case 'inspection':
      return renderFieldWithAttachment(
        <div key={field.id || index} className="space-y-3">
          <label className="text-sm font-semibold text-gray-900 block">
            {field.label || field.title}
            {field.is_required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <div className="flex gap-3">
            {['Pass', 'Fail', 'Flag'].map((option) => (
              <Button
                key={option}
                type="button"
                variant={fieldValue === option ? "default" : "outline"}
                size="sm"
                onClick={() => onChange(field.id, option)}
                className={`flex-1 ${
                  fieldValue === option 
                    ? option === 'Pass' ? 'bg-green-600 hover:bg-green-700 text-white' :
                      option === 'Fail' ? 'bg-red-600 hover:bg-red-700 text-white' :
                      'bg-yellow-600 hover:bg-yellow-700 text-white'
                    : option === 'Pass' ? 'border-green-300 text-green-700 hover:bg-green-50' :
                      option === 'Fail' ? 'border-red-300 text-red-700 hover:bg-red-50' :
                      'border-yellow-300 text-yellow-700 hover:bg-yellow-50'
                }`}
              >
                {option}
              </Button>
            ))}
          </div>
          {field.options?.allowComments && (fieldValue === 'Fail' || fieldValue === 'Flag') && (
            <div className="mt-3">
              <Textarea
                placeholder="Add comments..."
                value={fieldValue?.comment || ''}
                onChange={(e) => onChange(field.id, { ...fieldValue, comment: e.target.value })}
                className="min-h-[80px] border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          )}
        </div>
      );

    case 'section':
      return renderFieldWithAttachment(
        <div key={field.id || index} className="py-5">
          <h3 className="text-lg font-semibold text-gray-900 border-b pb-3">
            {field.label || field.title}
          </h3>
          {field.description && (
            <p className="text-sm text-gray-600 mt-2">{field.description}</p>
          )}
        </div>
      );

    case 'divider':
      return (
        <div key={field.id || index} className="py-3">
          <Separator className="my-3" />
        </div>
      );

    case 'info':
      return renderFieldWithAttachment(
        <div key={field.id || index} className="bg-blue-50 p-5 rounded-lg border border-blue-200">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <FileText className="h-4 w-4 text-blue-600" />
            </div>
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
        <div key={field.id || index} className="space-y-3">
          <label className="text-sm font-semibold text-gray-900 block">
            {field.label || field.title}
            {field.is_required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <Input
            value={fieldValue}
            onChange={(e) => onChange(field.id, e.target.value)}
            placeholder={field.options?.placeholder || ''}
            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
          <Badge variant="destructive" className="text-xs">
            Unknown field type: {field.field_type}
          </Badge>
        </div>
      );
  }
};
