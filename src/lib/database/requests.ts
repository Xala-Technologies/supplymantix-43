
import { supabase } from "@/integrations/supabase/client";
import type { CreateRequestRequest, UpdateRequestRequest } from "@/types/request";

export const requestsApi = {
  async getRequests() {
    console.log("Fetching requests...");
    const { data, error } = await supabase
      .from("requests")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) {
      console.error("Error fetching requests:", error);
      throw error;
    }
    console.log("Requests fetched:", data);
    return data;
  },

  async getRequestById(id: string) {
    console.log("Fetching request by ID:", id);
    const { data, error } = await supabase
      .from("requests")
      .select("*")
      .eq("id", id)
      .single();
    
    if (error) {
      console.error("Error fetching request:", error);
      throw error;
    }
    return data;
  },

  async createRequest(request: CreateRequestRequest) {
    console.log("Creating request:", request);
    
    // Get current user's tenant_id
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error("User not authenticated");

    const { data: userRecord } = await supabase
      .from("users")
      .select("tenant_id")
      .eq("id", userData.user.id)
      .single();
    
    if (!userRecord) throw new Error("User record not found");

    // Create the request
    const { data, error } = await supabase
      .from("requests")
      .insert({
        ...request,
        tenant_id: userRecord.tenant_id,
        requested_by: userData.user.id,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating request:", error);
      throw error;
    }

    console.log("Request created successfully:", data);
    return data;
  },

  async updateRequest(request: UpdateRequestRequest) {
    const { id, ...updates } = request;

    const { data, error } = await supabase
      .from("requests")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating request:", error);
      throw error;
    }

    return data;
  },

  async deleteRequest(id: string) {
    const { error } = await supabase
      .from("requests")
      .delete()
      .eq("id", id);
    
    if (error) {
      console.error("Error deleting request:", error);
      throw error;
    }
  },

  async getRequestComments(requestId: string) {
    const { data, error } = await supabase
      .from("request_comments")
      .select("*")
      .eq("request_id", requestId)
      .order("created_at", { ascending: true });
    
    if (error) throw error;
    return data;
  },

  async addRequestComment(requestId: string, comment: string) {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("request_comments")
      .insert({
        request_id: requestId,
        user_id: userData.user.id,
        comment,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
