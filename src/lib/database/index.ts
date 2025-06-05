
import { inventoryApi } from "./inventory";
import { workOrdersApi } from "./work-orders";
import { assetsApi } from "./assets";
import { proceduresApi } from "./procedures";
import { procurementApi } from "./procurement";
import { purchaseOrdersApi } from "./purchase-orders";
import { requestsApi } from "./requests";
import { usersApi } from "./users";
import { organizationsApi } from "./organizations";
import { locationsApi } from "./locations";
import { billingApi } from "./billing";
import { integrationsApi } from "./integrations";

export const databaseApi = {
  ...workOrdersApi,
  ...assetsApi,
  ...inventoryApi,
  ...proceduresApi,
  ...procurementApi,
  ...purchaseOrdersApi,
  ...requestsApi,
  ...usersApi,
  ...organizationsApi,
  ...locationsApi,
  ...billingApi,
  ...integrationsApi,
};
