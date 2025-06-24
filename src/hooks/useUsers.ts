
import { useQuery } from "@tanstack/react-query";
import { usersApi } from "@/lib/database/users";

export const useUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: usersApi.getUsersByTenant,
  });
};
