
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Star, Upload, FileText, Search } from 'lucide-react';
import { format } from 'date-fns';
import { ProcedureField } from '@/lib/database/procedures-enhanced';

interface FieldInputProps {
  field: ProcedureField;
  value: any;
  onChange: (value: any) => void;
}

export const FieldInput: React.FC<FieldInputProps> = ({ field, value, onChange }) => {
  const renderRatingStars = (rating: number, maxRating: number, onRate: (rating: number) => void) => {
    return (
      <div className="flex gap-1">
        {Array.from({ length: maxRating }, (_, i) => (
          <Star
            key={i}
            className={`h-6 w-6 cursor-pointer transition-colors ${
              i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 hover:text-yellow-400'
            }`}
            onClick={() => onRate(i + 1)}
          />
        ))}
      </div>
    );
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const allowMultiple = field.options?.allowMultipleFiles || false;
    const acceptedTypes = field.options?.acceptedFileTypes || [];
    const maxFileSize = field.options?.maxFileSize || 10 * 1024 * 1024; // 10MB default

    const processedFiles = Array.from(files).filter(file => {
      if (acceptedTypes.length > 0 && !acceptedTypes.some(type => file.type.includes(type))) {
        console.warn(`File type ${file.type} not accepted`);
        return false;
      }
      
      if (file.size > maxFileSize) {
        console.warn(`File size ${file.size} exceeds maximum ${maxFileSize}`);
        return false;
      }
      
      return true;
    });

    if (allowMultiple) {
      const existingFiles = Array.isArray(value) ? value : [];
      onChange([...existingFiles, ...processedFiles]);
    } else {
      onChange(processedFiles[0] || null);
    }
  };

  switch (field.field_type) {
    case 'checkbox':
      return (
        <div className="flex items-center space-x-2 p-3 bg-white border rounded-lg">
          <Checkbox
            id={`field-${field.id}`}
            checked={value || false}
            onCheckedChange={onChange}
          />
          <Label htmlFor={`field-${field.id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {field.label}
          </Label>
        </div>
      );

    case 'text':
      return (
        <div className="space-y-2">
          <Label className="text-sm font-medium">{field.label}</Label>
          <Input
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.options?.placeholder || ''}
            className="w-full"
          />
          {field.options?.helpText && (
            <p className="text-xs text-gray-500">{field.options.helpText}</p>
          )}
        </div>
      );

    case 'textarea':
      return (
        <div className="space-y-2">
          <Label className="text-sm font-medium">{field.label}</Label>
          <Textarea
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.options?.placeholder || ''}
            className="w-full min-h-[100px]"
          />
          {field.options?.helpText && (
            <p className="text-xs text-gray-500">{field.options.helpText}</p>
          )}
        </div>
      );

    case 'number':
      return (
        <div className="space-y-2">
          <Label className="text-sm font-medium">{field.label}</Label>
          <Input
            type="number"
            value={value || ''}
            onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
            placeholder={field.options?.placeholder || ''}
            min={field.options?.minValue}
            max={field.options?.maxValue}
            step={field.options?.step || 1}
            className="w-full"
          />
          {field.options?.helpText && (
            <p className="text-xs text-gray-500">{field.options.helpText}</p>
          )}
        </div>
      );

    case 'amount':
      return (
        <div className="space-y-2">
          <Label className="text-sm font-medium">{field.label}</Label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              $
            </div>
            <Input
              type="number"
              value={value || ''}
              onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
              placeholder="0.00"
              min="0"
              step="0.01"
              className="w-full pl-8"
            />
          </div>
          {field.options?.helpText && (
            <p className="text-xs text-gray-500">{field.options.helpText}</p>
          )}
        </div>
      );

    case 'email':
      return (
        <div className="space-y-2">
          <Label className="text-sm font-medium">{field.label}</Label>
          <Input
            type="email"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.options?.placeholder || ''}
            className="w-full"
          />
          {field.options?.helpText && (
            <p className="text-xs text-gray-500">{field.options.helpText}</p>
          )}
        </div>
      );

    case 'url':
      return (
        <div className="space-y-2">
          <Label className="text-sm font-medium">{field.label}</Label>
          <Input
            type="url"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.options?.placeholder || ''}
            className="w-full"
          />
          {field.options?.helpText && (
            <p className="text-xs text-gray-500">{field.options.helpText}</p>
          )}
        </div>
      );

    case 'phone':
      return (
        <div className="space-y-2">
          <Label className="text-sm font-medium">{field.label}</Label>
          <Input
            type="tel"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.options?.placeholder || ''}
            className="w-full"
          />
          {field.options?.helpText && (
            <p className="text-xs text-gray-500">{field.options.helpText}</p>
          )}
        </div>
      );

    case 'date':
      return (
        <div className="space-y-2">
          <Label className="text-sm font-medium">{field.label}</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {value ? format(new Date(value), "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={value ? new Date(value) : undefined}
                onSelect={(date) => onChange(date?.toISOString())}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {field.options?.helpText && (
            <p className="text-xs text-gray-500">{field.options.helpText}</p>
          )}
        </div>
      );

    case 'time':
      return (
        <div className="space-y-2">
          <Label className="text-sm font-medium">{field.label}</Label>
          <Input
            type="time"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full"
          />
          {field.options?.helpText && (
            <p className="text-xs text-gray-500">{field.options.helpText}</p>
          )}
        </div>
      );

    case 'datetime':
      return (
        <div className="space-y-2">
          <Label className="text-sm font-medium">{field.label}</Label>
          <Input
            type="datetime-local"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full"
          />
          {field.options?.helpText && (
            <p className="text-xs text-gray-500">{field.options.helpText}</p>
          )}
        </div>
      );

    case 'select':
      return (
        <div className="space-y-2">
          <Label className="text-sm font-medium">{field.label}</Label>
          <Select value={value || ''} onValueChange={onChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {field.options?.choices?.map((choice, choiceIndex) => (
                <SelectItem key={choiceIndex} value={choice}>
                  {choice}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {field.options?.helpText && (
            <p className="text-xs text-gray-500">{field.options.helpText}</p>
          )}
        </div>
      );

    case 'multiselect':
      return (
        <div className="space-y-2">
          <Label className="text-sm font-medium">{field.label}</Label>
          <div className="space-y-2 p-3 border rounded-lg bg-gray-50">
            {field.options?.choices?.map((choice, choiceIndex) => (
              <div key={choiceIndex} className="flex items-center space-x-2">
                <Checkbox
                  id={`field-${field.id}-${choiceIndex}`}
                  checked={(value || []).includes(choice)}
                  onCheckedChange={(checked) => {
                    const currentValues = value || [];
                    const newValues = checked
                      ? [...currentValues, choice]
                      : currentValues.filter((v: string) => v !== choice);
                    onChange(newValues);
                  }}
                />
                <Label htmlFor={`field-${field.id}-${choiceIndex}`} className="text-sm">
                  {choice}
                </Label>
              </div>
            ))}
          </div>
          {field.options?.helpText && (
            <p className="text-xs text-gray-500">{field.options.helpText}</p>
          )}
        </div>
      );

    case 'radio':
      return (
        <div className="space-y-2">
          <Label className="text-sm font-medium">{field.label}</Label>
          <RadioGroup value={value || ''} onValueChange={onChange} className="p-3 border rounded-lg bg-gray-50">
            {field.options?.choices?.map((choice, choiceIndex) => (
              <div key={choiceIndex} className="flex items-center space-x-2">
                <RadioGroupItem value={choice} id={`radio-${field.id}-${choiceIndex}`} />
                <Label htmlFor={`radio-${field.id}-${choiceIndex}`} className="text-sm">
                  {choice}
                </Label>
              </div>
            ))}
          </RadioGroup>
          {field.options?.helpText && (
            <p className="text-xs text-gray-500">{field.options.helpText}</p>
          )}
        </div>
      );

    case 'rating':
      const maxRating = field.options?.maxRating || 5;
      return (
        <div className="space-y-2">
          <Label className="text-sm font-medium">{field.label}</Label>
          <div className="flex items-center gap-2 p-3 border rounded-lg bg-gray-50">
            {renderRatingStars(value || 0, maxRating, onChange)}
            <span className="text-sm text-gray-500 ml-2">
              {value || 0} / {maxRating}
            </span>
          </div>
          {field.options?.helpText && (
            <p className="text-xs text-gray-500">{field.options.helpText}</p>
          )}
        </div>
      );

    case 'slider':
      const min = field.options?.minValue || 0;
      const max = field.options?.maxValue || 100;
      const step = field.options?.step || 1;
      return (
        <div className="space-y-2">
          <Label className="text-sm font-medium">{field.label}</Label>
          <div className="px-3 py-4 border rounded-lg bg-gray-50">
            <Slider
              value={[value || min]}
              onValueChange={(values) => onChange(values[0])}
              max={max}
              min={min}
              step={step}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>{min}</span>
              <span className="font-medium">{value || min}</span>
              <span>{max}</span>
            </div>
          </div>
          {field.options?.helpText && (
            <p className="text-xs text-gray-500">{field.options.helpText}</p>
          )}
        </div>
      );

    case 'file':
      return (
        <div className="space-y-2">
          <Label className="text-sm font-medium">{field.label}</Label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
            <div className="text-center">
              <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
              <div className="mb-2">
                <label htmlFor={`file-${field.id}`} className="cursor-pointer">
                  <span className="text-sm text-blue-600 hover:text-blue-500 font-medium">
                    Click to upload
                  </span>
                  <input
                    id={`file-${field.id}`}
                    type="file"
                    className="sr-only"
                    onChange={handleFileUpload}
                    multiple={field.options?.allowMultipleFiles}
                    accept={field.options?.acceptedFileTypes?.join(',') || '*'}
                  />
                </label>
              </div>
              <p className="text-xs text-gray-500">
                {field.options?.acceptedFileTypes?.join(', ') || 'Any file type'}
              </p>
            </div>
            {value && (
              <div className="mt-4 space-y-2">
                {Array.isArray(value) ? (
                  value.map((file: File, index: number) => (
                    <div key={index} className="flex items-center justify-between bg-white p-3 rounded border">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">{file.name}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const newFiles = value.filter((_: File, i: number) => i !== index);
                          onChange(newFiles.length > 0 ? newFiles : null);
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center justify-between bg-white p-3 rounded border">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{value.name}</span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => onChange(null)}>
                      Remove
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
          {field.options?.helpText && (
            <p className="text-xs text-gray-500">{field.options.helpText}</p>
          )}
        </div>
      );

    case 'image':
      return (
        <div className="space-y-2">
          <Label className="text-sm font-medium">{field.label}</Label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
            <div className="text-center">
              <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
              <div className="mb-2">
                <label htmlFor={`image-${field.id}`} className="cursor-pointer">
                  <span className="text-sm text-blue-600 hover:text-blue-500 font-medium">
                    Click to upload image
                  </span>
                  <input
                    id={`image-${field.id}`}
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={handleFileUpload}
                  />
                </label>
              </div>
            </div>
            {value && (
              <div className="mt-4">
                <img
                  src={URL.createObjectURL(value)}
                  alt="Preview"
                  className="max-w-full h-32 object-cover rounded border mx-auto"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onChange(null)}
                  className="mt-2 w-full"
                >
                  Remove Image
                </Button>
              </div>
            )}
          </div>
          {field.options?.helpText && (
            <p className="text-xs text-gray-500">{field.options.helpText}</p>
          )}
        </div>
      );

    case 'inspection':
      return (
        <div className="space-y-2">
          <Label className="text-sm font-medium flex items-center gap-2">
            <Search className="h-4 w-4" />
            {field.label}
          </Label>
          <div className="p-4 border rounded-lg bg-blue-50">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Pass</span>
                <Checkbox
                  checked={value === 'pass'}
                  onCheckedChange={(checked) => onChange(checked ? 'pass' : null)}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Fail</span>
                <Checkbox
                  checked={value === 'fail'}
                  onCheckedChange={(checked) => onChange(checked ? 'fail' : null)}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">N/A</span>
                <Checkbox
                  checked={value === 'na'}
                  onCheckedChange={(checked) => onChange(checked ? 'na' : null)}
                />
              </div>
            </div>
          </div>
          {field.options?.helpText && (
            <p className="text-xs text-gray-500">{field.options.helpText}</p>
          )}
        </div>
      );

    case 'section':
      return (
        <div className="py-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
            {field.label}
          </h3>
        </div>
      );

    case 'divider':
      return (
        <div className="py-2">
          <hr className="border-gray-300" />
        </div>
      );

    case 'info':
      return (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-1">{field.label}</h4>
          {field.options?.infoText && (
            <p className="text-sm text-blue-700">{field.options.infoText}</p>
          )}
        </div>
      );

    default:
      return (
        <div className="p-4 border border-red-200 bg-red-50 rounded">
          <p className="text-red-600 text-sm">
            Unsupported field type: {field.field_type}
          </p>
        </div>
      );
  }
};
