
import React from "react";
import { useMeterReadings } from "@/hooks/useMetersEnhanced";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, TrendingDown, Clock, User } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface MeterReadingsHistoryProps {
  meterId: string;
}

export const MeterReadingsHistory = ({ meterId }: MeterReadingsHistoryProps) => {
  const { data: readings, isLoading } = useMeterReadings(meterId);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-64 w-full" />
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!readings || readings.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <TrendingUp className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Readings Yet</h3>
          <p className="text-gray-500 text-center">
            Record your first reading to start tracking this meter's performance.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Prepare chart data
  const chartData = readings
    .slice()
    .reverse()
    .map((reading) => ({
      date: new Date(reading.recorded_at).toLocaleDateString(),
      value: Number(reading.value),
      fullDate: reading.recorded_at,
    }));

  // Calculate trend
  const getTrend = () => {
    if (readings.length < 2) return null;
    const latest = Number(readings[0].value);
    const previous = Number(readings[1].value);
    return latest > previous ? 'up' : latest < previous ? 'down' : 'same';
  };

  const trend = getTrend();

  return (
    <div className="space-y-6">
      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Reading Trend
            {trend && (
              <Badge variant={trend === 'up' ? 'default' : trend === 'down' ? 'destructive' : 'secondary'}>
                {trend === 'up' && <TrendingUp className="h-3 w-3 mr-1" />}
                {trend === 'down' && <TrendingDown className="h-3 w-3 mr-1" />}
                {trend === 'up' ? 'Increasing' : trend === 'down' ? 'Decreasing' : 'Stable'}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  labelFormatter={(label) => `Date: ${label}`}
                  formatter={(value) => [value, 'Value']}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Recent Readings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Readings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {readings.slice(0, 10).map((reading) => (
              <div key={reading.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <div>
                    <p className="font-semibold text-lg">{Number(reading.value).toLocaleString()}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {new Date(reading.recorded_at).toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  {reading.users && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                      <User className="h-3 w-3" />
                      {reading.users.first_name || reading.users.last_name 
                        ? `${reading.users.first_name || ''} ${reading.users.last_name || ''}`.trim()
                        : reading.users.email
                      }
                    </div>
                  )}
                  {reading.comment && (
                    <p className="text-xs text-muted-foreground max-w-xs">
                      {reading.comment}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
