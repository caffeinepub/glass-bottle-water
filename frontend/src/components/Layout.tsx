import React from 'react';
import { Link, useLocation } from '@tanstack/react-router';
import { ShoppingCart, Droplets, LayoutDashboard, Package } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAdmin } from '../context/AdminContext';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { cn } from '../lib/utils';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { totalItems } = useCart();
  const { isAdmin, toggleAdmin } = useAdmin();
  const location = useLocation();

  const navLinks = [
    { to: '/', label: 'Products', icon: Package },
    { to: '/checkout', label: 'Cart', icon: ShoppingCart, badge: totalItems },
    ...(isAdmin ? [{ to: '/admin', label: 'Admin', icon: LayoutDashboard }] : []),
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-card/80 backdrop-blur-xl shadow-xs">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Droplets className="w-5 h-5 text-primary" />
            </div>
            <div>
              <span className="font-display font-bold text-lg text-foreground leading-none block">AquaPure</span>
              <span className="text-xs text-muted-foreground leading-none">Glass Bottle Water</span>
            </div>
          </Link>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label, icon: Icon, badge }) => (
              <Link
                key={to}
                to={to}
                className={cn(
                  'relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
                  location.pathname === to
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                )}
              >
                <Icon className="w-4 h-4" />
                {label}
                {badge !== undefined && badge > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">
                    {badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          {/* Admin Toggle */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground font-medium hidden sm:block">Admin</span>
              <Switch
                checked={isAdmin}
                onCheckedChange={toggleAdmin}
                className="data-[state=checked]:bg-primary"
              />
            </div>
            {/* Mobile cart */}
            <Link to="/checkout" className="md:hidden relative p-2 rounded-lg hover:bg-accent transition-colors">
              <ShoppingCart className="w-5 h-5 text-foreground" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile nav */}
        <div className="md:hidden border-t border-border/40 px-4 py-2 flex gap-1">
          {navLinks.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={cn(
                'flex-1 flex flex-col items-center gap-1 py-1.5 rounded-lg text-xs font-medium transition-all',
                location.pathname === to
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
        </div>
      </header>

      {/* Main */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/60 bg-card/50 py-8 mt-auto">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Droplets className="w-4 h-4 text-primary" />
              <span className="text-sm font-display font-semibold text-foreground">AquaPure</span>
              <span className="text-sm text-muted-foreground">— Pure water, pure life.</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} AquaPure. Built with{' '}
              <span className="text-destructive">♥</span> using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== 'undefined' ? window.location.hostname : 'aquapure-glass-bottle')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
