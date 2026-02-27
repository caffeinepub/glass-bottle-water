import React from 'react';
import { ShoppingCart, Droplets, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '../lib/utils';
import { formatPrice } from '../lib/utils';
import type { Product } from '../backend';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  cartQuantity?: number;
}

export default function ProductCard({ product, onAddToCart, cartQuantity = 0 }: ProductCardProps) {
  const isOutOfStock = !product.isAvailable || product.stockQuantity === BigInt(0);
  const isLowStock = !isOutOfStock && product.stockQuantity <= BigInt(5);

  return (
    <div
      className={cn(
        'group relative flex flex-col rounded-2xl border overflow-hidden transition-all duration-300',
        'bg-card shadow-glass hover:shadow-glass-lg hover:-translate-y-1',
        isOutOfStock && 'opacity-70'
      )}
    >
      {/* Image area */}
      <div className="relative overflow-hidden bg-water-surface h-52 flex items-center justify-center">
        <img
          src="/assets/generated/bottle-illustration.dim_400x400.png"
          alt="Clear glass water bottle"
          className={cn(
            'h-44 w-auto object-contain transition-transform duration-500 group-hover:scale-105 animate-float',
            isOutOfStock && 'grayscale'
          )}
        />
        {/* Availability badge */}
        <div className="absolute top-3 left-3">
          {isOutOfStock ? (
            <Badge variant="destructive" className="text-xs font-semibold">Out of Stock</Badge>
          ) : isLowStock ? (
            <Badge className="text-xs font-semibold bg-amber-500/90 text-white border-0">
              Only {product.stockQuantity.toString()} left
            </Badge>
          ) : (
            <Badge className="text-xs font-semibold bg-emerald-500/90 text-white border-0">In Stock</Badge>
          )}
        </div>
        {/* Cart quantity indicator */}
        {cartQuantity > 0 && (
          <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shadow-water">
            {cartQuantity}
          </div>
        )}
        {/* Decorative water ripple */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-card/30 to-transparent" />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        <div>
          <h3 className="font-display font-semibold text-base text-foreground leading-snug line-clamp-2">
            {product.name}
          </h3>
          {product.description && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{product.description}</p>
          )}
        </div>

        {/* Details */}
        <div className="flex items-center gap-3 text-sm">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Droplets className="w-3.5 h-3.5 text-primary/70" />
            <span className="font-medium">{product.volume.toString()} ml</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Package className="w-3.5 h-3.5 text-primary/70" />
            <span>{product.stockQuantity.toString()} units</span>
          </div>
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-border/50">
          <div>
            <span className="text-xl font-display font-bold text-primary">
              {formatPrice(product.pricePerUnit)}
            </span>
            <span className="text-xs text-muted-foreground ml-1">/ bottle</span>
          </div>
          <Button
            size="sm"
            onClick={() => onAddToCart(product)}
            disabled={isOutOfStock}
            className={cn(
              'gap-1.5 rounded-xl font-semibold transition-all',
              !isOutOfStock && 'hover:shadow-water'
            )}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            {cartQuantity > 0 ? 'Add More' : 'Add to Order'}
          </Button>
        </div>
      </div>
    </div>
  );
}
