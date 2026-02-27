import React from 'react';
import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { CartProvider } from './context/CartContext';
import { AdminProvider } from './context/AdminContext';
import Layout from './components/Layout';
import ProductCatalog from './pages/ProductCatalog';
import Checkout from './pages/Checkout';
import AdminDashboard from './pages/AdminDashboard';

// Root route with layout
const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: ProductCatalog,
});

const checkoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/checkout',
  component: Checkout,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminDashboard,
});

const routeTree = rootRoute.addChildren([indexRoute, checkoutRoute, adminRoute]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <AdminProvider>
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider>
    </AdminProvider>
  );
}
