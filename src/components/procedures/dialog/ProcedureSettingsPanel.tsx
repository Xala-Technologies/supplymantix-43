
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Calendar, Tag, CheckCircle, X } from 'lucide-react';

const CATEGORIES = [
  'Inspection',
  'Safety',
  'Calibration', 
  'Reactive Maintenance',
  'Preventive Maintenance',
  'Quality Control',
  'Training',
  'Other'
];

interface ProcedureSettingsPanelProps {
  procedure: any;
  isEditing: boolean;
  editData: any;
  newTag: string;
  onEditDataChange: (updates: any) => void;
  onNewTagChange: (value: string) => void;
  onAddTag: () => void;
  onRemoveTag: (tag: string) => void;
}

export const ProcedureSettingsPanel: React.FC<ProcedureSettingsPanelProps> = ({
  procedure,
  isEditing,
  editData,
  newTag,
  onEditDataChange,
  onNewTagChange,
  onAddTag,
  onRemoveTag
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isEditing) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label>Title *</Label>
              <Input
                value={editData.title}
                onChange={(e) => onEditDataChange({ title: e.target.value })}
                placeholder="Procedure title"
              />
            </div>
            
            <div>
              <Label>Description</Label>
              <Textarea
                value={editData.description}
                onChange={(e) => onEditDataChange({ description: e.target.value })}
                placeholder="Procedure description"
                rows={3}
              />
            </div>

            <div>
              <Label>Category</Label>
              <Select
                value={editData.category}
                onValueChange={(value) => onEditDataChange({ category: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Tags</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {editData.tags?.map((tag: string, index: number) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <button
                    onClick={() => onRemoveTag(tag)}
                    className="ml-1 hover:text-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => onNewTagChange(e.target.value)}
                placeholder="Add a tag"
                onKeyPress={(e) => e.key === 'Enter' && onAddTag()}
              />
              <Button onClick={onAddTag} size="sm">
                Add
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Visibility</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <Label>Global Procedure</Label>
                <p className="text-sm text-gray-600">Available to all users</p>
              </div>
              <Switch
                checked={Boolean(editData.is_global)}
                onCheckedChange={(checked) => onEditDataChange({ is_global: Boolean(checked) })}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold mb-2">Description</h3>
          <p className="text-gray-700">
            {procedure.description || 'No description provided'}
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-2">Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-400" />
                <span>Created by {procedure.created_by || 'Unknown'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span>
                  {procedure.created_at ? formatDate(procedure.created_at) : 'Unknown'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-2">Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-gray-400" />
                <Badge variant="secondary">
                  {procedure.category || 'Other'}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-gray-400" />
                <span>{procedure.fields?.length || 0} fields</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
