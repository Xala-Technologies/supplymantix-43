
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
  Eye,
  PlayCircle,
  Activity
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-6">
      {procedures.map((procedure) => (
        <Card 
          key={procedure.id} 
          className={cn(
            "group relative bg-white border border-gray-200/60 rounded-lg shadow-sm",
            "transition-all duration-200 ease-out",
            "hover:shadow-md hover:border-gray-300/80 hover:-translate-y-0.5",
            "cursor-pointer overflow-hidden h-64 flex flex-col"
          )}
        >
          <CardContent className="p-4 flex flex-col h-full">
            {/* Header with Icon and Actions */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <div className="flex-shrink-0 w-7 h-7 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg flex items-center justify-center">
                  <PlayCircle className="h-3.5 w-3.5 text-blue-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <button
                    onClick={() => onViewDetails(procedure)}
                    className="text-left w-full focus:outline-none"
                  >
                    <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2 hover:text-blue-700 transition-colors">
                      {procedure.title}
                    </h3>
                  </button>
                </div>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0 rounded-md flex-shrink-0"
                  >
                    <MoreVertical className="h-3 w-3 text-gray-500" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-36">
                  <DropdownMenuItem onClick={() => onViewDetails(procedure)}>
                    <Eye className="h-3.5 w-3.5 mr-2" />
                    View
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onEdit(procedure)}>
                    <Edit className="h-3.5 w-3.5 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDuplicate(procedure.id)}>
                    <Copy className="h-3.5 w-3.5 mr-2" />
                    Duplicate
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => onDelete(procedure.id)}
                    className="text-red-600 focus:text-red-700"
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Description - Fixed height container */}
            <div className="mb-3 min-h-[2.5rem] flex-shrink-0">
              {procedure.description && (
                <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                  {procedure.description}
                </p>
              )}
            </div>

            {/* Badges - Fixed height container */}
            <div className="flex items-center gap-1.5 mb-3 flex-wrap min-h-[1.5rem] flex-shrink-0">
              <Badge className={cn(
                "text-xs font-medium border-0 px-2 py-0.5 rounded-md",
                getCategoryColor(procedure.category || 'Other')
              )}>
                {procedure.category}
              </Badge>
              {procedure.is_global && (
                <Badge className="text-blue-700 bg-blue-50 border border-blue-200/50 text-xs font-medium px-2 py-0.5 rounded-md">
                  <Globe className="h-2 w-2 mr-1" />
                  Global
                </Badge>
              )}
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between text-xs text-gray-600 mb-3 flex-shrink-0">
              <div className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-green-600" />
                <span>{procedure.fields?.length || 0} fields</span>
              </div>
              <div className="flex items-center gap-1">
                <Activity className="h-3 w-3 text-blue-600" />
                <span>{procedure.executions_count || 0} runs</span>
              </div>
            </div>

            {/* Action Button - Always at bottom */}
            <div className="mt-auto">
              <Button 
                size="sm" 
                className="w-full h-7 text-xs font-medium rounded-md bg-blue-600 hover:bg-blue-700"
                onClick={() => onViewDetails(procedure)}
              >
                <Eye className="h-3 w-3 mr-1.5" />
                View Details
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
