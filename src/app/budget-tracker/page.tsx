
'use client';

import { useState, useMemo } from 'react';
import PageHeader from '@/components/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { DollarSign, PlusCircle, TrendingDown, TrendingUp, Sparkles, FileDown, Landmark } from 'lucide-react';
import { format } from 'date-fns';

type Expense = {
  id: number;
  description: string;
  amount: number;
  category: 'Food' | 'Transport' | 'Accommodation' | 'Activities' | 'Other';
  date: Date;
};

const expenseCategories: Expense['category'][] = ['Food', 'Transport', 'Accommodation', 'Activities', 'Other'];

export default function BudgetTrackerPage() {
  const [budget, setBudget] = useState(100000);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [newExpense, setNewExpense] = useState({ description: '', amount: '', category: 'Food' as Expense['category'] });

  const totalSpent = useMemo(() => {
    return expenses.reduce((acc, expense) => acc + expense.amount, 0);
  }, [expenses]);

  const remainingBudget = useMemo(() => {
    return budget - totalSpent;
  }, [budget, totalSpent]);

  const handleAddExpense = () => {
    const amount = parseFloat(newExpense.amount);
    if (!newExpense.description || isNaN(amount) || amount <= 0) {
      // Basic validation
      return;
    }
    const expense: Expense = {
      id: Date.now(),
      description: newExpense.description,
      amount: amount,
      category: newExpense.category,
      date: new Date(),
    };
    setExpenses([...expenses, expense]);
    setNewExpense({ description: '', amount: '', category: 'Food' });
  };
  
  const budgetProgress = budget > 0 ? (totalSpent / budget) * 100 : 0;

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <PageHeader title="Budget Tracker" description="Keep track of your travel expenses and stay within your budget." />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">RS {budget.toLocaleString()}</div>
             <p className="text-xs text-muted-foreground">The total amount planned for the trip.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">RS {totalSpent.toLocaleString()}</div>
             <p className="text-xs text-muted-foreground">Total amount of expenses logged.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Remaining</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">RS {remainingBudget.toLocaleString()}</div>
             <p className="text-xs text-muted-foreground">{remainingBudget >= 0 ? 'Budget remaining.' : 'Over budget!'}</p>
          </CardContent>
        </Card>
      </div>

       {/* Budget Progress */}
        <Card>
            <CardContent className="pt-6">
                <Progress value={budgetProgress} />
                <p className="text-sm text-muted-foreground mt-2 text-center">
                    You have spent {budgetProgress.toFixed(1)}% of your budget.
                </p>
            </CardContent>
        </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Add Expense Form */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Add New Expense</CardTitle>
            <CardDescription>Log a new spending entry.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="total-budget">Set Total Budget (RS)</Label>
              <Input
                id="total-budget"
                type="number"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="mt-1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="e.g., Dinner, Museum tickets"
                value={newExpense.description}
                onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (RS)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="e.g., 1500"
                value={newExpense.amount}
                onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={newExpense.category}
                onValueChange={(value) => setNewExpense({ ...newExpense, category: value as Expense['category'] })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {expenseCategories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleAddExpense} className="w-full">
              <PlusCircle className="mr-2" /> Add Expense
            </Button>
          </CardContent>
        </Card>

        {/* Expenses Table */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Expense History</CardTitle>
            <CardDescription>A log of all your expenses for this trip.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses.length > 0 ? (
                  expenses.map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell>{format(expense.date, 'MMM dd')}</TableCell>
                      <TableCell className="font-medium">{expense.description}</TableCell>
                      <TableCell>{expense.category}</TableCell>
                      <TableCell className="text-right">RS {expense.amount.toLocaleString()}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      No expenses added yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Future Features Card */}
      <Card>
        <CardHeader>
          <CardTitle>Future Features</CardTitle>
          <CardDescription>Exciting new tools we're planning to add to the Budget Tracker.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="flex flex-col items-center justify-center rounded-lg border bg-card p-6 text-center shadow-sm">
              <Sparkles className="h-8 w-8 mb-2 text-primary" />
              <h3 className="font-semibold">AI Spending Insights</h3>
              <p className="text-sm text-muted-foreground mt-1">Get smart tips on how to save money. (Coming Soon)</p>
            </div>
            <div className="flex flex-col items-center justify-center rounded-lg border bg-card p-6 text-center shadow-sm">
              <FileDown className="h-8 w-8 mb-2 text-primary" />
              <h3 className="font-semibold">Export to CSV</h3>
              <p className="text-sm text-muted-foreground mt-1">Export your expense report for your records. (Coming Soon)</p>
            </div>
            <div className="flex flex-col items-center justify-center rounded-lg border bg-card p-6 text-center shadow-sm">
              <Landmark className="h-8 w-8 mb-2 text-primary" />
              <h3 className="font-semibold">Currency Conversion</h3>
              <p className="text-sm text-muted-foreground mt-1">Convert expenses from multiple currencies. (Coming Soon)</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
