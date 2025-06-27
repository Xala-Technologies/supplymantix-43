
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
  Eye,
  PlayCircle
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
      {procedures.map((procedure) => (
        <Card 
          key={procedure.id} 
          className={cn(
            "group relative bg-white border border-gray-200/60 rounded-2xl shadow-sm",
            "transition-all duration-300 ease-out",
            "hover:shadow-lg hover:shadow-gray-200/40 hover:border-gray-300/80 hover:-translate-y-1",
            "cursor-pointer overflow-hidden"
          )}
        >
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-gray-50/30 pointer-events-none" />
          
          <CardContent className="relative p-7">
            {/* Header Section */}
            <div className="flex items-start justify-between mb-5">
              <div className="flex-1 min-w-0 pr-3">
                <button
                  onClick={() => onViewDetails(procedure)}
                  className={cn(
                    "group/title text-left w-full",
                    "focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:ring-offset-2 rounded-xl p-2 -m-2",
                    "transition-all duration-200"
                  )}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl flex items-center justify-center border border-blue-100/50">
                      <PlayCircle className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-gray-900 text-base leading-snug line-clamp-2 group-hover/title:text-blue-700 transition-colors duration-200">
                        {procedure.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1 opacity-0 group-hover/title:opacity-100 transition-opacity duration-200">
                        <Eye className="h-3.5 w-3.5 text-blue-600" />
                        <span className="text-xs text-blue-600 font-medium">View Details</span>
                      </div>
                    </div>
                  </div>
                </button>
                
                {procedure.description && (
                  <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed px-2">
                    {procedure.description}
                  </p>
                )}
              </div>
              
              {/* Action Menu */}
              <div className="flex-shrink-0">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className={cn(
                        "opacity-0 group-hover:opacity-100 transition-all duration-200",
                        "h-8 w-8 p-0 rounded-lg hover:bg-gray-100/80"
                      )}
                    >
                      <MoreVertical className="h-4 w-4 text-gray-500" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-white border shadow-lg rounded-xl border-gray-200/60 w-48">
                    <DropdownMenuItem 
                      onClick={() => onViewDetails(procedure)}
                      className="rounded-lg mx-1 mt-1"
                    >
                      <Eye className="h-4 w-4 mr-3 text-gray-500" />
                      <span className="font-medium">View Details</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => onEdit(procedure)}
                      className="rounded-lg mx-1"
                    >
                      <Edit className="h-4 w-4 mr-3 text-gray-500" />
                      <span className="font-medium">Edit</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => onDuplicate(procedure.id)}
                      className="rounded-lg mx-1"
                    >
                      <Copy className="h-4 w-4 mr-3 text-gray-500" />
                      <span className="font-medium">Duplicate</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => onDelete(procedure.id)}
                      className="rounded-lg mx-1 mb-1 text-red-600 focus:text-red-700 focus:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4 mr-3" />
                      <span className="font-medium">Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Badges Section */}
            <div className="flex items-center gap-2 mb-6">
              <Badge className={cn(
                "text-xs font-medium border-0 px-3 py-1.5 rounded-full",
                "shadow-sm",
                getCategoryColor(procedure.category || 'Other')
              )}>
                {procedure.category}
              </Badge>
              {procedure.is_global && (
                <Badge className="text-blue-700 bg-blue-50 border border-blue-200/50 text-xs font-medium px-3 py-1.5 rounded-full">
                  <Globe className="h-3 w-3 mr-1.5" />
                  Global
                </Badge>
              )}
            </div>

            {/* Stats Section */}
            <div className="bg-gradient-to-r from-gray-50/80 to-gray-100/40 rounded-xl p-4 mb-6 border border-gray-100/60">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center shadow-sm border border-gray-200/40">
                    <CheckCircle className="h-3.5 w-3.5 text-green-600" />
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900">{procedure.fields?.length || 0}</span>
                    <span className="text-gray-600 ml-1">fields</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center shadow-sm border border-gray-200/40">
                    <Activity className="h-3.5 w-3.5 text-blue-600" />
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900">{procedure.executions_count || 0}</span>
                    <span className="text-gray-600 ml-1">runs</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <Button 
              size="sm" 
              className={cn(
                "w-full font-medium rounded-xl h-10",
                "bg-gradient-to-r from-blue-600 to-blue-700",
                "hover:from-blue-700 hover:to-blue-800",
                "shadow-sm hover:shadow-md",
                "transition-all duration-200",
                "text-white border-0"
              )}
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
