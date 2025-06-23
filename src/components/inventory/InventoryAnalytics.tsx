
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Package, 
  DollarSign,
  Activity
} from "lucide-react";
import type { InventoryItemWithStats } from "@/lib/database/inventory-enhanced";

interface InventoryAnalyticsProps {
  items: InventoryItemWithStats[];
}

export const InventoryAnalytics = ({ items }: InventoryAnalyticsProps) => {
  // Calculate analytics
  const totalItems = items.length;
  const totalValue = items.reduce((sum, item) => sum + item.total_value, 0);
  const lowStockCount = items.filter(item => item.is_low_stock).length;
  const outOfStockCount = items.filter(item => item.quantity === 0).length;
  const overStockCount = items.filter(item => 
    item.min_quantity && item.quantity > (item.min_quantity * 3)
  ).length;
  
  // Category analysis
  const locationStats = items.reduce((acc, item) => {
    const location = item.location || 'Unassigned';
    if (!acc[location]) {
      acc[location] = { count: 0, value: 0 };
    }
    acc[location].count++;
    acc[location].value += item.total_value;
    return acc;
  }, {} as Record<string, { count: number; value: number }>);
  
  const topLocations = Object.entries(locationStats)
    .sort(([,a], [,b]) => b.value - a.value)
    .slice(0, 5);
  
  // Stock level distribution
  const stockDistribution = {
    healthy: items.filter(item => 
      !item.is_low_stock && item.quantity > 0
    ).length,
    low: lowStockCount,
    out: outOfStockCount,
    over: overStockCount
  };
  
  const averageUnitCost = items.length > 0 
    ? items.reduce((sum, item) => sum + (item.unit_cost || 0), 0) / items.length 
    : 0;
  
  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Avg: ${averageUnitCost.toFixed(2)} per item
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock Health</CardTitle>
            <Activity className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {((stockDistribution.healthy / totalItems) * 100).toFixed(0)}%
            </div>
            <p className="text-xs text-muted-foreground">
              {stockDistribution.healthy} of {totalItems} items healthy
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attention Needed</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{lowStockCount + outOfStockCount}</div>
            <p className="text-xs text-muted-foreground">
              {lowStockCount} low, {outOfStockCount} out of stock
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overstock</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{overStockCount}</div>
            <p className="text-xs text-muted-foreground">
              Items with excess inventory
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Stock Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Stock Level Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{stockDistribution.healthy}</div>
              <Badge variant="outline" className="mt-2 text-green-700 border-green-300">
                Healthy Stock
              </Badge>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{stockDistribution.low}</div>
              <Badge variant="outline" className="mt-2 text-yellow-700 border-yellow-300">
                Low Stock
              </Badge>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{stockDistribution.out}</div>
              <Badge variant="outline" className="mt-2 text-red-700 border-red-300">
                Out of Stock
              </Badge>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{stockDistribution.over}</div>
              <Badge variant="outline" className="mt-2 text-purple-700 border-purple-300">
                Overstock
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Top Locations */}
      <Card>
        <CardHeader>
          <CardTitle>Top Locations by Value</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topLocations.map(([location, stats], index) => (
              <div key={location} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium">{location}</p>
                    <p className="text-sm text-gray-500">{stats.count} items</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">${stats.value.toFixed(2)}</p>
                  <p className="text-sm text-gray-500">
                    ${(stats.value / stats.count).toFixed(2)} avg
                  </p>
                </div>
              </div>
            ))}
            
            {topLocations.length === 0 && (
              <p className="text-center text-gray-500 py-4">No location data available</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
