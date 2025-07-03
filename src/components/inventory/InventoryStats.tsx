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
      color: "text-blue-600"
    },
    {
      name: "Low Stock",
      value: lowStockItems,
      icon: AlertTriangle,
      color: "text-orange-600"
    },
    {
      name: "Total Value",
      value: `$${totalValue.toFixed(2)}`,
      icon: DollarSign,
      color: "text-green-600"
    },
    {
      name: "Categories",
      value: categories,
      icon: TrendingUp,
      color: "text-purple-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
        <span className="text-gray-500 text-xs mb-1">Total Parts</span>
        <span className="text-2xl font-bold text-gray-900">{totalItems}</span>
      </div>
      <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
        <span className="text-gray-500 text-xs mb-1">Low Stock Parts</span>
        <span className="text-2xl font-bold text-yellow-600">{lowStockItems}</span>
      </div>
      <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
        <span className="text-gray-500 text-xs mb-1">Total Value</span>
        <span className="text-2xl font-bold text-green-700">${totalValue.toLocaleString()}</span>
      </div>
      <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
        <span className="text-gray-500 text-xs mb-1">Categories</span>
        <span className="text-2xl font-bold text-blue-700">{categories}</span>
      </div>
    </div>
  );
};
