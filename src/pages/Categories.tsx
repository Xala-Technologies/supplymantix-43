
import React, { useState } from "react";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { StandardPageLayout, StandardPageHeader, StandardPageContent } from "@/components/Layout/StandardPageLayout";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Tags, Trash2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from "@/hooks/useCategories";
import { CategoryForm } from "@/components/categories/CategoryForm";
import { CategoryCard } from "@/components/categories/CategoryCard";
import { Category, CreateCategoryData } from "@/lib/database/categories";

const Categories = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);

  const { data: categories, isLoading } = useCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const handleCreateCategory = (data: CreateCategoryData) => {
    createCategory.mutate(data, {
      onSuccess: () => {
        setShowCreateForm(false);
      }
    });
  };

  const handleUpdateCategory = (data: CreateCategoryData) => {
    if (editingCategory) {
      updateCategory.mutate({
        id: editingCategory.id,
        updates: data
      }, {
        onSuccess: () => {
          setEditingCategory(null);
        }
      });
    }
  };

  const handleDeleteCategory = (id: string) => {
    deleteCategory.mutate(id, {
      onSuccess: () => {
        setDeleteConfirm(null);
      }
    });
  };

  const handleBulkDelete = () => {
    selectedCategories.forEach(id => {
      deleteCategory.mutate(id);
    });
    setSelectedCategories([]);
    setShowBulkDeleteConfirm(false);
  };

  const handleSelectCategory = (categoryId: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories(prev => [...prev, categoryId]);
    } else {
      setSelectedCategories(prev => prev.filter(id => id !== categoryId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked && categories) {
      setSelectedCategories(categories.map(cat => cat.id));
    } else {
      setSelectedCategories([]);
    }
  };

  const isAllSelected = categories && selectedCategories.length === categories.length;
  const hasSelection = selectedCategories.length > 0;

  if (isLoading) {
    return (
      <DashboardLayout>
        <StandardPageLayout>
          <StandardPageContent>
            <div className="flex items-center justify-center h-[60vh]">
              <div className="text-center space-y-3">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-muted-foreground text-sm">Loading categories...</p>
              </div>
            </div>
          </StandardPageContent>
        </StandardPageLayout>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <StandardPageLayout>
        <StandardPageHeader 
          title="Categories"
          description={`${categories?.length || 0} ${categories?.length === 1 ? 'category' : 'categories'} available`}
        >
          <div className="flex items-center gap-3">
            {hasSelection && (
              <Button 
                variant="destructive" 
                onClick={() => setShowBulkDeleteConfirm(true)}
                disabled={deleteCategory.isPending}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Selected ({selectedCategories.length})
              </Button>
            )}
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Category
            </Button>
          </div>
        </StandardPageHeader>

        <StandardPageContent>
          {!categories || categories.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-gray-400 mb-6">
                <Tags className="h-20 w-20 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">No categories found</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Get started by creating your first category to organize your items.
              </p>
              <Button onClick={() => setShowCreateForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Category
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Bulk selection controls */}
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Checkbox
                  checked={isAllSelected}
                  onCheckedChange={handleSelectAll}
                />
                <span className="text-sm font-medium">
                  Select All ({categories.length})
                </span>
                {hasSelection && (
                  <span className="text-sm text-muted-foreground ml-auto">
                    {selectedCategories.length} selected
                  </span>
                )}
              </div>

              {/* Categories grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category) => (
                  <div key={category.id} className="relative">
                    <div className="absolute top-3 left-3 z-10">
                      <Checkbox
                        checked={selectedCategories.includes(category.id)}
                        onCheckedChange={(checked) => handleSelectCategory(category.id, !!checked)}
                        className="bg-white border-2"
                      />
                    </div>
                    <CategoryCard
                      category={category}
                      onEdit={setEditingCategory}
                      onDelete={setDeleteConfirm}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </StandardPageContent>
      </StandardPageLayout>

      {/* Create Category Form */}
      <CategoryForm
        open={showCreateForm}
        onOpenChange={setShowCreateForm}
        onSubmit={handleCreateCategory}
        isLoading={createCategory.isPending}
      />

      {/* Edit Category Form */}
      <CategoryForm
        open={!!editingCategory}
        onOpenChange={(open) => !open && setEditingCategory(null)}
        onSubmit={handleUpdateCategory}
        isLoading={updateCategory.isPending}
        category={editingCategory || undefined}
      />

      {/* Single Delete Confirmation */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this category? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteConfirm && handleDeleteCategory(deleteConfirm)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Delete Confirmation */}
      <AlertDialog open={showBulkDeleteConfirm} onOpenChange={setShowBulkDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Selected Categories</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedCategories.length} selected categories? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteCategory.isPending}
            >
              Delete {selectedCategories.length} Categories
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default Categories;
