import React from 'react';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../lib/utils';

export default function CartSummary() {
  const { items, removeItem, updateQuantity, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-water-surface flex items-center justify-center mb-4">
          <ShoppingBag className="w-8 h-8 text-primary/50" />
        </div>
        <h3 className="font-display font-semibold text-lg text-foreground">Your cart is empty</h3>
        <p className="text-sm text-muted-foreground mt-1">Add some products to get started</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {items.map(({ product, quantity }) => (
        <div
          key={product.id}
          className="flex items-center gap-4 p-4 rounded-xl bg-water-surface/50 border border-border/40"
        >
          {/* Bottle thumbnail */}
          <div className="w-14 h-14 rounded-lg bg-water-surface flex items-center justify-center flex-shrink-0 overflow-hidden">
            <img
              src="/assets/generated/bottle-illustration.dim_400x400.png"
              alt={product.name}
              className="h-12 w-auto object-contain"
            />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="font-display font-semibold text-sm text-foreground truncate">{product.name}</p>
            <p className="text-xs text-muted-foreground">{product.volume.toString()} ml · {formatPrice(product.pricePerUnit)} each</p>
          </div>

          {/* Quantity controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="w-7 h-7 rounded-lg"
              onClick={() => updateQuantity(product.id, quantity - 1)}
            >
              <Minus className="w-3 h-3" />
            </Button>
            <span className="w-6 text-center text-sm font-semibold">{quantity}</span>
            <Button
              variant="outline"
              size="icon"
              className="w-7 h-7 rounded-lg"
              onClick={() => updateQuantity(product.id, quantity + 1)}
              disabled={quantity >= Number(product.stockQuantity)}
            >
              <Plus className="w-3 h-3" />
            </Button>
          </div>

          {/* Line total */}
          <div className="text-right min-w-[70px]">
            <p className="font-display font-bold text-sm text-primary">
              {formatPrice(product.pricePerUnit * BigInt(quantity))}
            </p>
          </div>

          {/* Remove */}
          <Button
            variant="ghost"
            size="icon"
            className="w-7 h-7 rounded-lg text-muted-foreground hover:text-destructive"
            onClick={() => removeItem(product.id)}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      ))}

      <Separator className="my-1" />

      <div className="flex items-center justify-between px-1">
        <span className="font-display font-semibold text-foreground">Total</span>
        <span className="font-display font-bold text-xl text-primary">{formatPrice(totalPrice)}</span>
      </div>
    </div>
  );
}
