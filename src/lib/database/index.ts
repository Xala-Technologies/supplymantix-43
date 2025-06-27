
import { workOrdersApi } from "./work-orders";
import { organizationsApi } from "./organizations";
import { billingApi } from "./billing";
import { assetsApi } from "./assets";
import { inventoryApi } from "./inventory";
import { purchaseOrdersApi } from "./purchase-orders";
import { locationsApi } from "./locations";
import { usersApi } from "./users";
import { metersApi } from "./meters";
import { proceduresApi } from "./procedures";
import { requestsApi } from "./requests";

export const databaseApi = {
  // Work Orders
  getWorkOrders: workOrdersApi.getWorkOrders,
  createWorkOrder: workOrdersApi.createWorkOrder,
  updateWorkOrder: workOrdersApi.updateWorkOrder,
  getChatMessages: workOrdersApi.getChatMessages,
  createChatMessage: workOrdersApi.createChatMessage,

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

  // Billing
  getOrganizationSubscription: billingApi.getOrganizationSubscription,
  getSubscriptionTemplates: billingApi.getSubscriptionTemplates,
  createOrganizationSubscription: billingApi.createOrganizationSubscription,
  updateOrganizationSubscription: billingApi.updateOrganizationSubscription,
  cancelOrganizationSubscription: billingApi.cancelOrganizationSubscription,
  getBillingInformation: billingApi.getBillingInformation,
  createBillingInformation: billingApi.createBillingInformation,
  getInvoices: billingApi.getInvoices,

  // Assets
  getAssets: assetsApi.getAssets,
  createAsset: assetsApi.createAsset,
  updateAsset: assetsApi.updateAsset,
  deleteAsset: assetsApi.deleteAsset,

  // Inventory
  getInventoryItems: inventoryApi.getInventoryItems,
  createInventoryItem: inventoryApi.createInventoryItem,
  updateInventoryItem: inventoryApi.updateInventoryItem,
  deleteInventoryItem: inventoryApi.deleteInventoryItem,

  // Purchase Orders
  getPurchaseOrders: purchaseOrdersApi.getPurchaseOrders,
  createPurchaseOrder: purchaseOrdersApi.createPurchaseOrder,
  updatePurchaseOrder: purchaseOrdersApi.updatePurchaseOrder,
  deletePurchaseOrder: purchaseOrdersApi.deletePurchaseOrder,
  getPurchaseOrderById: purchaseOrdersApi.getPurchaseOrderById,
  getPurchaseOrderLineItems: purchaseOrdersApi.getPurchaseOrderLineItems,

  // Locations
  getLocations: locationsApi.getLocations,
  createLocation: locationsApi.createLocation,
  updateLocation: locationsApi.updateLocation,
  deleteLocation: locationsApi.deleteLocation,

  // Users
  getUsers: usersApi.getUsers,
  getUsersByTenant: usersApi.getUsersByTenant,
  createUser: usersApi.createUser,
  updateUser: usersApi.updateUser,

  // Meters
  getMeters: metersApi.getMeters,
  createMeter: metersApi.createMeter,
  updateMeter: metersApi.updateMeter,
  deleteMeter: metersApi.deleteMeter,

  // Procedures
  getProcedures: proceduresApi.getProcedures,
  createProcedure: proceduresApi.createProcedure,
  updateProcedure: proceduresApi.updateProcedure,
  deleteProcedure: proceduresApi.deleteProcedure,
  getProcedure: proceduresApi.getProcedures, // Alias for compatibility

  // Requests
  getRequests: requestsApi.getRequests,
  createRequest: requestsApi.createRequest,
  updateRequest: requestsApi.updateRequest,
  deleteRequest: requestsApi.deleteRequest,
};
