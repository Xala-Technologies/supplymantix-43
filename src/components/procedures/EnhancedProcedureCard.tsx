
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { 
  MoreVertical, 
  Edit, 
  Copy, 
  Trash2, 
  FileText, 
  Clock,
  Circle
} from "lucide-react";

interface EnhancedProcedureCardProps {
  procedure: any;
  isSelected: boolean;
  onClick: () => void;
  onEdit: (procedure: any) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  getCategoryColor: (category: string) => string;
}

export const EnhancedProcedureCard: React.FC<EnhancedProcedureCardProps> = ({
  procedure,
  isSelected,
  onClick,
  onEdit,
  onDuplicate,
  onDelete,
  getCategoryColor
}) => {
  const fieldCount = procedure.fields?.length || 0;
  
  return (
    <div 
      className={`
        relative mb-2 cursor-pointer transition-all duration-200
        ${isSelected 
          ? 'bg-blue-50 border-l-4 border-l-blue-600' 
          : 'hover:bg-gray-50 border-l-4 border-l-transparent'
        }
      `}
      onClick={onClick}
    >
      <div className="p-4">
        <div className="flex items-start space-x-3">
          {/* Procedure Icon */}
          <div className={`
            w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
            ${getCategoryColor(procedure.category)} bg-opacity-10
          `}>
            <FileText className={`h-5 w-5 ${getCategoryColor(procedure.category)}`} />
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-900 truncate mb-1">
                  {procedure.title}
                </h3>
                
                <div className="flex items-center space-x-3 text-xs text-gray-500 mb-2">
                  <div className="flex items-center">
                    <Circle className="h-3 w-3 mr-1" />
                    {procedure.category}
                  </div>
                  <div className="flex items-center">
                    <FileText className="h-3 w-3 mr-1" />
                    {fieldCount} fields
                  </div>
                </div>

                {procedure.tags && procedure.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {procedure.tags.slice(0, 2).map((tag: string, index: number) => (
                      <Badge 
                        key={index} 
                        variant="secondary" 
                        className="text-xs px-1.5 py-0.5 h-auto"
                      >
                        {tag}
                      </Badge>
                    ))}
                    {procedure.tags.length > 2 && (
                      <Badge variant="outline" className="text-xs px-1.5 py-0.5 h-auto">
                        +{procedure.tags.length - 2}
                      </Badge>
                    )}
                  </div>
                )}
              </div>

              {/* Actions Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem 
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(procedure);
                    }}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={(e) => {
                      e.stopPropagation();
                      onDuplicate(procedure.id);
                    }}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Duplicate
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(procedure.id);
                    }}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Updated timestamp */}
            <div className="flex items-center text-xs text-gray-400 mt-1">
              <Clock className="h-3 w-3 mr-1" />
              Updated {new Date(procedure.updated_at).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
