import React from 'react';
import { Client } from '@/hooks/useClients';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Building2, Mail, Phone, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ClientsListPanelProps {
  clients: Client[];
  selectedClient: string | null;
  onSelectClient: (id: string) => void;
}

export const ClientsListPanel: React.FC<ClientsListPanelProps> = ({
  clients,
  selectedClient,
  onSelectClient
}) => {
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'suspended':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold">Clients</h2>
        <p className="text-sm text-muted-foreground">{clients.length} total</p>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="space-y-2 p-2">
          {clients.map((client) => {
            const isSelected = selectedClient === client.id;
            
            return (
              <div
                key={client.id}
                onClick={() => onSelectClient(client.id)}
                className={cn(
                  "p-3 rounded-lg border cursor-pointer transition-all hover:shadow-sm",
                  isSelected 
                    ? "bg-primary/5 border-primary shadow-sm" 
                    : "bg-card border-border hover:bg-accent/50"
                )}
              >
                <div className="space-y-3">
                  {/* Header with status */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm truncate">
                        {client.name || 'Untitled Client'}
                      </h3>
                      <p className="text-xs text-muted-foreground truncate">
                        Client ID: {client.id.slice(-8)}
                      </p>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={cn("text-xs ml-2 flex-shrink-0", getStatusColor(client.status))}
                    >
                      {client.status || 'Active'}
                    </Badge>
                  </div>

                  {/* Details */}
                  <div className="space-y-1">
                    {client.email && (
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Mail className="w-3 h-3" />
                        <span className="truncate">{client.email}</span>
                      </div>
                    )}
                    
                    {client.phone && (
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Phone className="w-3 h-3" />
                        <span className="truncate">{client.phone}</span>
                      </div>
                    )}

                    {client.address && (
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate">{client.address}</span>
                      </div>
                    )}

                    {client.notes && (
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Building2 className="w-3 h-3" />
                        <span className="truncate">{client.notes.slice(0, 50)}...</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};