
import { supabase } from "@/integrations/supabase/client";

export interface Category {
  id: string;
  name: string;
  description?: string;
  tenant_id: string;
  created_at: string;
  updated_at: string;
}

export const categoriesApi = {
  getCategories: async (): Promise<Category[]> => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error("User not authenticated");

    const { data: userRecord } = await supabase
      .from("users")
      .select("tenant_id")
      .eq("id", userData.user.id)
      .single();

    if (!userRecord) throw new Error("User record not found");

    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("tenant_id", userRecord.tenant_id)
      .order("name");

    if (error) throw error;
    return data || [];
  },

  createCategory: async (category: Omit<Category, 'id' | 'tenant_id' | 'created_at' | 'updated_at'>): Promise<Category> => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error("User not authenticated");

    const { data: userRecord } = await supabase
      .from("users")
      .select("tenant_id")
      .eq("id", userData.user.id)
      .single();

    if (!userRecord) throw new Error("User record not found");

    const { data, error } = await supabase
      .from("categories")
      .insert({ ...category, tenant_id: userRecord.tenant_id })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  updateCategory: async (id: string, updates: Partial<Omit<Category, 'id' | 'tenant_id' | 'created_at'>>): Promise<Category> => {
    const { data, error } = await supabase
      .from("categories")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  deleteCategory: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", id);

    if (error) throw error;
  }
};
