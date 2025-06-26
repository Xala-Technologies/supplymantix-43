
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GripVertical, Image, Trash2, MoreHorizontal, Upload, X, ChevronUp, ChevronDown } from 'lucide-react';
import { ProcedureField } from '@/lib/database/procedures-enhanced';

interface FieldEditorProps {
  field: ProcedureField;
  onUpdate: (field: Partial<ProcedureField>) => void;
  onRemove: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
}

export const FieldEditor: React.FC<FieldEditorProps> = ({
  field,
  onUpdate,
  onRemove,
  onMoveUp,
  onMoveDown,
  canMoveUp = false,
  canMoveDown = false
}) => {
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [fieldImage, setFieldImage] = useState<string | null>(field.options?.image || null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const imageUrl = reader.result as string;
        setFieldImage(imageUrl);
        onUpdate({ 
          options: { 
            ...field.options, 
            image: imageUrl 
          } 
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFieldImage(null);
    const newOptions = { ...field.options };
    delete newOptions.image;
    onUpdate({ options: newOptions });
  };

  const handleChoicesUpdate = (choicesText: string) => {
    const choices = choicesText.split('\n').filter(choice => choice.trim() !== '');
    onUpdate({
      options: {
        ...field.options,
        choices
      }
    });
  };

  return (
    <div className="border-t bg-white p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Field Header with Controls */}
        <div className="flex items-center gap-2">
          <GripVertical className="h-4 w-4 text-gray-400" />
          <Input
            value={field.label}
            onChange={(e) => onUpdate({ label: e.target.value })}
            className="flex-1 border-0 bg-transparent text-lg font-medium focus-visible:ring-0 px-0"
            placeholder="Field label"
          />
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={onMoveUp}
              disabled={!canMoveUp}
              className="h-8 w-8 p-0"
            >
              <ChevronUp className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onMoveDown}
              disabled={!canMoveDown}
              className="h-8 w-8 p-0"
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Field Configuration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            {/* Field Type */}
            <div>
              <Label className="text-sm font-medium">Field Type</Label>
              <Select
                value={field.field_type}
                onValueChange={(value) => onUpdate({ field_type: value as ProcedureField['field_type'] })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text Field</SelectItem>
                  <SelectItem value="checkbox">Checkbox</SelectItem>
                  <SelectItem value="number">Number</SelectItem>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="select">Multiple Choice (Single)</SelectItem>
                  <SelectItem value="multiselect">Multiple Choice (Multi)</SelectItem>
                  <SelectItem value="file">File Upload</SelectItem>
                  <SelectItem value="section">Section Heading</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Multiple Choice Options */}
            {(field.field_type === 'select' || field.field_type === 'multiselect') && (
              <div>
                <Label className="text-sm font-medium">Choices (one per line)</Label>
                <Textarea
                  value={field.options?.choices?.join('\n') || ''}
                  onChange={(e) => handleChoicesUpdate(e.target.value)}
                  placeholder="Option 1&#10;Option 2&#10;Option 3"
                  rows={4}
                  className="resize-none"
                />
              </div>
            )}

            {/* Help Text */}
            <div>
              <Label className="text-sm font-medium">Help Text</Label>
              <Input
                value={field.options?.helpText || ''}
                onChange={(e) => onUpdate({ 
                  options: { 
                    ...field.options, 
                    helpText: e.target.value 
                  } 
                })}
                placeholder="Optional help text for users"
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {/* Field Image */}
            <div>
              <Label className="text-sm font-medium">Field Image</Label>
              {fieldImage ? (
                <div className="mt-2 relative">
                  <img 
                    src={fieldImage} 
                    alt="Field" 
                    className="w-full h-32 object-cover rounded-lg border"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={removeImage}
                    className="absolute top-2 right-2 h-6 w-6 p-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <div className="mt-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowImageUpload(true)}
                    className="w-full gap-2"
                  >
                    <Image className="h-4 w-4" />
                    Add Image
                  </Button>
                </div>
              )}
              {showImageUpload && !fieldImage && (
                <div className="mt-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full text-sm"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowImageUpload(false)}
                    className="mt-1"
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>

            {/* Field Settings */}
            <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Required Field</Label>
                <Switch
                  checked={field.is_required}
                  onCheckedChange={(checked) => onUpdate({ is_required: checked })}
                />
              </div>
              
              {field.field_type !== 'section' && (
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Show in Summary</Label>
                  <Switch
                    checked={field.options?.showInSummary || false}
                    onCheckedChange={(checked) => onUpdate({ 
                      options: { 
                        ...field.options, 
                        showInSummary: checked 
                      } 
                    })}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
          
          <Button 
            variant="destructive" 
            size="sm"
            onClick={onRemove}
            className="gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Delete Field
          </Button>
        </div>
      </div>
    </div>
  );
};
