import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Calendar, Edit2, Trash2 } from 'lucide-react';

interface Transaction {
  id: string;
  amount: number;
  description: string;
  date: string;
  category: string;
}

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
  onEdit: (transaction: Transaction) => void;
}

export function TransactionList({ transactions, onDelete, onEdit }: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No transactions yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Transactions</h2>
      <div className="divide-y divide-border">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="py-4 flex justify-between items-center">
            <div className="flex-1">
              <p className="font-medium">{transaction.description}</p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{format(new Date(transaction.date), 'PPP')}</span>
                <span className="px-2 py-1 rounded-full bg-muted text-xs">
                  {transaction.category}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className={`font-medium ${transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${Math.abs(transaction.amount).toFixed(2)}
              </span>
              <Button 
                variant="outline" 
                size="sm"
                className="flex items-center gap-2"
                onClick={() => onEdit(transaction)}
              >
                <Edit2 className="h-4 w-4" />
                Edit
              </Button>
              <Button 
                variant="destructive" 
                size="sm"
                className="flex items-center gap-2"
                onClick={() => transaction.id && onDelete(transaction.id)}
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}