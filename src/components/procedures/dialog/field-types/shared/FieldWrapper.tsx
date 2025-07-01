
import React from 'react';
import { FileText } from 'lucide-react';

interface FieldWrapperProps {
  children: React.ReactNode;
  field: any;
  index: number;
}

export const FieldWrapper: React.FC<FieldWrapperProps> = ({ children, field, index }) => {
  const renderAttachedFile = () => {
    if (!field.options?.attachedFile) return null;

    const { attachedFile } = field.options;
    return (
      <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-start gap-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <FileText className="h-5 w-5 text-blue-600" />
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

  return (
    <div className="space-y-4">
      {children}
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
};
