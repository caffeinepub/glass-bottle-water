import React, { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Search, SlidersHorizontal, Droplets, ShoppingCart } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useListProducts } from '../hooks/useQueries';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import { cn } from '../lib/utils';

type FilterType = 'all' | 'available' | 'out-of-stock';

export default function ProductCatalog() {
  const { data: products, isLoading, error } = useListProducts();
  const { addItem, items, totalItems } = useCart();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');

  const filtered = (products ?? []).filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      filter === 'all' ||
      (filter === 'available' && p.isAvailable && p.stockQuantity > BigInt(0)) ||
      (filter === 'out-of-stock' && (!p.isAvailable || p.stockQuantity === BigInt(0)));
    return matchesSearch && matchesFilter;
  });

  const getCartQty = (productId: string) =>
    items.find(i => i.product.id === productId)?.quantity ?? 0;

  const filterOptions: { value: FilterType; label: string }[] = [
    { value: 'all', label: 'All Products' },
    { value: 'available', label: 'In Stock' },
    { value: 'out-of-stock', label: 'Out of Stock' },
  ];

  return (
    <div>
      {/* Hero Banner */}
      <section className="relative overflow-hidden">
        <div className="relative h-64 md:h-80">
          <img
            src="/assets/generated/hero-banner.dim_1200x400.png"
            alt="Clear glass water bottles arranged on a white surface with light aqua water droplets"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-water-deep/70 via-water-primary/40 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16">
            <div className="max-w-lg">
              <div className="flex items-center gap-2 mb-3">
                <Droplets className="w-5 h-5 text-water-light" />
                <span className="text-water-light text-sm font-semibold tracking-wide uppercase">Premium Quality</span>
              </div>
              <h1 className="font-display font-extrabold text-3xl md:text-4xl text-white leading-tight mb-3">
                Pure Water,<br />Glass Bottled
              </h1>
              <p className="text-white/80 text-sm md:text-base mb-5 max-w-sm">
                Naturally sourced spring water, sealed in premium glass bottles for the purest taste.
              </p>
              {totalItems > 0 && (
                <Button
                  onClick={() => navigate({ to: '/checkout' })}
                  className="gap-2 rounded-xl bg-white text-water-deep hover:bg-white/90 font-semibold shadow-glass"
                >
                  <ShoppingCart className="w-4 h-4" />
                  View Cart ({totalItems})
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="container mx-auto px-4 py-10">
        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 rounded-xl"
            />
          </div>
          <div className="flex gap-2">
            {filterOptions.map(opt => (
              <button
                key={opt.value}
                onClick={() => setFilter(opt.value)}
                className={cn(
                  'px-4 py-2 rounded-xl text-sm font-medium transition-all border',
                  filter === opt.value
                    ? 'bg-primary text-primary-foreground border-primary shadow-water'
                    : 'bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground'
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm text-muted-foreground">
            {isLoading ? 'Loading...' : `${filtered.length} product${filtered.length !== 1 ? 's' : ''} found`}
          </p>
          {totalItems > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate({ to: '/checkout' })}
              className="gap-2 rounded-xl"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              Cart ({totalItems})
            </Button>
          )}
        </div>

        {/* Grid */}
        {error ? (
          <div className="text-center py-16">
            <p className="text-destructive font-medium">Failed to load products. Please try again.</p>
          </div>
        ) : isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="rounded-2xl border bg-card overflow-hidden">
                <Skeleton className="h-52 w-full" />
                <div className="p-5 space-y-3">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-9 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-water-surface flex items-center justify-center mb-4">
              <Droplets className="w-8 h-8 text-primary/40" />
            </div>
            <h3 className="font-display font-semibold text-lg text-foreground">No products found</h3>
            <p className="text-sm text-muted-foreground mt-1">Try adjusting your search or filter</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addItem}
                cartQuantity={getCartQty(product.id)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
