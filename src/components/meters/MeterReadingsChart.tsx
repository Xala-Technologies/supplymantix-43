import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, subDays, subWeeks, subMonths, subYears } from "date-fns";
import { Calendar, TrendingUp, TrendingDown } from "lucide-react";
import type { MeterReading } from "@/hooks/useMetersEnhanced";

interface MeterReadingsChartProps {
  readings: MeterReading[];
  unit: string;
}

type TimeRange = '1H' | '1D' | '1W' | '1M' | '3M' | '6M' | '1Y' | 'Custom';

export const MeterReadingsChart = ({ readings, unit }: MeterReadingsChartProps) => {
  const [timeRange, setTimeRange] = useState<TimeRange>('1W');

  const getFilteredReadings = () => {
    if (!readings || readings.length === 0) return [];

    const now = new Date();
    let cutoffDate: Date;

    switch (timeRange) {
      case '1H':
        cutoffDate = new Date(now.getTime() - 60 * 60 * 1000);
        break;
      case '1D':
        cutoffDate = subDays(now, 1);
        break;
      case '1W':
        cutoffDate = subWeeks(now, 1);
        break;
      case '1M':
        cutoffDate = subMonths(now, 1);
        break;
      case '3M':
        cutoffDate = subMonths(now, 3);
        break;
      case '6M':
        cutoffDate = subMonths(now, 6);
        break;
      case '1Y':
        cutoffDate = subYears(now, 1);
        break;
      default:
        return readings;
    }

    return readings
      .filter(reading => new Date(reading.recorded_at) >= cutoffDate)
      .sort((a, b) => new Date(a.recorded_at).getTime() - new Date(b.recorded_at).getTime());
  };

  const filteredReadings = getFilteredReadings();

  const chartData = filteredReadings.map(reading => ({
    date: reading.recorded_at,
    value: Number(reading.value),
    formattedDate: format(new Date(reading.recorded_at), timeRange === '1H' ? 'HH:mm' : 
                         timeRange === '1D' ? 'HH:mm' :
                         timeRange === '1W' ? 'MMM dd' :
                         'MMM dd'),
  }));

  const calculateTrend = () => {
    if (chartData.length < 2) return null;
    
    const latest = chartData[chartData.length - 1].value;
    const previous = chartData[chartData.length - 2].value;
    const change = latest - previous;
    const percentChange = previous !== 0 ? (change / previous) * 100 : 0;
    
    return {
      change,
      percentChange,
      isPositive: change > 0,
    };
  };

  const trend = calculateTrend();

  const timeRangeButtons: TimeRange[] = ['1H', '1D', '1W', '1M', '3M', '6M', '1Y'];

  if (!readings || readings.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Readings History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No readings recorded yet</p>
            <p className="text-sm">Record your first reading to see the chart</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5" />
            <div>
              <CardTitle>Readings History</CardTitle>
              {trend && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  {trend.isPositive ? (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  )}
                  <span className={trend.isPositive ? "text-green-600" : "text-red-600"}>
                    {trend.isPositive ? "+" : ""}{trend.change.toFixed(2)} {unit} 
                    ({trend.percentChange.toFixed(1)}%)
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1">
            {timeRangeButtons.map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeRange(range)}
                className="h-8 px-3"
              >
                {range}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No readings in the selected time range</p>
            <p className="text-sm">Try selecting a different time period</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>{chartData.length} readings</span>
              <Badge variant="outline">
                Latest: {chartData[chartData.length - 1]?.value} {unit}
              </Badge>
            </div>
            
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="formattedDate" 
                    tick={{ fontSize: 12 }}
                    className="text-muted-foreground"
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    className="text-muted-foreground"
                    label={{ value: unit, angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip 
                    labelFormatter={(value, payload) => {
                      if (payload && payload[0]) {
                        return format(new Date(payload[0].payload.date), 'MMM dd, yyyy HH:mm');
                      }
                      return value;
                    }}
                    formatter={(value: number) => [`${value} ${unit}`, 'Reading']}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px',
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: 'hsl(var(--primary))', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="text-center">
              <Button variant="outline" size="sm">
                View All Readings
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};