
export interface Location {
  id: string;
  name: string;
  description: string | null;
  tenant_id: string;
  created_at: string;
  updated_at: string;
}

export interface LocationFormData {
  name: string;
  description?: string;
}
