import { workOrdersApi } from "./work-orders";
import { purchaseOrdersApi } from "./purchase-orders";

// Mock implementations for missing API methods
const mockApi = {
  // Assets
  async getAssets() {
    console.log('getAssets - Mock implementation');
    return [];
  },

  // Inventory
  async getInventoryItems() {
    console.log('getInventoryItems - Mock implementation');
    return [];
  },

  // Meters
  async getMeters() {
    console.log('getMeters - Mock implementation');
    return [];
  },

  // Purchase Orders - delegate to real implementation
  async getPurchaseOrders() {
    return purchaseOrdersApi.getPurchaseOrders();
  },

  async getPurchaseOrderById(id: string) {
    return purchaseOrdersApi.getPurchaseOrderById(id);
  },

  async createPurchaseOrder(data: any) {
    return purchaseOrdersApi.createPurchaseOrder(data);
  },

  async updatePurchaseOrder(data: any) {
    return purchaseOrdersApi.updatePurchaseOrder(data);
  },

  async deletePurchaseOrder(id: string) {
    return purchaseOrdersApi.deletePurchaseOrder(id);
  },

  async getPurchaseOrderLineItems(purchaseOrderId: string) {
    return purchaseOrdersApi.getPurchaseOrderLineItems(purchaseOrderId);
  },

  // Organizations
  async getOrganizations() {
    console.log('getOrganizations - Mock implementation');
    return [];
  },

  async createOrganization(data: any) {
    console.log('createOrganization - Mock implementation', data);
    return data;
  },

  async updateOrganization(id: string, updates: any) {
    console.log('updateOrganization - Mock implementation', id, updates);
    return { id, ...updates };
  },

  async getOrganizationMembers(organizationId: string) {
    console.log('getOrganizationMembers - Mock implementation', organizationId);
    return [];
  },

  async inviteOrganizationMember(data: any) {
    console.log('inviteOrganizationMember - Mock implementation', data);
    return data;
  },

  async updateOrganizationMember(id: string, updates: any) {
    console.log('updateOrganizationMember - Mock implementation', id, updates);
    return { id, ...updates };
  },

  async removeOrganizationMember(id: string) {
    console.log('removeOrganizationMember - Mock implementation', id);
    return { id };
  },

  // Invitations
  async getInvitationByToken(token: string) {
    console.log('getInvitationByToken - Mock implementation', token);
    return null;
  },

  async acceptInvitation(token: string, userId: string) {
    console.log('acceptInvitation - Mock implementation', token, userId);
    return { success: true };
  },

  // Procedures
  async getProcedures() {
    console.log('getProcedures - Mock implementation');
    return [];
  },

  async getProcedure(id: string) {
    console.log('getProcedure - Mock implementation', id);
    return null;
  },

  async createProcedure(data: any) {
    console.log('createProcedure - Mock implementation', data);
    return data;
  },

  async updateProcedure(id: string, updates: any) {
    console.log('updateProcedure - Mock implementation', id, updates);
    return { id, ...updates };
  },

  async deleteProcedure(id: string) {
    console.log('deleteProcedure - Mock implementation', id);
    return { id };
  },

  // Billing
  async getOrganizationSubscription(organizationId: string) {
    console.log('getOrganizationSubscription - Mock implementation', organizationId);
    return null;
  },

  async getSubscriptionTemplates() {
    console.log('getSubscriptionTemplates - Mock implementation');
    return [];
  },

  async createOrganizationSubscription(data: any) {
    console.log('createOrganizationSubscription - Mock implementation', data);
    return { ...data, id: 'mock-subscription-id' };
  },

  async updateOrganizationSubscription(id: string, updates: any) {
    console.log('updateOrganizationSubscription - Mock implementation', id, updates);
    return { id, organization_id: updates.organization_id || 'mock-org-id', ...updates };
  },

  async cancelOrganizationSubscription(id: string) {
    console.log('cancelOrganizationSubscription - Mock implementation', id);
    return { id, organization_id: 'mock-org-id' };
  },

  async getBillingInformation(organizationId: string) {
    console.log('getBillingInformation - Mock implementation', organizationId);
    return null;
  },

  async createBillingInformation(data: any) {
    console.log('createBillingInformation - Mock implementation', data);
    return { ...data, id: 'mock-billing-id' };
  },

  async getInvoices(organizationId: string) {
    console.log('getInvoices - Mock implementation', organizationId);
    return [];
  },
};

export const databaseApi = {
  // Work Orders
  getWorkOrders: workOrdersApi.getWorkOrders,
  createWorkOrder: workOrdersApi.createWorkOrder,
  updateWorkOrder: workOrdersApi.updateWorkOrder,
  getChatMessages: workOrdersApi.getChatMessages,
  createChatMessage: workOrdersApi.createChatMessage,
  
  // Assets
  getAssets: mockApi.getAssets,
  
  // Inventory
  getInventoryItems: mockApi.getInventoryItems,
  
  // Meters
  getMeters: mockApi.getMeters,
  
  // Purchase Orders
  getPurchaseOrders: mockApi.getPurchaseOrders,
  getPurchaseOrderById: mockApi.getPurchaseOrderById,
  createPurchaseOrder: mockApi.createPurchaseOrder,
  updatePurchaseOrder: mockApi.updatePurchaseOrder,
  deletePurchaseOrder: mockApi.deletePurchaseOrder,
  getPurchaseOrderLineItems: mockApi.getPurchaseOrderLineItems,
  
  // Organizations
  getOrganizations: mockApi.getOrganizations,
  createOrganization: mockApi.createOrganization,
  updateOrganization: mockApi.updateOrganization,
  getOrganizationMembers: mockApi.getOrganizationMembers,
  inviteOrganizationMember: mockApi.inviteOrganizationMember,
  updateOrganizationMember: mockApi.updateOrganizationMember,
  removeOrganizationMember: mockApi.removeOrganizationMember,
  
  // Invitations
  getInvitationByToken: mockApi.getInvitationByToken,
  acceptInvitation: mockApi.acceptInvitation,
  
  // Procedures
  getProcedures: mockApi.getProcedures,
  getProcedure: mockApi.getProcedure,
  createProcedure: mockApi.createProcedure,
  updateProcedure: mockApi.updateProcedure,
  deleteProcedure: mockApi.deleteProcedure,
  
  // Billing
  getOrganizationSubscription: mockApi.getOrganizationSubscription,
  getSubscriptionTemplates: mockApi.getSubscriptionTemplates,
  createOrganizationSubscription: mockApi.createOrganizationSubscription,
  updateOrganizationSubscription: mockApi.updateOrganizationSubscription,
  cancelOrganizationSubscription: mockApi.cancelOrganizationSubscription,
  getBillingInformation: mockApi.getBillingInformation,
  createBillingInformation: mockApi.createBillingInformation,
  getInvoices: mockApi.getInvoices,
};

export * from "./work-orders";
export * from "./purchase-orders";
