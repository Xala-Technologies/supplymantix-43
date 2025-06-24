
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface ChecklistItem {
  id: string;
  title: string;
  completed: boolean;
  note?: string;
}

interface EnhancedChecklistSimpleProps {
  workOrderId: string;
  onUpdate?: () => void;
}

export const EnhancedChecklistSimple = ({ workOrderId, onUpdate }: EnhancedChecklistSimpleProps) => {
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [newItemTitle, setNewItemTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Initialize with some default items if none exist
  useEffect(() => {
    if (items.length === 0) {
      setItems([
        {
          id: '1',
          title: 'Initial inspection completed',
          completed: false
        },
        {
          id: '2', 
          title: 'Parts and materials gathered',
          completed: false
        },
        {
          id: '3',
          title: 'Safety measures implemented',
          completed: true
        }
      ]);
    }
  }, [items.length]);

  const handleAddItem = () => {
    if (!newItemTitle.trim()) {
      toast.error("Please enter a title for the checklist item");
      return;
    }

    const newItem: ChecklistItem = {
      id: Date.now().toString(),
      title: newItemTitle.trim(),
      completed: false
    };

    setItems(prev => [...prev, newItem]);
    setNewItemTitle("");
    toast.success("Checklist item added");
    
    if (onUpdate) {
      onUpdate();
    }
  };

  const handleToggleItem = (id: string) => {
    setItems(prev => prev.map(item => 
      item.id === id 
        ? { ...item, completed: !item.completed }
        : item
    ));
    
    if (onUpdate) {
      onUpdate();
    }
  };

  const handleDeleteItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
    toast.success("Checklist item removed");
    
    if (onUpdate) {
      onUpdate();
    }
  };

  const handleUpdateNote = (id: string, note: string) => {
    setItems(prev => prev.map(item => 
      item.id === id 
        ? { ...item, note }
        : item
    ));
  };

  const completedCount = items.filter(item => item.completed).length;
  const totalCount = items.length;
  const completionPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <span>Work Order Checklist</span>
          </div>
          <div className="text-sm font-normal text-slate-500">
            {completedCount}/{totalCount} completed ({Math.round(completionPercentage)}%)
          </div>
        </CardTitle>
        
        {/* Progress bar */}
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div 
            className="bg-green-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Add new item */}
        <div className="flex gap-2">
          <Input
            placeholder="Add new checklist item..."
            value={newItemTitle}
            onChange={(e) => setNewItemTitle(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleAddItem();
              }
            }}
            className="flex-1"
          />
          <Button 
            onClick={handleAddItem}
            size="sm"
            className="shrink-0"
            disabled={!newItemTitle.trim()}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {/* Checklist items */}
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start gap-3">
                <Checkbox
                  checked={item.completed}
                  onCheckedChange={() => handleToggleItem(item.id)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className={`font-medium ${item.completed ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                    {item.title}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteItem(item.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              
              <Textarea
                placeholder="Add notes for this item..."
                value={item.note || ''}
                onChange={(e) => handleUpdateNote(item.id, e.target.value)}
                className="text-sm"
                rows={2}
              />
            </div>
          ))}

          {items.length === 0 && (
            <div className="text-center py-8 text-slate-500">
              <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-slate-300" />
              <p>No checklist items yet</p>
              <p className="text-sm">Add items above to track work progress</p>
            </div>
          )}
        </div>

        {/* Summary */}
        {totalCount > 0 && (
          <div className="pt-4 border-t">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-600">Progress Summary</span>
              <span className={`font-semibold ${completionPercentage === 100 ? 'text-green-600' : 'text-slate-700'}`}>
                {completionPercentage === 100 ? 'All tasks completed!' : `${completedCount} of ${totalCount} tasks done`}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
