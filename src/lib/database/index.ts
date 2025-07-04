
import { workOrdersApi } from './work-orders';
import { purchaseOrdersApi } from './purchase-orders';
import { organizationsApi } from './organizations';
import { proceduresApi } from './procedures';
import { categoriesApi } from './categories';

export const databaseApi = {
  // Work Orders
  getWorkOrders: workOrdersApi.getWorkOrders,
  createWorkOrder: workOrdersApi.createWorkOrder,
  updateWorkOrder: workOrdersApi.updateWorkOrder,
  getChatMessages: workOrdersApi.getChatMessages,
  createChatMessage: workOrdersApi.createChatMessage,
  
  // Purchase Orders
  getPurchaseOrders: purchaseOrdersApi.getPurchaseOrders,
  getPurchaseOrderById: purchaseOrdersApi.getPurchaseOrderById,
  createPurchaseOrder: purchaseOrdersApi.createPurchaseOrder,
  updatePurchaseOrder: purchaseOrdersApi.updatePurchaseOrder,
  deletePurchaseOrder: purchaseOrdersApi.deletePurchaseOrder,
  getPurchaseOrderLineItems: purchaseOrdersApi.getPurchaseOrderLineItems,

  // Organizations
  getOrganizations: organizationsApi.getOrganizations,
  createOrganization: organizationsApi.createOrganization,
  updateOrganization: organizationsApi.updateOrganization,
  getOrganizationMembers: organizationsApi.getOrganizationMembers,
  inviteOrganizationMember: organizationsApi.inviteOrganizationMember,
  updateOrganizationMember: organizationsApi.updateOrganizationMember,
  removeOrganizationMember: organizationsApi.removeOrganizationMember,
  getInvitationByToken: organizationsApi.getInvitationByToken,
  acceptInvitation: organizationsApi.acceptInvitation,

  // Procedures
  getProcedures: proceduresApi.getProcedures,
  createProcedure: proceduresApi.createProcedure,
  updateProcedure: proceduresApi.updateProcedure,
  deleteProcedure: proceduresApi.deleteProcedure,

  // Categories
  getCategories: categoriesApi.getCategories,
  createCategory: categoriesApi.createCategory,
  updateCategory: categoriesApi.updateCategory,
  deleteCategory: categoriesApi.deleteCategory,

  // Stub implementations for missing methods
  getInventoryItems: async () => {
    console.log('getInventoryItems not yet implemented');
    return [];
  },
  
  getMeters: async () => {
    const { supabase } = await import('@/integrations/supabase/client');
    
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error('Not authenticated');
    
    const { data: userTenant } = await supabase
      .from('users')
      .select('tenant_id')
      .eq('id', userData.user.id)
      .single();
    
    if (!userTenant?.tenant_id) throw new Error('No tenant found');
    
    const { data, error } = await supabase
      .from('meters')
      .select(`
        *,
        assets(id, name, location)
      `)
      .eq('tenant_id', userTenant.tenant_id)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  // Meter readings
  createMeterReading: async (reading: any) => {
    const { supabase } = await import('@/integrations/supabase/client');
    
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error('Not authenticated');
    
    const { data, error } = await supabase
      .from('meter_readings')
      .insert({
        ...reading,
        recorded_by: userData.user.id,
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Billing stubs
  getOrganizationSubscription: async (organizationId: string) => {
    console.log('getOrganizationSubscription not yet implemented');
    return null;
  },

  getSubscriptionTemplates: async () => {
    console.log('getSubscriptionTemplates not yet implemented');
    return [];
  },

  createOrganizationSubscription: async (data: any) => {
    console.log('createOrganizationSubscription not yet implemented');
    return { organization_id: data.organization_id };
  },

  updateOrganizationSubscription: async (id: string, updates: any) => {
    console.log('updateOrganizationSubscription not yet implemented');
    return { organization_id: 'stub' };
  },

  cancelOrganizationSubscription: async (id: string) => {
    console.log('cancelOrganizationSubscription not yet implemented');
    return { organization_id: 'stub' };
  },

  getBillingInformation: async (organizationId: string) => {
    console.log('getBillingInformation not yet implemented');
    return null;
  },

  createBillingInformation: async (data: any) => {
    console.log('createBillingInformation not yet implemented');
    return { organization_id: data.organization_id };
  },

  getInvoices: async (organizationId: string) => {
    console.log('getInvoices not yet implemented');
    return [];
  },
};
