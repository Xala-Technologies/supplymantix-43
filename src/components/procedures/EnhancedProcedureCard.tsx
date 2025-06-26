
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { 
  MoreVertical, 
  Play, 
  Edit, 
  Copy, 
  Trash2, 
  FileText, 
  Clock,
  Circle,
  CheckCircle2,
  Star
} from "lucide-react";

interface EnhancedProcedureCardProps {
  procedure: any;
  isSelected: boolean;
  onClick: () => void;
  onExecute: (procedure: any) => void;
  onEdit: (procedure: any) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  getCategoryColor: (category: string) => string;
  executingProcedures: Set<string>;
}

export const EnhancedProcedureCard: React.FC<EnhancedProcedureCardProps> = ({
  procedure,
  isSelected,
  onClick,
  onExecute,
  onEdit,
  onDuplicate,
  onDelete,
  getCategoryColor,
  executingProcedures
}) => {
  const isExecuting = executingProcedures.has(procedure.id);
  const fieldCount = procedure.fields?.length || 0;
  
  // Get category colors with enhanced styling
  const getCategoryStyles = (category: string) => {
    const colorMap = {
      'safety': { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200', icon: 'text-red-500' },
      'maintenance': { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200', icon: 'text-blue-500' },
      'inspection': { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200', icon: 'text-green-500' },
      'training': { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200', icon: 'text-purple-500' },
      'quality': { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-200', icon: 'text-yellow-600' },
      'default': { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200', icon: 'text-gray-500' }
    };
    return colorMap[category.toLowerCase()] || colorMap.default;
  };

  const categoryStyles = getCategoryStyles(procedure.category);
  
  return (
    <Card 
      className={`
        relative cursor-pointer transition-all duration-300 hover:shadow-lg group border-l-4
        ${isSelected 
          ? 'bg-blue-50 border-l-blue-600 shadow-md ring-2 ring-blue-100' 
          : 'hover:bg-gray-50 border-l-gray-200 hover:border-l-blue-400'
        }
      `}
      onClick={onClick}
    >
      <CardContent className="p-5">
        <div className="flex items-start space-x-4">
          {/* Enhanced Icon */}
          <div className={`
            w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors
            ${categoryStyles.bg} ${categoryStyles.border} border group-hover:scale-105
          `}>
            <FileText className={`h-6 w-6 ${categoryStyles.icon}`} />
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-semibold text-gray-900 truncate mb-2 group-hover:text-blue-900 transition-colors">
                  {procedure.title}
                </h3>
                
                {/* Enhanced Category Badge */}
                <div className="flex items-center gap-3 mb-3">
                  <Badge className={`${categoryStyles.bg} ${categoryStyles.text} border-0 font-medium px-3 py-1`}>
                    <Circle className="h-3 w-3 mr-1" />
                    {procedure.category}
                  </Badge>
                  
                  <div className="flex items-center text-sm text-gray-500">
                    <FileText className="h-4 w-4 mr-1" />
                    <span className="font-medium">{fieldCount}</span>
                    <span className="ml-1">fields</span>
                  </div>
                </div>

                {/* Tags with improved styling */}
                {procedure.tags && procedure.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {procedure.tags.slice(0, 2).map((tag: string, index: number) => (
                      <Badge 
                        key={index} 
                        variant="outline" 
                        className="text-xs px-2 py-1 bg-white border-gray-300 text-gray-600 hover:bg-gray-50"
                      >
                        {tag}
                      </Badge>
                    ))}
                    {procedure.tags.length > 2 && (
                      <Badge 
                        variant="outline" 
                        className="text-xs px-2 py-1 bg-blue-50 border-blue-200 text-blue-600"
                      >
                        +{procedure.tags.length - 2} more
                      </Badge>
                    )}
                  </div>
                )}

                {/* Status Indicators */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-gray-600 font-medium">Active</span>
                  </div>
                  
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="h-3 w-3" />
                    <span>Updated {new Date(procedure.updated_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Enhanced Actions Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600 hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52 shadow-lg border border-gray-200">
                  <DropdownMenuItem 
                    onClick={(e) => {
                      e.stopPropagation();
                      onExecute(procedure);
                    }}
                    disabled={isExecuting}
                    className="flex items-center gap-3 py-3 text-sm font-medium hover:bg-green-50"
                  >
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Play className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {isExecuting ? 'Starting...' : 'Execute Procedure'}
                      </div>
                      <div className="text-xs text-gray-500">Run this procedure</div>
                    </div>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem 
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(procedure);
                    }}
                    className="flex items-center gap-3 py-3 text-sm font-medium hover:bg-blue-50"
                  >
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Edit className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Edit Template</div>
                      <div className="text-xs text-gray-500">Modify fields and settings</div>
                    </div>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem 
                    onClick={(e) => {
                      e.stopPropagation();
                      onDuplicate(procedure.id);
                    }}
                    className="flex items-center gap-3 py-3 text-sm font-medium hover:bg-yellow-50"
                  >
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                      <Copy className="h-4 w-4 text-yellow-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Duplicate</div>
                      <div className="text-xs text-gray-500">Create a copy</div>
                    </div>
                  </DropdownMenuItem>
                  
                  <div className="border-t border-gray-100 my-1"></div>
                  
                  <DropdownMenuItem 
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(procedure.id);
                    }}
                    className="flex items-center gap-3 py-3 text-sm font-medium hover:bg-red-50 text-red-600"
                  >
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </div>
                    <div>
                      <div className="font-medium">Delete Template</div>
                      <div className="text-xs text-red-500">Remove permanently</div>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Enhanced Progress Indicator for Selected State */}
        {isSelected && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600"></div>
        )}
      </CardContent>
    </Card>
  );
};
