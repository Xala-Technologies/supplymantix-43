
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, X, MessageSquare } from "lucide-react";
import { useChecklistItems, useCreateChecklistItem, useUpdateChecklistItem } from "@/hooks/useWorkOrdersEnhanced";

interface WorkOrderChecklistProps {
  workOrderId: string;
}

export const WorkOrderChecklist = ({ workOrderId }: WorkOrderChecklistProps) => {
  const [newItemTitle, setNewItemTitle] = useState("");
  const [newItemNote, setNewItemNote] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  const { data: checklistItems, isLoading } = useChecklistItems(workOrderId);
  const createChecklistItem = useCreateChecklistItem();
  const updateChecklistItem = useUpdateChecklistItem();

  const handleAddItem = async () => {
    if (!newItemTitle.trim()) return;

    await createChecklistItem.mutateAsync({
      work_order_id: workOrderId,
      title: newItemTitle.trim(),
      note: newItemNote.trim() || undefined,
    });

    setNewItemTitle("");
    setNewItemNote("");
    setShowAddForm(false);
  };

  const handleToggleComplete = async (id: string, completed: boolean) => {
    await updateChecklistItem.mutateAsync({
      id,
      updates: { completed }
    });
  };

  const completedCount = checklistItems?.filter(item => item.completed).length || 0;
  const totalCount = checklistItems?.length || 0;
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Checklist</CardTitle>
          <div className="flex items-center gap-4">
            {totalCount > 0 && (
              <div className="text-sm text-gray-600">
                {completedCount}/{totalCount} completed ({completionPercentage}%)
              </div>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAddForm(true)}
              className="border-blue-200 text-blue-600 hover:bg-blue-50"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>
        </div>
        
        {totalCount > 0 && (
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        {checklistItems?.length === 0 && !showAddForm && (
          <div className="text-center py-8 text-gray-500">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <MessageSquare className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-sm">No checklist items yet</p>
            <p className="text-xs text-gray-400 mt-1">Add items to track progress</p>
          </div>
        )}

        <div className="space-y-3">
          {checklistItems?.map((item) => (
            <div key={item.id} className="flex items-start gap-3 p-3 border rounded-lg">
              <Checkbox
                checked={item.completed}
                onCheckedChange={(checked) => 
                  handleToggleComplete(item.id, checked as boolean)
                }
                className="mt-0.5"
              />
              
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${
                  item.completed 
                    ? 'line-through text-gray-500' 
                    : 'text-gray-900'
                }`}>
                  {item.title}
                </p>
                {item.note && (
                  <p className={`text-xs mt-1 ${
                    item.completed 
                      ? 'text-gray-400' 
                      : 'text-gray-600'
                  }`}>
                    {item.note}
                  </p>
                )}
              </div>
            </div>
          ))}

          {showAddForm && (
            <div className="p-4 border-2 border-dashed border-blue-200 rounded-lg bg-blue-50">
              <div className="space-y-3">
                <Input
                  placeholder="Checklist item title..."
                  value={newItemTitle}
                  onChange={(e) => setNewItemTitle(e.target.value)}
                  className="bg-white"
                />
                <Textarea
                  placeholder="Notes (optional)..."
                  value={newItemNote}
                  onChange={(e) => setNewItemNote(e.target.value)}
                  className="bg-white min-h-[60px]"
                />
                
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={handleAddItem}
                    disabled={!newItemTitle.trim() || createChecklistItem.isPending}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {createChecklistItem.isPending ? "Adding..." : "Add Item"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setShowAddForm(false);
                      setNewItemTitle("");
                      setNewItemNote("");
                    }}
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
