'use client';

import { useState, useEffect } from 'react';
import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Transaction {
  id?: number; // Optional for new transactions
  productName: string;
  amount: string;
  customerName: string;
}

interface DrawerTransactionProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction?: Transaction | null;
  onSave: any; // Save handler for both add and edit
}

export default function DrawerTransaction({
  open,
  onOpenChange,
  transaction,
  onSave,
}: DrawerTransactionProps) {
  const [formData, setFormData] = useState<Transaction>({
    productName: '',
    amount: '',
    customerName: '',
  });

  // Update formData when transaction changes (e.g., edit mode)
  useEffect(() => {
    if (transaction) {
      setFormData(transaction);
    } else {
      // Reset form for adding new transaction
      setFormData({
        productName: '',
        amount: '',
        customerName: '',
      });
    }
  }, [transaction]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = () => {
    onSave(formData); // Use the parent-provided onSave function
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerOverlay />
      <DrawerContent>
        <div className="container mx-auto max-w-[600px] space-y-4 p-4">
          <DrawerHeader>
            {transaction ? 'Edit Transaction' : 'Add Transaction'}
          </DrawerHeader>
          <Input
            name="productName"
            placeholder="Product Name"
            value={formData.productName || ''}
            onChange={handleChange}
          />
          <Input
            name="amount"
            placeholder="Amount"
            type="number"
            value={formData.amount || ''}
            onChange={handleChange}
          />
          <Input
            name="customerName"
            placeholder="Customer Name"
            value={formData.customerName || ''}
            onChange={handleChange}
          />
          <DrawerFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button color="primary" onClick={handleSubmit}>
              Save
            </Button>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
