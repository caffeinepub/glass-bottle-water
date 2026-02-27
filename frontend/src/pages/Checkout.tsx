import React, { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { ArrowLeft, ShoppingBag, User, Phone, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import CartSummary from '../components/CartSummary';
import { useCart } from '../context/CartContext';
import { usePlaceOrder } from '../hooks/useQueries';
import { formatPrice, generateOrderId } from '../lib/utils';

interface CustomerForm {
  name: string;
  contact: string;
}

export default function Checkout() {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();
  const placeOrder = usePlaceOrder();
  const [form, setForm] = useState<CustomerForm>({ name: '', contact: '' });
  const [errors, setErrors] = useState<Partial<CustomerForm>>({});
  const [confirmedOrderId, setConfirmedOrderId] = useState<string | null>(null);

  const validate = (): boolean => {
    const e: Partial<CustomerForm> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.contact.trim()) e.contact = 'Contact is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || items.length === 0) return;

    const orderId = generateOrderId();
    const orderItems = items.map(i => ({
      productId: i.product.id,
      quantity: BigInt(i.quantity),
    }));

    try {
      await placeOrder.mutateAsync({
        orderId,
        customerName: form.name.trim(),
        customerContact: form.contact.trim(),
        items: orderItems,
      });
      setConfirmedOrderId(orderId);
      clearCart();
    } catch {
      // error shown below
    }
  };

  // Success state
  if (confirmedOrderId) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-lg text-center">
        <div className="w-20 h-20 rounded-full bg-emerald-500/15 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-emerald-600" />
        </div>
        <h1 className="font-display font-extrabold text-3xl text-foreground mb-2">Order Placed!</h1>
        <p className="text-muted-foreground mb-6">
          Thank you, <strong>{form.name}</strong>! Your order has been received and is being processed.
        </p>
        <div className="bg-water-surface rounded-2xl p-5 mb-8 text-left space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Order ID</span>
            <span className="font-mono text-sm font-semibold text-foreground">{confirmedOrderId}</span>
          </div>
          <Separator />
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Contact</span>
            <span className="text-sm font-medium text-foreground">{form.contact}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Status</span>
            <span className="text-sm font-semibold text-amber-600 bg-amber-500/15 px-2.5 py-0.5 rounded-full">Pending</span>
          </div>
        </div>
        <div className="flex gap-3 justify-center">
          <Button variant="outline" onClick={() => navigate({ to: '/' })} className="gap-2 rounded-xl">
            <ArrowLeft className="w-4 h-4" />
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Button variant="ghost" size="icon" onClick={() => navigate({ to: '/' })} className="rounded-xl">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="font-display font-extrabold text-2xl text-foreground">Checkout</h1>
          <p className="text-sm text-muted-foreground">Review your order and enter your details</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Cart Summary */}
        <div className="lg:col-span-3">
          <div className="bg-card rounded-2xl border border-border p-6 shadow-glass">
            <div className="flex items-center gap-2 mb-5">
              <ShoppingBag className="w-5 h-5 text-primary" />
              <h2 className="font-display font-bold text-lg text-foreground">Order Summary</h2>
            </div>
            <CartSummary />
          </div>
        </div>

        {/* Customer Form */}
        <div className="lg:col-span-2">
          <div className="bg-card rounded-2xl border border-border p-6 shadow-glass sticky top-24">
            <h2 className="font-display font-bold text-lg text-foreground mb-5">Your Details</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-sm font-medium flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-primary" />
                  Full Name
                </Label>
                <Input
                  id="name"
                  placeholder="Enter your name"
                  value={form.name}
                  onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                  className={`rounded-xl ${errors.name ? 'border-destructive' : ''}`}
                />
                {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="contact" className="text-sm font-medium flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-primary" />
                  Contact (Phone / Email)
                </Label>
                <Input
                  id="contact"
                  placeholder="Phone or email"
                  value={form.contact}
                  onChange={e => setForm(prev => ({ ...prev, contact: e.target.value }))}
                  className={`rounded-xl ${errors.contact ? 'border-destructive' : ''}`}
                />
                {errors.contact && <p className="text-xs text-destructive">{errors.contact}</p>}
              </div>

              <Separator className="my-2" />

              <div className="flex items-center justify-between py-1">
                <span className="text-sm text-muted-foreground">Order Total</span>
                <span className="font-display font-bold text-xl text-primary">{formatPrice(totalPrice)}</span>
              </div>

              {placeOrder.error && (
                <p className="text-sm text-destructive bg-destructive/10 rounded-xl px-3 py-2">
                  {(placeOrder.error as Error).message}
                </p>
              )}

              <Button
                type="submit"
                className="w-full gap-2 rounded-xl h-11 font-semibold text-base"
                disabled={placeOrder.isPending || items.length === 0}
              >
                {placeOrder.isPending ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Placing Order...</>
                ) : (
                  <>Place Order · {formatPrice(totalPrice)}</>
                )}
              </Button>

              {items.length === 0 && (
                <p className="text-xs text-center text-muted-foreground">Add items to your cart first</p>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
