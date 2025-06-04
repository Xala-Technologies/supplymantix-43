
import { workOrdersApi } from "./work-orders";
import { assetsApi } from "./assets";
import { inventoryApi } from "./inventory";
import { proceduresApi } from "./procedures";
import { procurementApi } from "./procurement";
import { usersApi } from "./users";
import { organizationsApi } from "./organizations";
import { locationsApi } from "./locations";

export const databaseApi = {
  ...workOrdersApi,
  ...assetsApi,
  ...inventoryApi,
  ...proceduresApi,
  ...procurementApi,
  ...usersApi,
  ...organizationsApi,
  ...locationsApi,
};
