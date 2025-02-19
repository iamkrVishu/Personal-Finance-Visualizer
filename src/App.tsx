import { useState, useEffect } from 'react';
import { TransactionForm } from './components/TransactionForm';
import { TransactionList } from './components/TransactionList';
import { ExpensesChart } from './components/ExpensesChart';
import { Auth } from './components/Auth';
import { supabase } from './lib/supabase';
import { Button } from './components/ui/button';

interface Transaction {
  id: string;
  amount: number;
  description: string;
  date: string;
  user_id: string;
  created_at: string;
}

function App() {
  const [session, setSession] = useState<any>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

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
      console.error('Error fetching transactions:', error);
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
      } else {
        const { error } = await supabase
          .from('transactions')
          .insert([{ ...data, user_id: session.user.id }]);

        if (error) throw error;
      }
      fetchTransactions();
    } catch (error) {
      console.error('Error saving transaction:', error);
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
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Error signing out:', error);
  };

  if (!session) {
    return <Auth />;
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Personal Finance Visualizer</h1>
        <Button onClick={handleSignOut} variant="outline">Sign Out</Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-bold mb-4">
            {editingTransaction ? 'Edit Transaction' : 'Add Transaction'}
          </h2>
          <TransactionForm
            onSubmit={handleSubmit}
            initialData={editingTransaction}
          />
        </div>
        
        <div>
          <TransactionList
            transactions={transactions}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-xl font-bold mb-4">Monthly Expenses</h2>
        <ExpensesChart transactions={transactions} />
      </div>
    </main>
  );
}

export default App;