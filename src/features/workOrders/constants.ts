
export const WORK_ORDER_QUERY_KEYS = {
  all: ['work-orders'] as const,
  comments: (workOrderId: string) => ['work-order-comments', workOrderId] as const,
};
