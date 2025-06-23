
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { 
  useMeterTriggers, 
  useCreateMeterTrigger, 
  useUpdateMeterTrigger, 
  useDeleteMeterTrigger 
} from "@/hooks/useMetersEnhanced";
import { 
  Plus, 
  Zap, 
  Settings, 
  Trash2, 
  AlertTriangle,
  Edit
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface MeterTriggersManagerProps {
  meterId: string;
}

export const MeterTriggersManager = ({ meterId }: MeterTriggersManagerProps) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTrigger, setEditingTrigger] = useState<any>(null);
  
  const { data: triggers, isLoading } = useMeterTriggers(meterId);
  const createTrigger = useCreateMeterTrigger();
  const updateTrigger = useUpdateMeterTrigger();
  const deleteTrigger = useDeleteMeterTrigger();

  const [formData, setFormData] = useState({
    name: "",
    trigger_condition: "above",
    trigger_value: "",
    action: "create_work_order",
    throttle_hours: "24",
    is_active: true,
  });

  const resetForm = () => {
    setFormData({
      name: "",
      trigger_condition: "above",
      trigger_value: "",
      action: "create_work_order",
      throttle_hours: "24",
      is_active: true,
    });
    setShowCreateForm(false);
    setEditingTrigger(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingTrigger) {
        await updateTrigger.mutateAsync({
          id: editingTrigger.id,
          updates: {
            name: formData.name,
            trigger_condition: formData.trigger_condition,
            trigger_value: Number(formData.trigger_value),
            action: formData.action,
            throttle_hours: Number(formData.throttle_hours),
            is_active: formData.is_active,
          },
        });
      } else {
        await createTrigger.mutateAsync({
          meter_id: meterId,
          name: formData.name,
          trigger_condition: formData.trigger_condition,
          trigger_value: Number(formData.trigger_value),
          action: formData.action,
          throttle_hours: Number(formData.throttle_hours),
          is_active: formData.is_active,
        });
      }
      resetForm();
    } catch (error) {
      console.error("Error saving trigger:", error);
    }
  };

  const handleEdit = (trigger: any) => {
    setFormData({
      name: trigger.name,
      trigger_condition: trigger.trigger_condition,
      trigger_value: trigger.trigger_value.toString(),
      action: trigger.action,
      throttle_hours: trigger.throttle_hours.toString(),
      is_active: trigger.is_active,
    });
    setEditingTrigger(trigger);
    setShowCreateForm(true);
  };

  const handleDelete = async (triggerId: string) => {
    try {
      await deleteTrigger.mutateAsync(triggerId);
    } catch (error) {
      console.error("Error deleting trigger:", error);
    }
  };

  const getConditionDisplay = (condition: string, value: number) => {
    const conditionText = {
      above: `Above ${value}`,
      below: `Below ${value}`,
      equals: `Equals ${value}`,
    };
    return conditionText[condition as keyof typeof conditionText] || condition;
  };

  if (isLoading) {
    return <div>Loading triggers...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Meter Triggers</h3>
          <p className="text-sm text-muted-foreground">
            Set up automated actions when readings meet specific conditions
          </p>
        </div>
        <Button 
          onClick={() => setShowCreateForm(true)}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Trigger
        </Button>
      </div>

      {/* Create/Edit Form */}
      {showCreateForm && (
        <Card className="border-emerald-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              {editingTrigger ? 'Edit Trigger' : 'Create New Trigger'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Trigger Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., High Temperature Alert"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="condition">Condition *</Label>
                  <Select 
                    value={formData.trigger_condition} 
                    onValueChange={(value) => setFormData({ ...formData, trigger_condition: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="above">Above</SelectItem>
                      <SelectItem value="below">Below</SelectItem>
                      <SelectItem value="equals">Equals</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="value">Trigger Value *</Label>
                  <Input
                    id="value"
                    type="number"
                    step="0.01"
                    value={formData.trigger_value}
                    onChange={(e) => setFormData({ ...formData, trigger_value: e.target.value })}
                    placeholder="0"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="throttle">Throttle (hours)</Label>
                  <Input
                    id="throttle"
                    type="number"
                    value={formData.throttle_hours}
                    onChange={(e) => setFormData({ ...formData, throttle_hours: e.target.value })}
                    placeholder="24"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="action">Action</Label>
                <Select 
                  value={formData.action} 
                  onValueChange={(value) => setFormData({ ...formData, action: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="create_work_order">Create Work Order</SelectItem>
                    <SelectItem value="send_notification">Send Notification</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label htmlFor="active">Active</Label>
              </div>

              <div className="flex justify-end space-x-3">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={createTrigger.isPending || updateTrigger.isPending}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  {editingTrigger ? 'Update' : 'Create'} Trigger
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Triggers List */}
      <div className="space-y-4">
        {triggers && triggers.length > 0 ? (
          triggers.map((trigger) => (
            <Card key={trigger.id} className={`${!trigger.is_active ? 'opacity-60' : ''}`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${trigger.is_active ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                    <div>
                      <h4 className="font-semibold">{trigger.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {getConditionDisplay(trigger.trigger_condition, Number(trigger.trigger_value))} • 
                        {trigger.action.replace('_', ' ')} • 
                        Throttle: {trigger.throttle_hours}h
                      </p>
                      {trigger.last_fired_at && (
                        <p className="text-xs text-orange-600">
                          Last fired: {new Date(trigger.last_fired_at).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant={trigger.is_active ? "default" : "secondary"}>
                      {trigger.is_active ? "Active" : "Inactive"}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(trigger)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Trigger</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{trigger.name}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(trigger.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <AlertTriangle className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Triggers Set</h3>
              <p className="text-gray-500 text-center mb-4">
                Create triggers to automatically respond when readings meet specific conditions.
              </p>
              <Button 
                onClick={() => setShowCreateForm(true)}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create First Trigger
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
