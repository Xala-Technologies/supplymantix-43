
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { 
  Edit, 
  Trash2, 
  Copy, 
  MoreVertical,
  CheckCircle,
  Globe,
  ExternalLink,
  Activity,
  Eye
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProcedureCardViewProps {
  procedures: any[];
  onEdit: (procedure: any) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onOpenInNewWindow: (procedure: any) => void;
  onViewDetails: (procedure: any) => void;
  getCategoryColor: (category: string) => string;
}

export const ProcedureCardView: React.FC<ProcedureCardViewProps> = ({
  procedures,
  onEdit,
  onDuplicate,
  onDelete,
  onOpenInNewWindow,
  onViewDetails,
  getCategoryColor
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {procedures.map((procedure) => (
        <Card 
          key={procedure.id} 
          className={cn(
            "group bg-white border border-gray-200 rounded-xl shadow-sm",
            "transition-all duration-200 hover:shadow-md hover:border-gray-300",
            "cursor-pointer"
          )}
        >
          <CardContent className="p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 min-w-0">
                <button
                  onClick={() => onViewDetails(procedure)}
                  className={cn(
                    "text-left w-full group/title",
                    "focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-2 rounded-lg"
                  )}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-gray-900 text-lg leading-tight line-clamp-2 group-hover/title:text-blue-600 transition-colors">
                      {procedure.title}
                    </h3>
                    <Eye className="h-4 w-4 opacity-0 group-hover/title:opacity-100 transition-opacity flex-shrink-0 text-blue-600" />
                  </div>
                </button>
                {procedure.description && (
                  <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                    {procedure.description}
                  </p>
                )}
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white border shadow-lg">
                  <DropdownMenuItem onClick={() => onViewDetails(procedure)}>
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDuplicate(procedure.id)}>
                    <Copy className="h-4 w-4 mr-2" />
                    Duplicate
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => onDelete(procedure.id)}
                    className="text-red-600 focus:text-red-600"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Badges */}
            <div className="flex items-center gap-3 mb-6">
              <Badge className={cn(
                "text-xs font-medium border",
                getCategoryColor(procedure.category || 'Other')
              )}>
                {procedure.category}
              </Badge>
              {procedure.is_global && (
                <Badge variant="outline" className="text-blue-600 border-blue-200 text-xs">
                  <Globe className="h-3 w-3 mr-1" />
                  Global
                </Badge>
              )}
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between text-sm text-gray-500 mb-6 py-3 bg-gray-50 rounded-lg px-3">
              <div className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4" />
                <span className="font-medium">{procedure.fields?.length || 0}</span>
                <span>fields</span>
              </div>
              <div className="flex items-center gap-1">
                <Activity className="h-4 w-4" />
                <span className="font-medium">{procedure.executions_count || 0}</span>
                <span>runs</span>
              </div>
            </div>

            {/* Actions */}
            <Button 
              size="sm" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
              onClick={() => onViewDetails(procedure)}
            >
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
