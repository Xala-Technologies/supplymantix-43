
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, CheckCircle2, Clock, Target } from "lucide-react";
import { toast } from "sonner";

interface ChecklistItem {
  id: string;
  title: string;
  completed: boolean;
  note?: string;
  createdAt: string;
}

interface EnhancedChecklistSimpleProps {
  workOrderId: string;
  onUpdate?: () => void;
}

export const EnhancedChecklistSimple = ({ workOrderId, onUpdate }: EnhancedChecklistSimpleProps) => {
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [newItemTitle, setNewItemTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Initialize with default items only once
  useEffect(() => {
    if (!initialized) {
      setItems([
        {
          id: '1',
          title: 'Initial inspection completed',
          completed: false,
          createdAt: new Date().toISOString()
        },
        {
          id: '2', 
          title: 'Parts and materials gathered',
          completed: false,
          createdAt: new Date().toISOString()
        },
        {
          id: '3',
          title: 'Safety measures implemented',
          completed: true,
          createdAt: new Date().toISOString()
        }
      ]);
      setInitialized(true);
    }
  }, [initialized]);

  const handleAddItem = () => {
    if (!newItemTitle.trim()) {
      toast.error("Please enter a title for the checklist item");
      return;
    }

    const newItem: ChecklistItem = {
      id: Date.now().toString(),
      title: newItemTitle.trim(),
      completed: false,
      createdAt: new Date().toISOString()
    };

    setItems(prev => [...prev, newItem]);
    setNewItemTitle("");
    toast.success("Checklist item added successfully");
    
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
    toast.success("Checklist item removed successfully");
    
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
    <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50/50">
      <CardHeader className="bg-gradient-to-r from-emerald-50 via-blue-50 to-purple-50 rounded-t-lg border-b border-gray-100">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
              {completionPercentage === 100 && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                  <Target className="w-2.5 h-2.5 text-white" />
                </div>
              )}
            </div>
            <div>
              <span className="text-lg font-semibold text-gray-800">Work Order Checklist</span>
              <div className="flex items-center gap-2 mt-1">
                <Clock className="w-3.5 h-3.5 text-gray-500" />
                <span className="text-xs text-gray-500">Track your progress</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-gray-800">
              {completedCount}/{totalCount}
            </div>
            <div className="text-xs text-gray-500 font-medium">
              {Math.round(completionPercentage)}% complete
            </div>
          </div>
        </CardTitle>
        
        {/* Enhanced Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-3 mt-4 overflow-hidden shadow-inner">
          <div 
            className={`h-3 rounded-full transition-all duration-500 ease-out relative ${
              completionPercentage === 100 
                ? 'bg-gradient-to-r from-green-400 to-emerald-500' 
                : 'bg-gradient-to-r from-blue-400 to-purple-500'
            }`}
            style={{ width: `${completionPercentage}%` }}
          >
            {completionPercentage > 10 && (
              <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse" />
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 p-6">
        {/* Enhanced Add new item section */}
        <div className="bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-xl p-4 border border-gray-100">
          <div className="flex gap-3">
            <Input
              placeholder="Add new checklist item..."
              value={newItemTitle}
              onChange={(e) => setNewItemTitle(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleAddItem();
                }
              }}
              className="flex-1 border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 rounded-lg"
            />
            <Button 
              onClick={handleAddItem}
              size="sm"
              className="shrink-0 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all duration-200 rounded-lg px-4"
              disabled={!newItemTitle.trim()}
            >
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Button>
          </div>
        </div>

        {/* Enhanced Checklist items */}
        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={item.id} className={`group relative overflow-hidden rounded-xl transition-all duration-300 hover:shadow-md ${
              item.completed 
                ? 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200' 
                : 'bg-white border border-gray-200 hover:border-blue-300'
            }`}>
              {/* Completion indicator line */}
              {item.completed && (
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-emerald-500" />
              )}
              
              <div className="p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex items-center pt-1">
                    <Checkbox
                      checked={item.completed}
                      onCheckedChange={() => handleToggleItem(item.id)}
                      className={`transition-all duration-200 ${
                        item.completed 
                          ? 'border-green-500 data-[state=checked]:bg-green-500' 
                          : 'border-gray-300 hover:border-blue-400'
                      }`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`font-medium transition-all duration-200 ${
                      item.completed 
                        ? 'line-through text-green-700/80 text-sm' 
                        : 'text-gray-900'
                    }`}>
                      {item.title}
                    </div>
                    {item.completed && (
                      <div className="text-xs text-green-600 mt-1 font-medium">
                        ✓ Completed
                      </div>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteItem(item.id)}
                    className="opacity-0 group-hover:opacity-100 transition-all duration-200 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                
                <Textarea
                  placeholder="Add notes for this item..."
                  value={item.note || ''}
                  onChange={(e) => handleUpdateNote(item.id, e.target.value)}
                  className={`text-sm border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 rounded-lg resize-none transition-all duration-200 ${
                    item.completed ? 'bg-green-50/50' : 'bg-gray-50/50'
                  }`}
                  rows={2}
                />
              </div>
            </div>
          ))}

          {items.length === 0 && (
            <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-xl border-2 border-dashed border-gray-300">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-600 mb-2">No checklist items yet</h3>
              <p className="text-sm text-gray-500 max-w-xs mx-auto">
                Add items above to track your work progress and stay organized
              </p>
            </div>
          )}
        </div>

        {/* Enhanced Summary */}
        {totalCount > 0 && (
          <div className={`rounded-xl p-4 border transition-all duration-300 ${
            completionPercentage === 100 
              ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200' 
              : 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200'
          }`}>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  completionPercentage === 100 ? 'bg-green-500' : 'bg-blue-500'
                }`} />
                <span className="text-sm font-medium text-gray-700">Progress Summary</span>
              </div>
              <div className={`text-sm font-semibold ${
                completionPercentage === 100 
                  ? 'text-green-700' 
                  : 'text-blue-700'
              }`}>
                {completionPercentage === 100 
                  ? '🎉 All tasks completed!' 
                  : `${completedCount} of ${totalCount} tasks done`
                }
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
