
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { 
  Edit, 
  Trash2, 
  Copy, 
  MoreHorizontal,
  CheckCircle,
  Globe,
  ExternalLink,
  Activity,
  Eye
} from 'lucide-react';

interface ProcedureListViewProps {
  procedures: any[];
  onEdit: (procedure: any) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onOpenInNewWindow: (procedure: any) => void;
  onViewDetails: (procedure: any) => void;
  getCategoryColor: (category: string) => string;
}

export const ProcedureListView: React.FC<ProcedureListViewProps> = ({
  procedures,
  onEdit,
  onDuplicate,
  onDelete,
  onOpenInNewWindow,
  onViewDetails,
  getCategoryColor
}) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center justify-between text-sm font-medium text-gray-600">
          <div className="flex-1">Procedure</div>
          <div className="hidden md:block w-24 text-center">Steps</div>
          <div className="hidden md:block w-24 text-center">Runs</div>
          <div className="hidden md:block w-32 text-center">Category</div>
          <div className="w-24 text-center">Actions</div>
        </div>
      </div>

      {/* List Items */}
      <div className="divide-y divide-gray-100">
        {procedures.map((procedure) => (
          <div key={procedure.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              {/* Procedure Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <button
                    onClick={() => onViewDetails(procedure)}
                    className="font-semibold text-gray-900 hover:text-blue-600 transition-colors flex items-center gap-2 group"
                  >
                    {procedure.title}
                    <Eye className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                  {procedure.is_global && (
                    <Badge variant="outline" className="text-blue-600 border-blue-600 text-xs">
                      <Globe className="h-3 w-3 mr-1" />
                      Global
                    </Badge>
                  )}
                </div>
                {procedure.description && (
                  <p className="text-sm text-gray-600 line-clamp-1 mb-2">
                    {procedure.description}
                  </p>
                )}
              </div>

              {/* Steps Count - Hidden on mobile */}
              <div className="hidden md:flex w-24 justify-center">
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <CheckCircle className="h-4 w-4" />
                  {procedure.fields?.length || 0}
                </div>
              </div>

              {/* Runs Count - Hidden on mobile */}
              <div className="hidden md:flex w-24 justify-center">
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Activity className="h-4 w-4" />
                  {procedure.executions_count || 0}
                </div>
              </div>

              {/* Category - Hidden on mobile */}
              <div className="hidden md:flex w-32 justify-center">
                <Badge className={`${getCategoryColor(procedure.category || 'Other')} text-xs`}>
                  {procedure.category}
                </Badge>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 w-24 justify-center">
                <Button
                  size="sm"
                  onClick={() => onViewDetails(procedure)}
                  className="bg-blue-600 hover:bg-blue-700 text-xs px-2"
                >
                  <Eye className="h-3 w-3" />
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
