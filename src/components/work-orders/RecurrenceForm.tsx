import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Repeat, X } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { RecurrencePattern } from '@/hooks/useWorkOrderRecurrence';

interface RecurrenceFormProps {
  initialPattern?: RecurrencePattern;
  onPatternChange: (pattern: RecurrencePattern) => void;
  onRemove?: () => void;
  showRemove?: boolean;
}

export const RecurrenceForm: React.FC<RecurrenceFormProps> = ({
  initialPattern,
  onPatternChange,
  onRemove,
  showRemove = false
}) => {
  const [pattern, setPattern] = useState<RecurrencePattern>(
    initialPattern || { rule: 'none', interval: 1 }
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    initialPattern?.endDate ? new Date(initialPattern.endDate) : undefined
  );

  const handleRuleChange = (rule: string) => {
    const newPattern = { ...pattern, rule: rule as RecurrencePattern['rule'] };
    setPattern(newPattern);
    onPatternChange(newPattern);
  };

  const handleIntervalChange = (interval: string) => {
    const newPattern = { ...pattern, interval: parseInt(interval) || 1 };
    setPattern(newPattern);
    onPatternChange(newPattern);
  };

  const handleEndDateChange = (date: Date | undefined) => {
    setEndDate(date);
    const newPattern = { 
      ...pattern, 
      endDate: date ? date.toISOString() : undefined 
    };
    setPattern(newPattern);
    onPatternChange(newPattern);
  };

  const getRuleLabel = (rule: string) => {
    switch (rule) {
      case 'daily': return 'day(s)';
      case 'weekly': return 'week(s)';
      case 'monthly': return 'month(s)';
      case 'yearly': return 'year(s)';
      default: return '';
    }
  };

  if (pattern.rule === 'none') {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Repeat className="w-4 h-4" />
            Recurrence
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="recurrence-rule">Repeat Schedule</Label>
              <Select value={pattern.rule} onValueChange={handleRuleChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Does not repeat" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Does not repeat</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Repeat className="w-4 h-4" />
            Recurrence Schedule
          </CardTitle>
          {showRemove && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRemove}
              className="h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="recurrence-rule">Repeat Schedule</Label>
            <Select value={pattern.rule} onValueChange={handleRuleChange}>
              <SelectTrigger>
                <SelectValue placeholder="Does not repeat" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Does not repeat</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex-1">
              <Label htmlFor="recurrence-interval">Every</Label>
              <Input
                id="recurrence-interval"
                type="number"
                min="1"
                max="99"
                value={pattern.interval}
                onChange={(e) => handleIntervalChange(e.target.value)}
                className="w-20"
              />
            </div>
            <div className="flex-2 pt-6">
              <span className="text-sm text-gray-600">
                {getRuleLabel(pattern.rule)}
              </span>
            </div>
          </div>

          <div>
            <Label>End Date (Optional)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP") : "No end date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={handleEndDateChange}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              <strong>Preview:</strong> This work order will repeat every{' '}
              {pattern.interval} {getRuleLabel(pattern.rule)}
              {endDate && ` until ${format(endDate, 'MMM dd, yyyy')}`}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};