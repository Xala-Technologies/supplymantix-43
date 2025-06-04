
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { User, Users, Calendar, Clock, Mail, Phone } from "lucide-react";
import { format } from "date-fns";

interface WorkOrderAssignmentProps {
  workOrder: any;
  onAssignmentChange?: (assigneeIds: string[], comment?: string) => void;
}

interface Assignee {
  id: string;
  name: string;
  type: 'user' | 'team';
  email?: string;
  phone?: string;
  skills?: string[];
  availability?: 'available' | 'busy' | 'unavailable';
  currentWorkload?: number;
}

export const WorkOrderAssignment = ({ workOrder, onAssignmentChange }: WorkOrderAssignmentProps) => {
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([]);
  const [assignmentComment, setAssignmentComment] = useState("");
  const [isAssigning, setIsAssigning] = useState(false);

  const availableAssignees: Assignee[] = [
    {
      id: '1',
      name: 'Zach Brown',
      type: 'user',
      email: 'zach.brown@company.com',
      phone: '+1 (555) 123-4567',
      skills: ['Mechanical Repair', 'Electrical', 'Troubleshooting'],
      availability: 'available',
      currentWorkload: 2
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      type: 'user',
      email: 'sarah.johnson@company.com',
      phone: '+1 (555) 234-5678',
      skills: ['Hydraulics', 'Safety Inspection', 'Documentation'],
      availability: 'busy',
      currentWorkload: 5
    },
    {
      id: '3',
      name: 'Maintenance Team 1',
      type: 'team',
      email: 'team1@company.com',
      skills: ['General Maintenance', 'Equipment Repair'],
      availability: 'available',
      currentWorkload: 3
    },
    {
      id: '4',
      name: 'Safety Team',
      type: 'team',
      email: 'safety@company.com',
      skills: ['Safety Inspection', 'Compliance', 'Risk Assessment'],
      availability: 'available',
      currentWorkload: 1
    },
    {
      id: '5',
      name: 'Operations Team',
      type: 'team',
      email: 'operations@company.com',
      skills: ['Production Support', 'Process Optimization'],
      availability: 'busy',
      currentWorkload: 4
    }
  ];

  const currentAssignees = workOrder.assignedTo || [];

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'busy':
        return 'bg-yellow-100 text-yellow-800';
      case 'unavailable':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleAssignment = async () => {
    setIsAssigning(true);
    try {
      await onAssignmentChange?.(selectedAssignees, assignmentComment);
      setSelectedAssignees([]);
      setAssignmentComment("");
    } catch (error) {
      console.error("Error updating assignment:", error);
    } finally {
      setIsAssigning(false);
    }
  };

  const getWorkloadLevel = (workload: number) => {
    if (workload <= 2) return { level: 'Light', color: 'text-green-600' };
    if (workload <= 4) return { level: 'Moderate', color: 'text-yellow-600' };
    return { level: 'Heavy', color: 'text-red-600' };
  };

  return (
    <div className="space-y-6">
      {/* Current Assignment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Current Assignment
          </CardTitle>
        </CardHeader>
        <CardContent>
          {currentAssignees.length > 0 ? (
            <div className="space-y-3">
              {currentAssignees.map((assigneeName: string, index: number) => {
                const assignee = availableAssignees.find(a => a.name === assigneeName);
                const workloadInfo = assignee ? getWorkloadLevel(assignee.currentWorkload || 0) : null;
                
                return (
                  <div key={index} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-blue-100 text-blue-700">
                        {getInitials(assigneeName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{assigneeName}</span>
                        {assignee?.type === 'team' && (
                          <Badge variant="outline" className="text-xs">Team</Badge>
                        )}
                        {assignee && (
                          <Badge className={getAvailabilityColor(assignee.availability!)}>
                            {assignee.availability}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                        {assignee?.email && (
                          <div className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            <span>{assignee.email}</span>
                          </div>
                        )}
                        {assignee?.phone && (
                          <div className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            <span>{assignee.phone}</span>
                          </div>
                        )}
                        {workloadInfo && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span className={workloadInfo.color}>
                              {assignee.currentWorkload} WOs ({workloadInfo.level})
                            </span>
                          </div>
                        )}
                      </div>
                      {assignee?.skills && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {assignee.skills.map((skill, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>No one assigned to this work order</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Assignment Management */}
      <Card>
        <CardHeader>
          <CardTitle>Modify Assignment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Add Assignees
            </label>
            <Select value="" onValueChange={(value) => {
              if (value && !selectedAssignees.includes(value)) {
                setSelectedAssignees([...selectedAssignees, value]);
              }
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Select person or team..." />
              </SelectTrigger>
              <SelectContent>
                {availableAssignees
                  .filter(assignee => !currentAssignees.includes(assignee.name) && !selectedAssignees.includes(assignee.id))
                  .map((assignee) => {
                    const workloadInfo = getWorkloadLevel(assignee.currentWorkload || 0);
                    return (
                      <SelectItem key={assignee.id} value={assignee.id}>
                        <div className="flex items-center gap-2 w-full">
                          <div className="flex items-center gap-2">
                            {assignee.type === 'user' ? <User className="w-4 h-4" /> : <Users className="w-4 h-4" />}
                            <span>{assignee.name}</span>
                          </div>
                          <div className="flex items-center gap-1 ml-auto">
                            <Badge className={getAvailabilityColor(assignee.availability!)}>
                              {assignee.availability}
                            </Badge>
                            <span className={`text-xs ${workloadInfo.color}`}>
                              {assignee.currentWorkload} WOs
                            </span>
                          </div>
                        </div>
                      </SelectItem>
                    );
                  })}
              </SelectContent>
            </Select>
          </div>

          {/* Selected Assignees */}
          {selectedAssignees.length > 0 && (
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Will be assigned:
              </label>
              <div className="space-y-2">
                {selectedAssignees.map((assigneeId) => {
                  const assignee = availableAssignees.find(a => a.id === assigneeId);
                  if (!assignee) return null;
                  
                  return (
                    <div key={assigneeId} className="flex items-center justify-between p-2 bg-blue-50 border border-blue-200 rounded">
                      <div className="flex items-center gap-2">
                        {assignee.type === 'user' ? <User className="w-4 h-4" /> : <Users className="w-4 h-4" />}
                        <span className="font-medium">{assignee.name}</span>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setSelectedAssignees(selectedAssignees.filter(id => id !== assigneeId))}
                      >
                        Remove
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Assignment Notes
            </label>
            <Textarea
              placeholder="Add notes about this assignment..."
              value={assignmentComment}
              onChange={(e) => setAssignmentComment(e.target.value)}
              rows={3}
            />
          </div>

          <Button 
            onClick={handleAssignment}
            disabled={isAssigning || selectedAssignees.length === 0}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {isAssigning ? "Updating Assignment..." : "Update Assignment"}
          </Button>
        </CardContent>
      </Card>

      {/* Team Workload Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Team Workload Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableAssignees.map((assignee) => {
              const workloadInfo = getWorkloadLevel(assignee.currentWorkload || 0);
              return (
                <div key={assignee.id} className="p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    {assignee.type === 'user' ? <User className="w-4 h-4" /> : <Users className="w-4 h-4" />}
                    <span className="font-medium">{assignee.name}</span>
                    <Badge className={getAvailabilityColor(assignee.availability!)}>
                      {assignee.availability}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className={workloadInfo.color}>
                      {assignee.currentWorkload} active work orders ({workloadInfo.level} load)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
