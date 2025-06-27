
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
        <Card key={procedure.id} className="group hover:shadow-md transition-all duration-200 border-gray-200">
          <CardContent className="p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 min-w-0">
                <button
                  onClick={() => onViewDetails(procedure)}
                  className="font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2 text-left group/title"
                >
                  <div className="flex items-center gap-2">
                    {procedure.title}
                    <Eye className="h-4 w-4 opacity-0 group-hover/title:opacity-100 transition-opacity flex-shrink-0" />
                  </div>
                </button>
                {procedure.description && (
                  <p className="text-sm text-gray-600 line-clamp-2 mt-2">
                    {procedure.description}
                  </p>
                )}
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white border shadow-lg">
                  <DropdownMenuItem onClick={() => onViewDetails(procedure)}>
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onOpenInNewWindow(procedure)}>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open in New Window
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onEdit(procedure)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDuplicate(procedure.id)}>
                    <Copy className="h-4 w-4 mr-2" />
                    Duplicate
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => onDelete(procedure.id)}
                    className="text-red-600"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Badges */}
            <div className="flex items-center gap-2 mb-4">
              <Badge className={`${getCategoryColor(procedure.category || 'Other')} text-xs`}>
                {procedure.category}
              </Badge>
              {procedure.is_global && (
                <Badge variant="outline" className="text-blue-600 border-blue-600 text-xs">
                  <Globe className="h-3 w-3 mr-1" />
                  Global
                </Badge>
              )}
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-4 w-4" />
                  {procedure.fields?.length || 0} steps
                </div>
                <div className="flex items-center gap-1">
                  <Activity className="h-4 w-4" />
                  {procedure.executions_count || 0} runs
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button 
                size="sm" 
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                onClick={() => onViewDetails(procedure)}
              >
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onEdit(procedure)}
                className="px-3"
              >
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
