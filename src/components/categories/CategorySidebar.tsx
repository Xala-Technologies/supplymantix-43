
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useCategories } from '@/hooks/useCategories';
import { Category } from '@/lib/database/categories';

interface CategorySidebarProps {
  selectedCategories: string[];
  onCategoryToggle: (categoryId: string) => void;
}

export const CategorySidebar: React.FC<CategorySidebarProps> = ({
  selectedCategories,
  onCategoryToggle,
}) => {
  const { data: categories, isLoading, error } = useCategories();

  if (isLoading) {
    return (
      <Card className="w-64">
        <CardHeader>
          <CardTitle>Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 rounded flex-1 animate-pulse" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-64">
        <CardHeader>
          <CardTitle>Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500 text-sm">Failed to load categories</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-64">
      <CardHeader>
        <CardTitle>Filter by Categories</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {categories?.map((category: Category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox
                id={category.id}
                checked={selectedCategories.includes(category.id)}
                onCheckedChange={() => onCategoryToggle(category.id)}
              />
              <label
                htmlFor={category.id}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                {category.name}
              </label>
            </div>
          ))}
          {(!categories || categories.length === 0) && (
            <p className="text-gray-500 text-sm">No categories available</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
