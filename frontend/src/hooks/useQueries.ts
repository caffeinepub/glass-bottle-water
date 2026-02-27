import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Product, Order, OrderItem, OrderStatus } from '../backend';

// ─── Products ────────────────────────────────────────────────────────────────

export function useListProducts() {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listProducts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (p: {
      id: string; name: string; description: string;
      volume: bigint; pricePerUnit: bigint; stockQuantity: bigint; isAvailable: boolean;
    }) => {
      if (!actor) throw new Error('Actor not ready');
      return actor.addProduct(p.id, p.name, p.description, p.volume, p.pricePerUnit, p.stockQuantity, p.isAvailable);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
  });
}

export function useUpdateProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (p: {
      id: string; name: string; description: string;
      volume: bigint; pricePerUnit: bigint; stockQuantity: bigint; isAvailable: boolean;
    }) => {
      if (!actor) throw new Error('Actor not ready');
      return actor.updateProduct(p.id, p.name, p.description, p.volume, p.pricePerUnit, p.stockQuantity, p.isAvailable);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
  });
}

export function useDeleteProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not ready');
      return actor.deleteProduct(id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
  });
}

// ─── Orders ──────────────────────────────────────────────────────────────────

export function useListOrders() {
  const { actor, isFetching } = useActor();
  return useQuery<Order[]>({
    queryKey: ['orders'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listOrders();
    },
    enabled: !!actor && !isFetching,
  });
}

export function usePlaceOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (p: {
      orderId: string; customerName: string; customerContact: string; items: OrderItem[];
    }) => {
      if (!actor) throw new Error('Actor not ready');
      return actor.placeOrder(p.orderId, p.customerName, p.customerContact, p.items);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useUpdateOrderStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (p: { orderId: string; status: OrderStatus }) => {
      if (!actor) throw new Error('Actor not ready');
      return actor.updateOrderStatus(p.orderId, p.status);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['orders'] }),
  });
}
