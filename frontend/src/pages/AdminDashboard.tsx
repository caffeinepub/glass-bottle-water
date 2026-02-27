import React from 'react';
import { Lock, LayoutDashboard } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useAdmin } from '../context/AdminContext';
import ProductManagement from '../components/ProductManagement';
import OrderManagement from '../components/OrderManagement';
import { useNavigate } from '@tanstack/react-router';

export default function AdminDashboard() {
  const { isAdmin, toggleAdmin } = useAdmin();
  const navigate = useNavigate();

  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-20 max-w-md text-center">
        <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-6">
          <Lock className="w-10 h-10 text-muted-foreground/50" />
        </div>
        <h1 className="font-display font-extrabold text-2xl text-foreground mb-2">Admin Access Required</h1>
        <p className="text-muted-foreground mb-8">
          Enable admin mode using the toggle in the header to access the dashboard.
        </p>
        <div className="flex gap-3 justify-center">
          <Button variant="outline" onClick={() => navigate({ to: '/' })} className="rounded-xl">
            Back to Products
          </Button>
          <Button onClick={toggleAdmin} className="rounded-xl gap-2">
            <LayoutDashboard className="w-4 h-4" />
            Enable Admin Mode
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
            <LayoutDashboard className="w-5 h-5 text-primary" />
          </div>
          <h1 className="font-display font-extrabold text-2xl text-foreground">Admin Dashboard</h1>
        </div>
        <p className="text-sm text-muted-foreground ml-12">Manage your products and orders</p>
      </div>

      <Tabs defaultValue="products" className="space-y-6">
        <TabsList className="rounded-xl bg-muted/50 p-1 h-auto">
          <TabsTrigger value="products" className="rounded-lg px-6 py-2 font-medium data-[state=active]:bg-card data-[state=active]:shadow-xs">
            Products
          </TabsTrigger>
          <TabsTrigger value="orders" className="rounded-lg px-6 py-2 font-medium data-[state=active]:bg-card data-[state=active]:shadow-xs">
            Orders
          </TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="mt-0">
          <div className="bg-card rounded-2xl border border-border p-6 shadow-glass">
            <ProductManagement />
          </div>
        </TabsContent>

        <TabsContent value="orders" className="mt-0">
          <div className="bg-card rounded-2xl border border-border p-6 shadow-glass">
            <OrderManagement />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
