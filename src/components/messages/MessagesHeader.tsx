
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MessageSquare, Users, Plus } from "lucide-react";

interface MessagesHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export const MessagesHeader = ({
  searchQuery,
  onSearchChange,
}: MessagesHeaderProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <MessageSquare className="h-5 w-5 text-white" />
            </div>
            Team Communication
          </h1>
          <p className="text-muted-foreground">
            Collaborate with your team on maintenance tasks
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Users className="h-4 w-4" />
            Team Members
          </Button>
          <Button className="bg-green-600 hover:bg-green-700 gap-2">
            <Plus className="h-4 w-4" />
            New Chat
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
    </div>
  );
};
