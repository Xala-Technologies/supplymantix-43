import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Users, MessageSquare, Loader2 } from "lucide-react";
import { useCreateConversation } from "@/hooks/useMessages";
import type { Conversation } from "./ChatWindow";

interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
}

interface NewConversationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConversationCreated: (conversation: Conversation) => void;
  users: User[];
}

export const NewConversationDialog = ({
  isOpen,
  onClose,
  onConversationCreated,
  users
}: NewConversationDialogProps) => {
  const [title, setTitle] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const createConversationMutation = useCreateConversation();

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    `${user.first_name || ''} ${user.last_name || ''}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUserToggle = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleCreateConversation = async () => {
    if (!title.trim() || selectedUsers.length === 0) return;

    const conversationData = {
      title: title.trim(),
      participantIds: selectedUsers
    };

    try {
      const newConversation = await createConversationMutation.mutateAsync(conversationData);
      onConversationCreated(newConversation);
      
      // Reset form
      setTitle("");
      setSelectedUsers([]);
      setSearchQuery("");
    } catch (error) {
      console.error('Failed to create conversation:', error);
    }
  };

  const handleClose = () => {
    setTitle("");
    setSelectedUsers([]);
    setSearchQuery("");
    onClose();
  };

  const getUserDisplayName = (user: User) => {
    const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim();
    return fullName || user.email;
  };

  const getUserInitials = (user: User) => {
    if (user.first_name || user.last_name) {
      return `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`;
    }
    return user.email[0].toUpperCase();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <MessageSquare className="h-5 w-5 text-white" />
            </div>
            Start New Conversation
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Conversation Title</Label>
            <Input
              id="title"
              placeholder="e.g., HVAC Maintenance Discussion"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border-gray-200 focus:border-green-300 focus:ring-green-100"
            />
          </div>

          <div className="space-y-3">
            <Label>Select Team Members</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search team members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-gray-200 focus:border-green-300 focus:ring-green-100"
              />
            </div>
          </div>

          <div className="max-h-64 overflow-y-auto space-y-2 border border-gray-200 rounded-lg p-2">
            {filteredUsers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Users className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm">No team members found</p>
              </div>
            ) : (
              filteredUsers.map((user) => (
                <div key={user.id} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <Checkbox
                    id={user.id}
                    checked={selectedUsers.includes(user.id)}
                    onCheckedChange={() => handleUserToggle(user.id)}
                  />
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="text-xs bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                      {getUserInitials(user)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate text-gray-900">
                      {getUserDisplayName(user)}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          {selectedUsers.length > 0 && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-green-800">
                <Users className="h-4 w-4" />
                <span className="font-medium">
                  {selectedUsers.length} member{selectedUsers.length > 1 ? 's' : ''} selected
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
          <Button variant="outline" onClick={handleClose} disabled={createConversationMutation.isPending}>
            Cancel
          </Button>
          <Button 
            onClick={handleCreateConversation}
            disabled={!title.trim() || selectedUsers.length === 0 || createConversationMutation.isPending}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
          >
            {createConversationMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Conversation'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
