
import React from "react";
import { RequestsListContainer } from "./RequestsListContainer";
import type { Request } from "@/types/request";

interface RequestsListProps {
  requests: Request[];
  onEditRequest: (request: Request) => void;
  onDeleteRequest: (id: string) => void;
  onViewRequest: (request: Request) => void;
  viewMode?: 'grid' | 'table';
  userRole?: 'admin' | 'user';
}

export const RequestsList = (props: RequestsListProps) => {
  return <RequestsListContainer {...props} />;
};

export default RequestsList;
