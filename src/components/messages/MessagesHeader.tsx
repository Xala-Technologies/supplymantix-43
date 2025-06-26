
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MessageSquare, Users, Plus, Filter } from "lucide-react";

interface MessagesHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onNewConversation: () => void;
}

export const MessagesHeader = ({
  searchQuery,
  onSearchChange,
  onNewConversation,
}: MessagesHeaderProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
            <MessageSquare className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Team Messages</h1>
            <p className="text-gray-500 text-sm">Collaborate and communicate with your maintenance team</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2 border-gray-200 hover:bg-gray-50">
            <Users className="h-4 w-4" />
            Team Directory
          </Button>
          <Button variant="outline" className="gap-2 border-gray-200 hover:bg-gray-50">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button 
            onClick={onNewConversation}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 gap-2 shadow-sm"
          >
            <Plus className="h-4 w-4" />
            New Chat
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search conversations, people, or work orders..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 border-gray-200 focus:border-green-300 focus:ring-green-100"
          />
        </div>
      </div>
    </div>
  );
};
