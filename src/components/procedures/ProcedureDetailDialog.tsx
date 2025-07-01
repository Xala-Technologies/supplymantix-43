import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Plus } from 'lucide-react';
import { ProcedureField } from '@/lib/database/procedures/types';
import { ProcedureDialogHeader } from './dialog/ProcedureDialogHeader';
import { ProcedureFieldRenderer } from './dialog/ProcedureFieldRenderer';
import { ProcedureFieldEditor } from './dialog/ProcedureFieldEditor';
import { ProcedureSettingsPanel } from './dialog/ProcedureSettingsPanel';

interface ProcedureDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  procedure: any | null;
  onEdit: (procedure: any) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  getCategoryColor: (category: string) => string;
}

export const ProcedureDetailDialog: React.FC<ProcedureDetailDialogProps> = ({
  open,
  onOpenChange,
  procedure,
  onEdit,
  onDuplicate,
  onDelete,
  getCategoryColor
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<any>({});
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    if (procedure && open) {
      setEditData({
        title: procedure.title || '',
        description: procedure.description || '',
        category: procedure.category || 'Inspection',
        tags: procedure.tags || [],
        is_global: procedure.is_global || false,
        fields: procedure.fields || []
      });
      setFormData({});
    }
  }, [procedure, open]);

  if (!procedure) return null;

  const handleEditStart = () => {
    setIsEditing(true);
  };

  const handleEditSave = () => {
    try {
      onEdit({ ...procedure, ...editData });
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving procedure:', error);
    }
  };

  const handleEditCancel = () => {
    setEditData({
      title: procedure.title || '',
      description: procedure.description || '',
      category: procedure.category || 'Inspection',
      tags: procedure.tags || [],
      is_global: procedure.is_global || false,
      fields: procedure.fields || []
    });
    setIsEditing(false);
  };

  const handleEditDataChange = (updates: any) => {
    setEditData(prev => ({ ...prev, ...updates }));
  };

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !editData.tags.includes(newTag.trim())) {
      setEditData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setEditData(prev => ({
      ...prev,
      tags: prev.tags.filter((tag: string) => tag !== tagToRemove)
    }));
  };

  const addField = () => {
    const newField: ProcedureField = {
      id: crypto.randomUUID(),
      procedure_id: procedure.id,
      label: 'New Field',
      field_type: 'text',
      is_required: false,
      order_index: editData.fields.length,
      options: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    setEditData(prev => ({
      ...prev,
      fields: [...prev.fields, newField]
    }));
  };

  const updateField = (index: number, updates: Partial<ProcedureField>) => {
    setEditData(prev => ({
      ...prev,
      fields: prev.fields.map((field: ProcedureField, i: number) => 
        i === index ? { ...field, ...updates } : field
      )
    }));
  };

  const removeField = (index: number) => {
    setEditData(prev => ({
      ...prev,
      fields: prev.fields.filter((_: any, i: number) => i !== index)
    }));
  };

  const moveField = (index: number, direction: 'up' | 'down') => {
    const fields = [...editData.fields];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex >= 0 && targetIndex < fields.length) {
      [fields[index], fields[targetIndex]] = [fields[targetIndex], fields[index]];
      
      fields.forEach((field, i) => {
        field.order_index = i;
      });
      
      setEditData(prev => ({ ...prev, fields }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[85vh] flex flex-col">
        <DialogHeader className="flex-shrink-0 pb-4">
          <ProcedureDialogHeader
            procedure={procedure}
            isEditing={isEditing}
            editData={editData}
            onEditStart={handleEditStart}
            onEditSave={handleEditSave}
            onEditCancel={handleEditCancel}
            onEditDataChange={handleEditDataChange}
          />
        </DialogHeader>

        <Tabs defaultValue={isEditing ? "settings" : "fields"} className="flex-1 flex flex-col min-h-0">
          <TabsList className="flex-shrink-0 grid w-full grid-cols-2">
            <TabsTrigger value="fields">
              {isEditing ? 'Edit Fields' : 'Fields'}
            </TabsTrigger>
            <TabsTrigger value="settings">
              Settings
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 min-h-0">
            <TabsContent value="fields" className="h-full p-4 overflow-y-auto space-y-3 mt-0">
              {isEditing ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Procedure Fields</h3>
                    <Button onClick={addField} size="sm">
                      <Plus className="h-4 w-4 mr-1" />
                      Add Field
                    </Button>
                  </div>
                  
                  {editData.fields?.length > 0 ? (
                    <div className="space-y-3">
                      {editData.fields.map((field: ProcedureField, index: number) => (
                        <ProcedureFieldEditor
                          key={field.id}
                          field={field}
                          index={index}
                          onUpdate={updateField}
                          onMove={moveField}
                          onRemove={removeField}
                          totalFields={editData.fields.length}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                      <h3 className="font-medium text-gray-900 mb-2">No Fields Yet</h3>
                      <p className="text-gray-500 mb-3">Add fields to build your procedure form.</p>
                      <Button onClick={addField} size="sm">
                        <Plus className="h-4 w-4 mr-1" />
                        Add First Field
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                procedure.fields && procedure.fields.length > 0 ? (
                  <div className="space-y-3">
                    {procedure.fields.map((field: any, index: number) => (
                      <Card key={field.id || index}>
                        <CardContent className="p-3">
                          <ProcedureFieldRenderer
                            field={field}
                            index={index}
                            value={formData[field.id]}
                            onChange={handleFieldChange}
                          />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                    <h3 className="font-medium text-gray-900 mb-2">No Fields</h3>
                    <p className="text-gray-500">This procedure doesn't have any fields yet.</p>
                  </div>
                )
              )}
            </TabsContent>

            <TabsContent value="settings" className="h-full p-4 overflow-y-auto mt-0">
              <ProcedureSettingsPanel
                procedure={procedure}
                isEditing={isEditing}
                editData={editData}
                newTag={newTag}
                onEditDataChange={handleEditDataChange}
                onNewTagChange={setNewTag}
                onAddTag={addTag}
                onRemoveTag={removeTag}
              />
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
