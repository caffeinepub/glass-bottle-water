import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { useAddProduct, useUpdateProduct } from '../hooks/useQueries';
import type { Product } from '../backend';

interface ProductFormModalProps {
  open: boolean;
  onClose: () => void;
  editProduct?: Product | null;
}

interface FormState {
  id: string;
  name: string;
  description: string;
  volume: string;
  pricePerUnit: string;
  stockQuantity: string;
  isAvailable: boolean;
}

const defaultForm: FormState = {
  id: '', name: '', description: '', volume: '', pricePerUnit: '', stockQuantity: '', isAvailable: true,
};

export default function ProductFormModal({ open, onClose, editProduct }: ProductFormModalProps) {
  const [form, setForm] = useState<FormState>(defaultForm);
  const [errors, setErrors] = useState<Partial<FormState>>({});

  const addProduct = useAddProduct();
  const updateProduct = useUpdateProduct();
  const isEdit = !!editProduct;
  const isPending = addProduct.isPending || updateProduct.isPending;

  useEffect(() => {
    if (editProduct) {
      setForm({
        id: editProduct.id,
        name: editProduct.name,
        description: editProduct.description,
        volume: editProduct.volume.toString(),
        pricePerUnit: (Number(editProduct.pricePerUnit) / 100).toFixed(2),
        stockQuantity: editProduct.stockQuantity.toString(),
        isAvailable: editProduct.isAvailable,
      });
    } else {
      setForm(defaultForm);
    }
    setErrors({});
  }, [editProduct, open]);

  const validate = (): boolean => {
    const e: Partial<FormState> = {};
    if (!form.id.trim()) e.id = 'Required';
    if (!form.name.trim()) e.name = 'Required';
    if (!form.volume || isNaN(Number(form.volume)) || Number(form.volume) <= 0) e.volume = 'Must be a positive number';
    if (!form.pricePerUnit || isNaN(Number(form.pricePerUnit)) || Number(form.pricePerUnit) < 0) e.pricePerUnit = 'Must be a valid price';
    if (!form.stockQuantity || isNaN(Number(form.stockQuantity)) || Number(form.stockQuantity) < 0) e.stockQuantity = 'Must be a non-negative number';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      id: form.id.trim(),
      name: form.name.trim(),
      description: form.description.trim(),
      volume: BigInt(Math.round(Number(form.volume))),
      pricePerUnit: BigInt(Math.round(Number(form.pricePerUnit) * 100)),
      stockQuantity: BigInt(Math.round(Number(form.stockQuantity))),
      isAvailable: form.isAvailable,
    };

    try {
      if (isEdit) {
        await updateProduct.mutateAsync(payload);
      } else {
        await addProduct.mutateAsync(payload);
      }
      onClose();
    } catch (err) {
      // error handled by mutation state
    }
  };

  const field = (key: keyof FormState, label: string, type = 'text', placeholder = '') => (
    <div className="space-y-1.5">
      <Label htmlFor={key} className="text-sm font-medium">{label}</Label>
      <Input
        id={key}
        type={type}
        placeholder={placeholder}
        value={form[key] as string}
        onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))}
        disabled={isEdit && key === 'id'}
        className={errors[key] ? 'border-destructive' : ''}
      />
      {errors[key] && <p className="text-xs text-destructive">{errors[key]}</p>}
    </div>
  );

  const error = addProduct.error || updateProduct.error;

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-w-lg rounded-2xl">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">{isEdit ? 'Edit Product' : 'Add New Product'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update the product details below.' : 'Fill in the details to add a new water bottle product.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="grid grid-cols-2 gap-4">
            {field('id', 'Product ID', 'text', 'e.g. bottle-500ml')}
            {field('name', 'Product Name', 'text', 'e.g. Pure Spring 500ml')}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="description" className="text-sm font-medium">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the product..."
              value={form.description}
              onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
              rows={2}
              className="resize-none"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            {field('volume', 'Volume (ml)', 'number', '500')}
            {field('pricePerUnit', 'Price (USD)', 'number', '1.99')}
            {field('stockQuantity', 'Stock Qty', 'number', '100')}
          </div>
          <div className="flex items-center gap-2.5 pt-1">
            <Checkbox
              id="isAvailable"
              checked={form.isAvailable}
              onCheckedChange={v => setForm(prev => ({ ...prev, isAvailable: !!v }))}
            />
            <Label htmlFor="isAvailable" className="text-sm font-medium cursor-pointer">Available for purchase</Label>
          </div>

          {error && (
            <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">
              {(error as Error).message}
            </p>
          )}

          <DialogFooter className="gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>Cancel</Button>
            <Button type="submit" disabled={isPending} className="gap-2">
              {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              {isEdit ? 'Save Changes' : 'Add Product'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
