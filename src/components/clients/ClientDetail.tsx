
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Phone, Mail, MapPin, Edit, Plus, Trash2, User } from "lucide-react";
import type { Client } from "@/hooks/useClients";
import type { ClientContact } from "@/hooks/useClientContacts";
import { useClientContacts, useCreateClientContact, useDeleteClientContact } from "@/hooks/useClientContacts";
import { ContactForm } from "./ContactForm";
import { toast } from "sonner";

interface ClientDetailProps {
  client: Client;
  onEdit: () => void;
  onBack: () => void;
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'active':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'inactive':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    case 'onboarding':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const ClientDetail = ({ client, onEdit, onBack }: ClientDetailProps) => {
  const [showContactForm, setShowContactForm] = useState(false);
  const { data: contacts = [], refetch: refetchContacts } = useClientContacts(client.id);
  const createContact = useCreateClientContact();
  const deleteContact = useDeleteClientContact();

  const handleCreateContact = async (contactData: any) => {
    try {
      await createContact.mutateAsync({
        ...contactData,
        client_id: client.id,
      });
      setShowContactForm(false);
      refetchContacts();
      toast.success("Contact created successfully");
    } catch (error) {
      console.error("Failed to create contact:", error);
      toast.error("Failed to create contact");
    }
  };

  const handleDeleteContact = async (contact: ClientContact) => {
    if (confirm(`Are you sure you want to delete ${contact.name}?`)) {
      try {
        await deleteContact.mutateAsync(contact.id);
        refetchContacts();
        toast.success("Contact deleted successfully");
      } catch (error) {
        console.error("Failed to delete contact:", error);
        toast.error("Failed to delete contact");
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <Building2 className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold">{client.name}</h1>
                <Badge 
                  variant="outline" 
                  className={`mt-1 ${getStatusColor(client.status)}`}
                >
                  {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                </Badge>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={onBack}>
                Back
              </Button>
              <Button onClick={onEdit}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {client.phone && (
            <div className="flex items-center text-gray-600">
              <Phone className="w-4 h-4 mr-3" />
              <span>{client.phone}</span>
            </div>
          )}
          {client.email && (
            <div className="flex items-center text-gray-600">
              <Mail className="w-4 h-4 mr-3" />
              <span>{client.email}</span>
            </div>
          )}
          {client.address && (
            <div className="flex items-start text-gray-600">
              <MapPin className="w-4 h-4 mr-3 mt-0.5" />
              <span>{client.address}</span>
            </div>
          )}
          {client.notes && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Notes</h4>
              <p className="text-gray-600">{client.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="contacts" className="space-y-6">
        <TabsList>
          <TabsTrigger value="contacts">Contacts</TabsTrigger>
          <TabsTrigger value="work-orders">Work Orders</TabsTrigger>
          <TabsTrigger value="attachments">Attachments</TabsTrigger>
        </TabsList>

        <TabsContent value="contacts" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Contacts</CardTitle>
                <Button onClick={() => setShowContactForm(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Contact
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {showContactForm && (
                <div className="mb-6 p-4 border rounded-lg bg-gray-50">
                  <ContactForm
                    onSubmit={handleCreateContact}
                    onCancel={() => setShowContactForm(false)}
                    isLoading={createContact.isPending}
                  />
                </div>
              )}
              
              {contacts.length === 0 ? (
                <div className="text-center py-8">
                  <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No contacts</h3>
                  <p className="text-gray-500">Add contact information for this client</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {contacts.map((contact) => (
                    <div key={contact.id} className="flex items-start justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium">{contact.name}</h4>
                          {contact.is_primary && (
                            <Badge variant="outline" className="text-xs">Primary</Badge>
                          )}
                        </div>
                        {contact.role && (
                          <p className="text-sm text-gray-600 mb-2">{contact.role}</p>
                        )}
                        <div className="space-y-1">
                          {contact.phone && (
                            <div className="flex items-center text-sm text-gray-600">
                              <Phone className="w-3 h-3 mr-2" />
                              <span>{contact.phone}</span>
                            </div>
                          )}
                          {contact.email && (
                            <div className="flex items-center text-sm text-gray-600">
                              <Mail className="w-3 h-3 mr-2" />
                              <span>{contact.email}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteContact(contact)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="work-orders">
          <Card>
            <CardHeader>
              <CardTitle>Work Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-gray-500">Work orders integration coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attachments">
          <Card>
            <CardHeader>
              <CardTitle>Attachments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-gray-500">File attachments coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
