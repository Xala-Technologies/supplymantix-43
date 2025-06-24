
import { supabase } from "@/integrations/supabase/client";

export interface CostEntry {
  id: string;
  work_order_id: string;
  amount: number;
  description: string;
  created_at: string;
  created_by: string;
}

export const costEntriesApi = {
  async getCostEntries(workOrderId: string): Promise<CostEntry[]> {
    const { data, error } = await supabase
      .from("work_order_cost_entries" as any)
      .select("*")
      .eq("work_order_id", workOrderId)
      .order("created_at", { ascending: false });
    
    if (error) throw error;
    return (data || []) as unknown as CostEntry[];
  },

  async createCostEntry(costEntry: Omit<CostEntry, "id" | "created_at" | "created_by">): Promise<CostEntry> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("work_order_cost_entries" as any)
      .insert({
        ...costEntry,
        created_by: user.id
      })
      .select()
      .single();
    
    if (error) throw error;
    return data as unknown as CostEntry;
  }
};
