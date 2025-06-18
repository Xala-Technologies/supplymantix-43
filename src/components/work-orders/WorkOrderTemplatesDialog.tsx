
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit, Trash2, FileText, X, GripVertical } from "lucide-react";
import { useWorkOrderTemplates, useCreateWorkOrderTemplate, useUpdateWorkOrderTemplate, useDeleteWorkOrderTemplate, useCreateWorkOrderFromTemplate } from "@/hooks/useWorkOrderTemplates";

interface TemplateFormData {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  default_tags: string[];
  checklistItems: Array<{ id?: string; title: string; note?: string; order_index: number }>;
}

interface WorkOrderTemplatesDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WorkOrderTemplatesDialog = ({ isOpen, onClose }: WorkOrderTemplatesDialogProps) => {
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<TemplateFormData>({
    title: "",
    description: "",
    priority: "medium",
    default_tags: [],
    checklistItems: [],
  });
  const [newTag, setNewTag] = useState("");
  const [newChecklistItem, setNewChecklistItem] = useState({ title: "", note: "" });

  const { data: templates, isLoading } = useWorkOrderTemplates();
  const createTemplate = useCreateWorkOrderTemplate();
  const updateTemplate = useUpdateWorkOrderTemplate();
  const deleteTemplate = useDeleteWorkOrderTemplate();
  const createFromTemplate = useCreateWorkOrderFromTemplate();

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      priority: "medium",
      default_tags: [],
      checklistItems: [],
    });
    setSelectedTemplate(null);
    setIsEditing(false);
  };

  const handleEdit = (template: any) => {
    setSelectedTemplate(template);
    setFormData({
      title: template.title,
      description: template.description || "",
      priority: template.priority,
      default_tags: template.default_tags || [],
      checklistItems: (template.template_checklist_items || []).map((item: any, index: number) => ({
        id: item.id,
        title: item.title,
        note: item.note || "",
        order_index: index,
      })),
    });
    setIsEditing(true);
  };

  const handleSubmit = async () => {
    if (!formData.title.trim()) return;

    try {
      if (isEditing && selectedTemplate) {
        await updateTemplate.mutateAsync({
          id: selectedTemplate.id,
          updates: {
            title: formData.title,
            description: formData.description,
            priority: formData.priority as any,
            default_tags: formData.default_tags,
          },
          checklistItems: formData.checklistItems,
        });
      } else {
        await createTemplate.mutateAsync({
          template: {
            title: formData.title,
            description: formData.description,
            priority: formData.priority as any,
            default_tags: formData.default_tags,
            tenant_id: "current-tenant-id", // This should come from auth context
          },
          checklistItems: formData.checklistItems,
        });
      }
      resetForm();
    } catch (error) {
      console.error("Submit error:", error);
    }
  };

  const handleDelete = async (templateId: string) => {
    if (window.confirm("Are you sure you want to delete this template? This will also delete all associated checklist items.")) {
      try {
        await deleteTemplate.mutateAsync(templateId);
        if (selectedTemplate?.id === templateId) {
          resetForm();
        }
      } catch (error) {
        console.error("Delete error:", error);
      }
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.default_tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        default_tags: [...prev.default_tags, newTag.trim()]
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      default_tags: prev.default_tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const addChecklistItem = () => {
    if (newChecklistItem.title.trim()) {
      setFormData(prev => ({
        ...prev,
        checklistItems: [
          ...prev.checklistItems,
          {
            title: newChecklistItem.title.trim(),
            note: newChecklistItem.note.trim(),
            order_index: prev.checklistItems.length,
          }
        ]
      }));
      setNewChecklistItem({ title: "", note: "" });
    }
  };

  const removeChecklistItem = (indexToRemove: number) => {
    setFormData(prev => ({
      ...prev,
      checklistItems: prev.checklistItems
        .filter((_, index) => index !== indexToRemove)
        .map((item, index) => ({ ...item, order_index: index }))
    }));
  };

  const handleCreateFromTemplate = async (template: any) => {
    try {
      await createFromTemplate.mutateAsync(template.id);
      onClose();
    } catch (error) {
      console.error("Create from template error:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Work Order Templates</DialogTitle>
        </DialogHeader>
        
        <div className="flex gap-6 h-[calc(90vh-120px)]">
          {/* Templates List */}
          <div className="w-1/2 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Templates</h3>
              <Button onClick={() => setIsEditing(true)} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                New Template
              </Button>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-3">
              {isLoading ? (
                <div className="text-center py-8 text-gray-500">Loading templates...</div>
              ) : templates?.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No templates found</div>
              ) : (
                templates?.map((template) => (
                  <Card key={template.id} className="cursor-pointer hover:bg-gray-50">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-base">{template.title}</CardTitle>
                          {template.description && (
                            <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCreateFromTemplate(template)}
                          >
                            <FileText className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(template)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(template.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Badge variant="outline">{template.priority} priority</Badge>
                        {template.template_checklist_items?.length > 0 && (
                          <span>{template.template_checklist_items.length} checklist items</span>
                        )}
                      </div>
                      {template.default_tags?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {template.default_tags.map((tag: string) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* Form */}
          {isEditing && (
            <div className="w-1/2 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">
                  {selectedTemplate ? "Edit Template" : "New Template"}
                </h3>
                <Button variant="ghost" size="sm" onClick={resetForm}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="flex-1 overflow-y-auto space-y-4">
                <div>
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Template title..."
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Template description..."
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Priority</label>
                  <Select value={formData.priority} onValueChange={(value: any) => setFormData(prev => ({ ...prev, priority: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Default Tags</label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add tag..."
                      onKeyPress={(e) => e.key === 'Enter' && addTag()}
                    />
                    <Button onClick={addTag} size="sm">Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {formData.default_tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                        <button
                          onClick={() => removeTag(tag)}
                          className="ml-1 text-gray-500 hover:text-gray-700"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Checklist Items</label>
                  <div className="space-y-2 mb-3">
                    <Input
                      value={newChecklistItem.title}
                      onChange={(e) => setNewChecklistItem(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Checklist item title..."
                    />
                    <Input
                      value={newChecklistItem.note}
                      onChange={(e) => setNewChecklistItem(prev => ({ ...prev, note: e.target.value }))}
                      placeholder="Note (optional)..."
                    />
                    <Button onClick={addChecklistItem} size="sm" className="w-full">
                      Add Checklist Item
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    {formData.checklistItems.map((item, index) => (
                      <div key={index} className="flex items-start gap-2 p-2 border rounded">
                        <GripVertical className="w-4 h-4 text-gray-400 mt-1" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{item.title}</p>
                          {item.note && <p className="text-xs text-gray-600">{item.note}</p>}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeChecklistItem(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t">
                  <Button
                    onClick={handleSubmit}
                    disabled={!formData.title.trim() || createTemplate.isPending || updateTemplate.isPending}
                    className="flex-1"
                  >
                    {createTemplate.isPending || updateTemplate.isPending ? "Saving..." : "Save Template"}
                  </Button>
                  <Button variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
