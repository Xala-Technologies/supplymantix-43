
import React from 'react';
import { DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlayCircle, Globe, Edit, Save, X } from 'lucide-react';

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

interface ProcedureDialogHeaderProps {
  procedure: any;
  isEditing: boolean;
  editData: any;
  onEditStart: () => void;
  onEditSave: () => void;
  onEditCancel: () => void;
  onEditDataChange: (updates: any) => void;
}

export const ProcedureDialogHeader: React.FC<ProcedureDialogHeaderProps> = ({
  procedure,
  isEditing,
  editData,
  onEditStart,
  onEditSave,
  onEditCancel,
  onEditDataChange
}) => {
  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <PlayCircle className="h-5 w-5 text-gray-600" />
          {isEditing ? (
            <Input
              value={editData.title}
              onChange={(e) => onEditDataChange({ title: e.target.value })}
              className="text-lg font-semibold"
              placeholder="Procedure title"
            />
          ) : (
            <DialogTitle className="text-lg font-semibold">
              {procedure.title}
            </DialogTitle>
          )}
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button onClick={onEditSave} size="sm">
                <Save className="h-4 w-4 mr-1" />
                Save
              </Button>
              <Button onClick={onEditCancel} variant="outline" size="sm">
                <X className="h-4 w-4 mr-1" />
                Cancel
              </Button>
            </>
          ) : (
            <Button onClick={onEditStart} variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {isEditing ? (
          <Select
            value={editData.category}
            onValueChange={(value) => onEditDataChange({ category: value })}
          >
            <SelectTrigger className="w-40">
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
        ) : (
          <Badge variant="secondary">
            {procedure.category || 'Other'}
          </Badge>
        )}
        {(isEditing ? editData.is_global : procedure.is_global) && (
          <Badge variant="outline" className="text-blue-600 border-blue-200">
            <Globe className="h-3 w-3 mr-1" />
            Global
          </Badge>
        )}
        <span className="text-sm text-gray-500">
          {(isEditing ? editData.fields : procedure.fields)?.length || 0} fields
        </span>
      </div>
    </>
  );
};
