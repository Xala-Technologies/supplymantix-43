import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Package, Plus, User, Calendar } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

interface PartsUsageCardProps {
  workOrderId: string;
}

interface PartsUsed {
  id: string;
  inventory_item_id: string;
  quantity: number;
  cost_per_unit?: number;
  total_cost?: number;
  created_at: string;
  notes?: string;
  user?: {
    email: string;
    first_name?: string;
    last_name?: string;
  };
}

export const PartsUsageCard: React.FC<PartsUsageCardProps> = ({
  workOrderId
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [inventoryItemId, setInventoryItemId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [notes, setNotes] = useState('');

  // Fetch parts used for this work order
  const { data: partsUsed = [], isLoading } = useQuery({
    queryKey: ['work-order-parts-used', workOrderId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('work_order_parts_used')
        .select('*')
        .eq('work_order_id', workOrderId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []) as any[];
    },
    enabled: !!workOrderId,
  });

  // For now, we'll use a simple placeholder since inventory_items table structure is not defined
  const inventoryItems: any[] = [];

  const handleAddParts = async () => {
    if (!quantity || parseInt(quantity) <= 0) {
      toast.error('Please enter a valid quantity');
      return;
    }

    try {
      // For now, manually insert parts usage record
      const { error } = await supabase
        .from('work_order_parts_used')
        .insert({
          work_order_id: workOrderId,
          inventory_item_id: inventoryItemId || 'manual-entry',
          quantity: parseInt(quantity),
          notes: notes.trim() || null,
          used_by: (await supabase.auth.getUser()).data.user?.id
        });

      if (error) throw error;

      toast.success('Parts usage recorded successfully');
      setIsDialogOpen(false);
      setInventoryItemId('');
      setQuantity('');
      setNotes('');
    } catch (error: any) {
      console.error('Error recording parts usage:', error);
      toast.error(error.message || 'Failed to record parts usage');
    }
  };

  const totalCost = partsUsed.reduce((sum: number, part: any) => sum + (part.total_cost || 0), 0);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Parts & Materials
          </CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Record Usage
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Record Parts Usage</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="item">Part/Material Name</Label>
                  <Input
                    id="item"
                    placeholder="Enter part or material name"
                    value={inventoryItemId}
                    onChange={(e) => setInventoryItemId(e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="quantity">Quantity Used</Label>
                  <Input
                    id="quantity"
                    type="number"
                    placeholder="Enter quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    min="1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="notes">Notes (optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Additional notes about usage..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                  />
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddParts}
                    disabled={!quantity}
                  >
                    Record Usage
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {/* Total cost summary */}
        {partsUsed.length > 0 && (
          <div className="mb-6 p-4 bg-muted/50 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                ${totalCost.toFixed(2)}
              </div>
              <div className="text-sm text-muted-foreground">Total parts cost</div>
            </div>
          </div>
        )}

        {/* Parts usage entries */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-4 w-4 rounded-full" />
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : partsUsed.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No parts usage recorded yet
          </p>
        ) : (
          <div className="space-y-3">
            {partsUsed.map((part: any) => (
              <div key={part.id} className="flex items-start gap-3 pb-3 border-b border-border last:border-b-0">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="secondary" className="text-xs">
                      Qty: {part.quantity}
                    </Badge>
                    {part.total_cost && (
                      <Badge variant="outline" className="text-xs">
                        ${part.total_cost.toFixed(2)}
                      </Badge>
                    )}
                    {part.inventory_item_id && part.inventory_item_id !== 'manual-entry' && (
                      <Badge variant="outline" className="text-xs">
                        {part.inventory_item_id}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-1">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDistanceToNow(new Date(part.created_at), { addSuffix: true })}</span>
                    </div>
                  </div>
                  
                  {part.notes && (
                    <p className="text-sm text-muted-foreground italic">
                      "{part.notes}"
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};