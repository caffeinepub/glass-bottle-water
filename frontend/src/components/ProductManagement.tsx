import React, { useState } from 'react';
import { Plus, Pencil, Trash2, Loader2, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useListProducts, useDeleteProduct } from '../hooks/useQueries';
import { formatPrice } from '../lib/utils';
import ProductFormModal from './ProductFormModal';
import type { Product } from '../backend';

export default function ProductManagement() {
  const { data: products, isLoading } = useListProducts();
  const deleteProduct = useDeleteProduct();
  const [modalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);

  const handleEdit = (product: Product) => {
    setEditProduct(product);
    setModalOpen(true);
  };

  const handleAdd = () => {
    setEditProduct(null);
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
    setEditProduct(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-bold text-xl text-foreground">Products</h2>
          <p className="text-sm text-muted-foreground">{products?.length ?? 0} products in catalog</p>
        </div>
        <Button onClick={handleAdd} className="gap-2 rounded-xl">
          <Plus className="w-4 h-4" />
          Add Product
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-14 w-full rounded-xl" />)}
        </div>
      ) : !products?.length ? (
        <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-border rounded-2xl">
          <Package className="w-10 h-10 text-muted-foreground/40 mb-3" />
          <p className="font-display font-semibold text-foreground">No products yet</p>
          <p className="text-sm text-muted-foreground mt-1">Add your first product to get started</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="font-display font-semibold">Product</TableHead>
                <TableHead className="font-display font-semibold">Volume</TableHead>
                <TableHead className="font-display font-semibold">Price</TableHead>
                <TableHead className="font-display font-semibold">Stock</TableHead>
                <TableHead className="font-display font-semibold">Status</TableHead>
                <TableHead className="text-right font-display font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map(product => (
                <TableRow key={product.id} className="hover:bg-muted/20">
                  <TableCell>
                    <div>
                      <p className="font-semibold text-sm text-foreground">{product.name}</p>
                      <p className="text-xs text-muted-foreground font-mono">{product.id}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{product.volume.toString()} ml</TableCell>
                  <TableCell className="text-sm font-semibold text-primary">{formatPrice(product.pricePerUnit)}</TableCell>
                  <TableCell className="text-sm">{product.stockQuantity.toString()}</TableCell>
                  <TableCell>
                    {product.isAvailable && product.stockQuantity > BigInt(0) ? (
                      <Badge className="bg-emerald-500/15 text-emerald-700 border-emerald-200 text-xs">Available</Badge>
                    ) : (
                      <Badge variant="destructive" className="text-xs">Unavailable</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg" onClick={() => handleEdit(product)}>
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg text-muted-foreground hover:text-destructive">
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="rounded-2xl">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Product</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete <strong>{product.name}</strong>? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteProduct.mutate(product.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              {deleteProduct.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Delete'}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <ProductFormModal open={modalOpen} onClose={handleClose} editProduct={editProduct} />
    </div>
  );
}
