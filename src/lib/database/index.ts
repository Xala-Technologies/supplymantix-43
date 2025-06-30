
import { workOrdersApi } from './work-orders';
import { purchaseOrdersApi } from './purchase-orders';

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
};
