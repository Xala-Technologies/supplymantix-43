
import React from 'react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Globe } from "lucide-react";

interface ProcedureFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  showGlobalOnly: boolean;
  setShowGlobalOnly: (show: boolean) => void;
  categories: string[];
}

export const ProcedureFilters: React.FC<ProcedureFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  showGlobalOnly,
  setShowGlobalOnly,
  categories
}) => {
  return (
    <div className="p-6">
      <div className="flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search procedures..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(category => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant={showGlobalOnly ? "default" : "outline"}
          onClick={() => setShowGlobalOnly(!showGlobalOnly)}
          size="sm"
        >
          <Globe className="h-4 w-4 mr-2" />
          Global Only
        </Button>
      </div>
    </div>
  );
};
