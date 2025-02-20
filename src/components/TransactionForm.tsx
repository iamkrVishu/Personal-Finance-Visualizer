import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';

const transactionSchema = z.object({
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  description: z.string().min(1, 'Description is required'),
  date: z.string().min(1, 'Date is required'),
  category: z.string().min(1, 'Category is required'),
});

type TransactionFormData = z.infer<typeof transactionSchema>;

interface TransactionFormProps {
  onSubmit: (data: TransactionFormData) => void;
  onCancel?: () => void;
  initialData?: TransactionFormData;
}

const categories = [
  'Food',
  'Shopping',
  'Transportation',
  'Entertainment',
  'Bills',
  'Healthcare',
  'Education',
  'Other'
];

export function TransactionForm({ onSubmit, onCancel, initialData }: TransactionFormProps) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: initialData,
  });

  const onSubmitHandler = async (data: TransactionFormData) => {
    onSubmit(data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Amount</label>
        <input
          type="number"
          step="0.01"
          {...register('amount', { valueAsNumber: true })}
          className="mt-1 block w-full rounded-md border bg-background text-foreground shadow-sm focus:border-primary focus:ring-primary"
        />
        {errors.amount && (
          <p className="mt-1 text-sm text-destructive">{errors.amount.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">Description</label>
        <input
          type="text"
          {...register('description')}
          className="mt-1 block w-full rounded-md border bg-background text-foreground shadow-sm focus:border-primary focus:ring-primary"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-destructive">{errors.description.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">Category</label>
        <select
          {...register('category')}
          className="mt-1 block w-full rounded-md border bg-background text-foreground shadow-sm focus:border-primary focus:ring-primary"
        >
          <option value="">Select a category</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
        {errors.category && (
          <p className="mt-1 text-sm text-destructive">{errors.category.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">Date</label>
        <input
          type="date"
          {...register('date')}
          className="mt-1 block w-full rounded-md border bg-background text-foreground shadow-sm focus:border-primary focus:ring-primary"
        />
        {errors.date && (
          <p className="mt-1 text-sm text-destructive">{errors.date.message}</p>
        )}
      </div>

      <div className="flex space-x-4">
        <Button type="submit">
          {initialData ? 'Update Transaction' : 'Add Transaction'}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}