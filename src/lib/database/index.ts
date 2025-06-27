
import { workOrdersApi } from "./work-orders";

export const databaseApi = {
  getWorkOrders: workOrdersApi.getWorkOrders,
  createWorkOrder: workOrdersApi.createWorkOrder,
  updateWorkOrder: workOrdersApi.updateWorkOrder,
  getChatMessages: workOrdersApi.getChatMessages,
  createChatMessage: workOrdersApi.createChatMessage,
};
