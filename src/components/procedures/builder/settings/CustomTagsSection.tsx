
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';

interface CustomTagsSectionProps {
  tags: string[];
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
}

export const CustomTagsSection: React.FC<CustomTagsSectionProps> = ({
  tags,
  onAddTag,
  onRemoveTag
}) => {
  const [customTag, setCustomTag] = useState('');

  const handleAddCustomTag = () => {
    if (customTag.trim() && !tags.includes(customTag.trim())) {
      onAddTag(customTag.trim());
      setCustomTag('');
    }
  };

  return (
    <div>
      <label className="text-sm font-medium text-gray-700 mb-2 block">Custom Tags</label>
      <div className="space-y-3">
        {/* Display existing tags */}
        <div className="flex flex-wrap gap-2 min-h-[48px] p-4 border border-gray-200 rounded-lg bg-white">
          {tags.length === 0 ? (
            <span className="text-gray-500 text-sm flex items-center">No custom tags</span>
          ) : (
            tags.map(tag => (
              <Badge 
                key={tag} 
                variant="secondary" 
                className="cursor-pointer hover:bg-red-100 hover:text-red-700 transition-colors px-3 py-1" 
                onClick={() => onRemoveTag(tag)}
              >
                {tag} ×
              </Badge>
            ))
          )}
        </div>
        
        {/* Add new tag */}
        <div className="flex gap-3">
          <Input
            value={customTag}
            onChange={(e) => setCustomTag(e.target.value)}
            placeholder="Add custom tag"
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCustomTag())}
            className="flex-1 h-11"
          />
          <Button 
            type="button" 
            onClick={handleAddCustomTag} 
            variant="outline"
            disabled={!customTag.trim()}
            className="h-11 px-6"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
      </div>
    </div>
  );
};
