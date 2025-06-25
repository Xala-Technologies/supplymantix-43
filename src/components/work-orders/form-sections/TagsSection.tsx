
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";

interface TagsSectionProps {
  currentTags: string[];
  setValue: (tags: string[]) => void;
}

export const TagsSection = ({ currentTags, setValue }: TagsSectionProps) => {
  const [newTag, setNewTag] = useState("");

  const addTag = () => {
    if (newTag.trim() && !currentTags.includes(newTag.trim())) {
      setValue([...currentTags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setValue(currentTags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">Tags</Label>
      
      {/* Display existing tags */}
      {currentTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {currentTags.map((tag, index) => (
            <Badge 
              key={index} 
              variant="secondary" 
              className="flex items-center gap-1 bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
            >
              {tag}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-transparent text-blue-500 hover:text-blue-700"
                onClick={() => removeTag(tag)}
              >
                <X className="w-3 h-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}
      
      {/* Add new tag input */}
      <div className="flex gap-2">
        <Input
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          placeholder="Add a tag..."
          className="flex-1"
          onKeyPress={handleKeyPress}
        />
        <Button 
          type="button" 
          variant="outline" 
          onClick={addTag}
          className="border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      
      <p className="text-xs text-slate-500">
        Press Enter or click the + button to add tags
      </p>
    </div>
  );
};
