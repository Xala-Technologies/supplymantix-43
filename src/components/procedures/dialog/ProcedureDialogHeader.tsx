
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Edit2, Save, X, Loader2 } from 'lucide-react';

interface ProcedureDialogHeaderProps {
  procedure: any;
  isEditing: boolean;
  isSaving?: boolean;
  editData: any;
  onEditStart: () => void;
  onEditSave: () => void;
  onEditCancel: () => void;
  onEditDataChange: (updates: any) => void;
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

export const ProcedureDialogHeader: React.FC<ProcedureDialogHeaderProps> = ({
  procedure,
  isEditing,
  isSaving = false,
  editData,
  onEditStart,
  onEditSave,
  onEditCancel,
  onEditDataChange
}) => {
  const getCategoryColor = (category: string) => {
    const categoryData = CATEGORIES.find(cat => cat.value === category);
    return categoryData?.color || 'bg-gray-500';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-3">
          {isEditing ? (
            <>
              <Input
                value={editData.title}
                onChange={(e) => onEditDataChange({ title: e.target.value })}
                placeholder="Procedure title"
                className="text-xl font-semibold border-0 p-0 shadow-none focus-visible:ring-0"
                disabled={isSaving}
              />
              <Textarea
                value={editData.description || ''}
                onChange={(e) => onEditDataChange({ description: e.target.value })}
                placeholder="Procedure description"
                className="text-gray-600 border-0 p-0 shadow-none focus-visible:ring-0 resize-none"
                rows={2}
                disabled={isSaving}
              />
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Category:</span>
                  <Select
                    value={editData.category}
                    onValueChange={(value) => onEditDataChange({ category: value })}
                    disabled={isSaving}
                  >
                    <SelectTrigger className="w-48">
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
              </div>
            </>
          ) : (
            <>
              <h2 className="text-xl font-semibold text-gray-900">
                {procedure.title}
              </h2>
              {procedure.description && (
                <p className="text-gray-600">
                  {procedure.description}
                </p>
              )}
              <div className="flex items-center gap-4">
                <Badge 
                  variant="secondary" 
                  className={`${getCategoryColor(procedure.category)} text-white`}
                >
                  {procedure.category}
                </Badge>
                {procedure.is_global && (
                  <Badge variant="outline">Global</Badge>
                )}
                {procedure.tags && procedure.tags.length > 0 && (
                  <div className="flex items-center gap-1">
                    {procedure.tags.slice(0, 3).map((tag: string) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {procedure.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{procedure.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        <div className="flex items-center gap-3">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={onEditCancel}
                disabled={isSaving}
                className="mr-2"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={onEditSave}
                disabled={isSaving || !editData.title?.trim()}
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                {isSaving ? 'Saving...' : 'Save'}
              </Button>
            </>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={onEditStart}
            >
              <Edit2 className="h-4 w-4 mr-2" />
              Edit
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
