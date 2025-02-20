import { useState, useEffect } from 'react';
import { TransactionForm } from './components/TransactionForm';
import { TransactionList } from './components/TransactionList';
import { ExpensesChart } from './components/ExpensesChart';
import { Auth } from './components/Auth';
import { supabase } from "@/lib/supabase.tsx";
import { Button } from './components/ui/button';
import { ThemeToggle } from './components/ThemeToggle';
import { Toaster } from './components/ui/toaster';
import { useToast } from "@/hooks/use-toast.tsx";
import { Plus } from 'lucide-react';

interface Transaction {
  id: string;
  amount: number;
  description: string;
  date: string;
  category: string;
  user_id: string;
  created_at: string;
}

function App() {
  const [session, setSession] = useState<any>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) {
      fetchTransactions();
    }
  }, [session]);

  const fetchTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch transactions. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleSubmit = async (data: Omit<Transaction, 'id' | 'created_at' | 'user_id'>) => {
    try {
      if (editingTransaction) {
        const { error } = await supabase
          .from('transactions')
          .update(data)
          .eq('id', editingTransaction.id);

        if (error) throw error;
        setEditingTransaction(null);
        toast({
          title: 'Success',
          description: 'Transaction updated successfully.',
        });
      } else {
        const { error } = await supabase
          .from('transactions')
          .insert([{ ...data, user_id: session.user.id }]);

        if (error) throw error;
        setIsAddingNew(false);
        toast({
          title: 'Success',
          description: 'Transaction added successfully.',
        });
      }
      fetchTransactions();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save transaction. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!id) return;
    
    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchTransactions();
      toast({
        title: 'Success',
        description: 'Transaction deleted successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete transaction. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (transaction: Transaction) => {
    setIsAddingNew(false);
    setEditingTransaction(transaction);
  };

  const handleCancel = () => {
    setEditingTransaction(null);
    setIsAddingNew(false);
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast({
        title: 'Success',
        description: 'Signed out successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to sign out. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (!session) {
    return (
      <>
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        <Auth />
        <Toaster />
      </>
    );
  }

  return (
    <>
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Personal Finance Visualizer</h1>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Button onClick={handleSignOut} variant="outline">Sign Out</Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">
                {editingTransaction ? 'Edit Transaction' : 
                 isAddingNew ? 'Add Transaction' : 'Transactions'}
              </h2>
              {!isAddingNew && !editingTransaction && (
                <Button
                  onClick={() => setIsAddingNew(true)}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  New Transaction
                </Button>
              )}
            </div>
            {(isAddingNew || editingTransaction) && (
              <div className="bg-card p-6 rounded-lg shadow-sm">
                <TransactionForm
                  onSubmit={handleSubmit}
                  onCancel={handleCancel}
                  initialData={editingTransaction || undefined}
                />
              </div>
            )}
            {!isAddingNew && !editingTransaction && (
              <div className="bg-card p-6 rounded-lg shadow-sm">
                <TransactionList
                  transactions={transactions}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                />
              </div>
            )}
          </div>
          
          <div className="space-y-6">
            <div className="bg-card p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-bold mb-4">Monthly Expenses</h2>
              <ExpensesChart transactions={transactions} />
            </div>
          </div>
        </div>
      </main>
      <Toaster />
    </>
  );
}

export default App;