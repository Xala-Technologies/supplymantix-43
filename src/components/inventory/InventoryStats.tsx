
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Package, 
  AlertTriangle, 
  DollarSign, 
  TrendingUp 
} from "lucide-react";

interface InventoryStatsProps {
  totalItems: number;
  lowStockItems: number;
  totalValue: number;
  categories: number;
}

export const InventoryStats = ({ 
  totalItems, 
  lowStockItems, 
  totalValue, 
  categories 
}: InventoryStatsProps) => {
  const stats = [
    {
      name: "Total Items",
      value: totalItems,
      icon: Package,
      color: "text-primary-600"
    },
    {
      name: "Low Stock",
      value: lowStockItems,
      icon: AlertTriangle,
      color: "text-warning-600"
    },
    {
      name: "Total Value",
      value: `$${totalValue.toFixed(2)}`,
      icon: DollarSign,
      color: "text-success-600"
    },
    {
      name: "Categories",
      value: categories,
      icon: TrendingUp,
      color: "text-secondary-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat) => (
        <Card key={stat.name}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-secondary">{stat.name}</p>
                <p className="text-2xl font-bold text-text-primary">{stat.value}</p>
              </div>
              <stat.icon className={`h-8 w-8 ${stat.color}`} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
