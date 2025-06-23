
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface WorkOrderStatusData {
  status: string;
  count: number;
  color: string;
}

interface WorkOrderStatusChartProps {
  data: WorkOrderStatusData[];
}

export const WorkOrderStatusChart = ({ data }: WorkOrderStatusChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Work Order Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="status" 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => value.replace('_', ' ')}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                formatter={(value) => [value, 'Count']}
                labelFormatter={(label) => label.replace('_', ' ')}
              />
              <Bar 
                dataKey="count" 
                fill="#3B82F6"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
