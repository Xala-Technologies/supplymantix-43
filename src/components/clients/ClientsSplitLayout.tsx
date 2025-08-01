import React from 'react';
import { Client } from '@/hooks/useClients';
import { ClientsListPanel } from './ClientsListPanel';
import { ClientDetailPanel } from './ClientDetailPanel';

interface ClientsSplitLayoutProps {
  clients: Client[];
  selectedClient: string | null;
  onSelectClient: (id: string) => void;
  onEditClient: () => void;
  selectedClientData?: Client;
}

export const ClientsSplitLayout: React.FC<ClientsSplitLayoutProps> = ({
  clients,
  selectedClient,
  onSelectClient,
  onEditClient,
  selectedClientData
}) => {
  return (
    <div className="flex h-full">
      {/* Left Panel - Clients List */}
      <div className="w-80 border-r border-border bg-background">
        <ClientsListPanel
          clients={clients}
          selectedClient={selectedClient}
          onSelectClient={onSelectClient}
        />
      </div>
      
      {/* Right Panel - Client Details */}
      <div className="flex-1 bg-background">
        {selectedClientData ? (
          <ClientDetailPanel
            client={selectedClientData}
            onEditClient={onEditClient}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">Select a client</h3>
              <p>Choose a client from the list to view their details</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};