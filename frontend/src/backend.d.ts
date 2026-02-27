import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface OrderItem {
    productId: string;
    quantity: bigint;
}
export interface Order {
    customerName: string;
    status: OrderStatus;
    customerContact: string;
    createdAt: bigint;
    orderId: string;
    items: Array<OrderItem>;
    totalPrice: bigint;
}
export interface Product {
    id: string;
    stockQuantity: bigint;
    name: string;
    isAvailable: boolean;
    description: string;
    volume: bigint;
    pricePerUnit: bigint;
}
export enum OrderStatus {
    cancelled = "cancelled",
    pending = "pending",
    delivered = "delivered",
    confirmed = "confirmed"
}
export interface backendInterface {
    addProduct(id: string, name: string, description: string, volume: bigint, pricePerUnit: bigint, stockQuantity: bigint, isAvailable: boolean): Promise<void>;
    deleteProduct(id: string): Promise<void>;
    listOrders(): Promise<Array<Order>>;
    listProducts(): Promise<Array<Product>>;
    placeOrder(orderId: string, customerName: string, customerContact: string, items: Array<OrderItem>): Promise<void>;
    updateOrderStatus(orderId: string, status: OrderStatus): Promise<void>;
    updateProduct(id: string, name: string, description: string, volume: bigint, pricePerUnit: bigint, stockQuantity: bigint, isAvailable: boolean): Promise<void>;
}
