
import React, { useState } from "react";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { StandardPageLayout, StandardPageHeader, StandardPageContent } from "@/components/Layout/StandardPageLayout";
import { Button } from "@/components/ui/button";
import { Plus, Tags } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from "@/hooks/useCategories";
import { usePredefinedCategories } from "@/hooks/usePredefinedCategories";
import { CategoryForm } from "@/components/categories/CategoryForm";
import { CategoryCard } from "@/components/categories/CategoryCard";
import { Category, CreateCategoryData } from "@/lib/database/categories";

const Categories = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const { data: categories, isLoading } = useCategories();
  const { isCreating } = usePredefinedCategories();
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

  if (isLoading || isCreating) {
    return (
      <DashboardLayout>
        <StandardPageLayout>
          <StandardPageContent>
            <div className="flex items-center justify-center h-[60vh]">
              <div className="text-center space-y-3">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-muted-foreground text-sm">
                  {isCreating ? 'Setting up categories...' : 'Loading categories...'}
                </p>
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
          <Button onClick={() => setShowCreateForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Category
          </Button>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  onEdit={setEditingCategory}
                  onDelete={setDeleteConfirm}
                />
              ))}
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

      {/* Delete Confirmation */}
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
    </DashboardLayout>
  );
};

export default Categories;
