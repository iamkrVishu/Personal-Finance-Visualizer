import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { format, parseISO, startOfMonth, endOfMonth } from 'date-fns';

interface Transaction {
  _id: string;
  amount: number;
  date: string;
}

interface ExpensesChartProps {
  transactions: Transaction[];
}

export function ExpensesChart({ transactions }: ExpensesChartProps) {
  const monthlyData = transactions.reduce((acc: any[], transaction) => {
    const date = parseISO(transaction.date);
    const monthKey = format(date, 'yyyy-MM');
    const existingMonth = acc.find(item => item.month === monthKey);

    if (existingMonth) {
      existingMonth.amount += transaction.amount;
    } else {
      acc.push({
        month: monthKey,
        amount: transaction.amount,
      });
    }

    return acc;
  }, []);

  const sortedData = monthlyData.sort((a, b) => a.month.localeCompare(b.month));

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={sortedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="month"
            tickFormatter={(value) => format(parseISO(value), 'MMM yyyy')}
          />
          <YAxis />
          <Tooltip
            labelFormatter={(value) => format(parseISO(value), 'MMMM yyyy')}
            formatter={(value: number) => [`$${Math.abs(value).toFixed(2)}`, 'Amount']}
          />
          <Bar dataKey="amount" fill="#4f46e5" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}