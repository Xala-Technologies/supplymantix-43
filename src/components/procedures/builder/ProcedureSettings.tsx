
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Tag, Users, Globe, Building } from 'lucide-react';

interface ProcedureSettingsProps {
  formData: {
    title: string;
    description: string;
    category: string;
    tags: string[];
    is_global: boolean;
  };
  onUpdate: (updates: Partial<typeof formData>) => void;
  newTag: string;
  setNewTag: (tag: string) => void;
  onAddTag: () => void;
  onRemoveTag: (tag: string) => void;
}

const CATEGORIES = [
  { value: 'Inspection', label: 'Inspection', color: 'bg-blue-500' },
  { value: 'Safety', label: 'Safety', color: 'bg-red-500' },
  { value: 'Calibration', label: 'Calibration', color: 'bg-purple-500' },
  { value: 'Reactive Maintenance', label: 'Reactive Maintenance', color: 'bg-orange-500' },
  { value: 'Preventive Maintenance', label: 'Preventive Maintenance', color: 'bg-green-500' },
  { value: 'Quality Control', label: 'Quality Control', color: 'bg-indigo-500' },
  { value: 'Training', label: 'Training', color: 'bg-yellow-500' },
  { value: 'Other', label: 'Other', color: 'bg-gray-500' }
];

export const ProcedureSettings: React.FC<ProcedureSettingsProps> = ({
  formData,
  onUpdate,
  newTag,
  setNewTag,
  onAddTag,
  onRemoveTag
}) => {
  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Procedure Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => onUpdate({ title: e.target.value })}
                placeholder="Enter a clear, descriptive title"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => onUpdate({ description: e.target.value })}
                placeholder="Describe what this procedure accomplishes"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => onUpdate({ category: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(category => (
                    <SelectItem key={category.value} value={category.value}>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${category.color}`} />
                        {category.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Tags */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="h-5 w-5 text-purple-600" />
              Tags
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2 min-h-[40px] p-3 border rounded-lg bg-gray-50">
              {formData.tags.length === 0 && (
                <span className="text-gray-500 text-sm">No tags added yet</span>
              )}
              {formData.tags.map(tag => (
                <Badge 
                  key={tag} 
                  variant="secondary" 
                  className="cursor-pointer hover:bg-red-100 hover:text-red-700 transition-colors" 
                  onClick={() => onRemoveTag(tag)}
                >
                  {tag} ×
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), onAddTag())}
              />
              <Button onClick={onAddTag} variant="outline">
                Add
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Visibility */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-indigo-600" />
              Visibility & Access
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  {formData.is_global ? (
                    <Globe className="h-5 w-5 text-blue-600" />
                  ) : (
                    <Building className="h-5 w-5 text-blue-600" />
                  )}
                </div>
                <div>
                  <Label htmlFor="is_global" className="text-base font-medium">
                    {formData.is_global ? 'Global Procedure' : 'Organization Only'}
                  </Label>
                  <p className="text-sm text-gray-600">
                    {formData.is_global 
                      ? 'Available to all users across organizations' 
                      : 'Only available to your organization members'
                    }
                  </p>
                </div>
              </div>
              <Switch
                id="is_global"
                checked={formData.is_global}
                onCheckedChange={(checked) => onUpdate({ is_global: checked })}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
