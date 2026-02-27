import React from 'react';
import { ClipboardList, Clock, CheckCircle2, Truck, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useListOrders, useUpdateOrderStatus } from '../hooks/useQueries';
import { formatPrice, formatDate } from '../lib/utils';
import { OrderStatus } from '../backend';

const statusConfig: Record<OrderStatus, { label: string; icon: React.ElementType; className: string }> = {
  [OrderStatus.pending]: { label: 'Pending', icon: Clock, className: 'bg-amber-500/15 text-amber-700 border-amber-200' },
  [OrderStatus.confirmed]: { label: 'Confirmed', icon: CheckCircle2, className: 'bg-blue-500/15 text-blue-700 border-blue-200' },
  [OrderStatus.delivered]: { label: 'Delivered', icon: Truck, className: 'bg-emerald-500/15 text-emerald-700 border-emerald-200' },
  [OrderStatus.cancelled]: { label: 'Cancelled', icon: XCircle, className: 'bg-red-500/15 text-red-700 border-red-200' },
};

export default function OrderManagement() {
  const { data: orders, isLoading } = useListOrders();
  const updateStatus = useUpdateOrderStatus();

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-display font-bold text-xl text-foreground">Orders</h2>
        <p className="text-sm text-muted-foreground">{orders?.length ?? 0} total orders</p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-14 w-full rounded-xl" />)}
        </div>
      ) : !orders?.length ? (
        <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-border rounded-2xl">
          <ClipboardList className="w-10 h-10 text-muted-foreground/40 mb-3" />
          <p className="font-display font-semibold text-foreground">No orders yet</p>
          <p className="text-sm text-muted-foreground mt-1">Orders will appear here once customers place them</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="font-display font-semibold">Order ID</TableHead>
                <TableHead className="font-display font-semibold">Customer</TableHead>
                <TableHead className="font-display font-semibold">Items</TableHead>
                <TableHead className="font-display font-semibold">Total</TableHead>
                <TableHead className="font-display font-semibold">Date</TableHead>
                <TableHead className="font-display font-semibold">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map(order => {
                const cfg = statusConfig[order.status];
                const Icon = cfg.icon;
                return (
                  <TableRow key={order.orderId} className="hover:bg-muted/20">
                    <TableCell>
                      <span className="font-mono text-xs text-muted-foreground">{order.orderId}</span>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-semibold text-sm text-foreground">{order.customerName}</p>
                        <p className="text-xs text-muted-foreground">{order.customerContact}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold text-sm text-primary">{formatPrice(order.totalPrice)}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-muted-foreground">{formatDate(order.createdAt)}</span>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={order.status}
                        onValueChange={val => updateStatus.mutate({ orderId: order.orderId, status: val as OrderStatus })}
                      >
                        <SelectTrigger className="w-36 h-8 rounded-lg text-xs">
                          <div className="flex items-center gap-1.5">
                            <Icon className="w-3 h-3" />
                            <SelectValue />
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(OrderStatus).map(s => {
                            const c = statusConfig[s];
                            const SI = c.icon;
                            return (
                              <SelectItem key={s} value={s} className="text-xs">
                                <div className="flex items-center gap-1.5">
                                  <SI className="w-3 h-3" />
                                  {c.label}
                                </div>
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
