
import { useState, useEffect } from "react";
import { useOrganizations } from "./useOrganizations";

export const useOrganizationSettingsForm = (organizationId: string) => {
  const { data: organizations } = useOrganizations();
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    website: "",
    contact_email: "",
    contact_phone: "",
    contact_fax: "",
    default_language: "en",
  });

  useEffect(() => {
    if (organizations && Array.isArray(organizations)) {
      const organization = organizations.find((org: any) => org.id === organizationId);
      if (organization) {
        setFormData({
          name: organization.name || "",
          address: organization.address || "",
          website: organization.website || "",
          contact_email: organization.contact_email || "",
          contact_phone: organization.contact_phone || "",
          contact_fax: organization.contact_fax || "",
          default_language: organization.default_language || "en",
        });
      }
    }
  }, [organizations, organizationId]);

  return { formData, setFormData };
};
