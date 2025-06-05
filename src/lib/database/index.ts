import { inventoryApi } from "./inventory";

export const databaseApi = {
  getInventoryItems: inventoryApi.getInventoryItems,
  createInventoryItem: inventoryApi.createInventoryItem,

  // Purchase Orders
  getPurchaseOrders: () => import("./purchase-orders").then(m => m.purchaseOrdersApi.getPurchaseOrders()),
  getPurchaseOrderById: (id: string) => import("./purchase-orders").then(m => m.purchaseOrdersApi.getPurchaseOrderById(id)),
  getPurchaseOrderLineItems: (purchaseOrderId: string) => import("./purchase-orders").then(m => m.purchaseOrdersApi.getPurchaseOrderLineItems(purchaseOrderId)),
  createPurchaseOrder: (data: any) => import("./purchase-orders").then(m => m.purchaseOrdersApi.createPurchaseOrder(data)),
  updatePurchaseOrder: (data: any) => import("./purchase-orders").then(m => m.purchaseOrdersApi.updatePurchaseOrder(data)),
  deletePurchaseOrder: (id: string) => import("./purchase-orders").then(m => m.purchaseOrdersApi.deletePurchaseOrder(id)),
};
