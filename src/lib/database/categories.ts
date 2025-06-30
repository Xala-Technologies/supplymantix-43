
import { supabase } from "@/integrations/supabase/client";

export interface Category {
  id: string;
  name: string;
  description?: string;
  tenant_id: string;
  created_at: string;
  updated_at: string;
}

export interface CreateCategoryData {
  name: string;
  description?: string;
}

export interface UpdateCategoryData {
  name?: string;
  description?: string;
}

export const categoriesApi = {
  async getCategories(): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (error) throw error;
    return data || [];
  },

  async createCategory(categoryData: CreateCategoryData): Promise<Category> {
    // Get the current user's tenant_id
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('tenant_id')
      .eq('id', (await supabase.auth.getUser()).data.user?.id)
      .single();

    if (userError) throw userError;
    if (!userData?.tenant_id) throw new Error('User tenant not found');

    const { data, error } = await supabase
      .from('categories')
      .insert({
        ...categoryData,
        tenant_id: userData.tenant_id
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateCategory(id: string, updates: UpdateCategoryData): Promise<Category> {
    const { data, error } = await supabase
      .from('categories')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteCategory(id: string): Promise<void> {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};
