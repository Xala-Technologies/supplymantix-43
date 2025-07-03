
import React from 'react';
import { Star, Upload, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { FieldWrapper } from './shared/FieldWrapper';
import { FieldLabel } from './shared/FieldLabel';

interface SpecialFieldProps {
  field: any;
  index: number;
  value: any;
  onChange: (fieldId: string, value: any) => void;
}

export const RatingField: React.FC<SpecialFieldProps> = ({ field, index, value, onChange }) => {
  const fieldValue = value || field.options?.defaultValue || 0;
  const maxRating = field.options?.maxRating || 5;

  return (
    <FieldWrapper field={field} index={index}>
      <div key={field.id || index} className="space-y-3">
        <FieldLabel field={field} />
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center gap-1">
            {Array.from({ length: maxRating }, (_, i) => {
              const starValue = i + 1;
              const isSelected = fieldValue >= starValue;
              
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => onChange(field.id, starValue)}
                  className="text-2xl focus:outline-none hover:scale-110 transition-transform"
                >
                  <Star 
                    className={`h-7 w-7 ${
                      isSelected ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 hover:text-yellow-300'
                    }`}
                  />
                </button>
              );
            })}
            {fieldValue > 0 && (
              <span className="ml-2 text-sm text-gray-600 font-medium">
                {fieldValue} / {maxRating}
              </span>
            )}
          </div>
        </div>
      </div>
    </FieldWrapper>
  );
};

export const FileField: React.FC<SpecialFieldProps> = ({ field, index, value, onChange }) => {
  return (
    <FieldWrapper field={field} index={index}>
      <div key={field.id || index} className="space-y-3">
        <FieldLabel field={field} />
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-3" />
          <p className="text-sm text-gray-700 mb-2">
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
            className="mt-3 text-sm w-full"
          />
        </div>
      </div>
    </FieldWrapper>
  );
};

export const InspectionField: React.FC<SpecialFieldProps> = ({ field, index, value, onChange }) => {
  const fieldValue = value || field.options?.defaultValue || '';

  return (
    <FieldWrapper field={field} index={index}>
      <div key={field.id || index} className="space-y-3">
        <FieldLabel field={field} />
        <div className="flex gap-3">
          {['Pass', 'Fail', 'Flag'].map((option) => (
            <Button
              key={option}
              type="button"
              variant={fieldValue === option ? "default" : "outline"}
              size="sm"
              onClick={() => onChange(field.id, option)}
              className={`flex-1 transition-all ${
                fieldValue === option 
                  ? option === 'Pass' ? 'bg-green-600 hover:bg-green-700 text-white border-green-600' :
                    option === 'Fail' ? 'bg-red-600 hover:bg-red-700 text-white border-red-600' :
                    'bg-yellow-600 hover:bg-yellow-700 text-white border-yellow-600'
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
    </FieldWrapper>
  );
};

export const SectionField: React.FC<SpecialFieldProps> = ({ field, index }) => {
  const isCard = field.options?.style === 'card';
  const description = field.options?.description || field.description;
  
  const content = (
    <div key={field.id || index} className={isCard ? "p-4" : "py-6"}>
      <h3 className={`text-xl font-semibold text-gray-900 ${isCard ? 'mb-3' : 'border-b border-gray-200 pb-3'}`}>
        {field.label || field.title}
      </h3>
      {description && (
        <p className="text-sm text-gray-600 mt-2">{description}</p>
      )}
    </div>
  );

  return (
    <FieldWrapper field={field} index={index}>
      {isCard ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg">
          {content}
        </div>
      ) : (
        content
      )}
    </FieldWrapper>
  );
};

export const DividerField: React.FC<SpecialFieldProps> = ({ field, index }) => {
  return (
    <div key={field.id || index} className="py-4">
      <Separator className="my-2" />
    </div>
  );
};

export const InfoField: React.FC<SpecialFieldProps> = ({ field, index }) => {
  return (
    <FieldWrapper field={field} index={index}>
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
    </FieldWrapper>
  );
};

export const DefaultField: React.FC<SpecialFieldProps> = ({ field, index, value, onChange }) => {
  const fieldValue = value || field.options?.defaultValue || '';

  return (
    <FieldWrapper field={field} index={index}>
      <div key={field.id || index} className="space-y-3">
        <FieldLabel field={field} />
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
    </FieldWrapper>
  );
};
